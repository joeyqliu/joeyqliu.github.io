"use client";

// Host <-> board sync for "one laptop, two windows".
// The host window owns the state. Every change is written to localStorage (so a
// refresh recovers) and broadcast on a BroadcastChannel to any open board windows.

import { useCallback, useEffect, useRef, useState } from "react";
import { initialState, reducer, type Action, type GameEvent, type GameState } from "./game";

const KEY = "ff-game-v1";
const CHANNEL = "ff-game-v1";

type Msg = { type: "state"; state: GameState } | { type: "hello" } | { type: "ping" };

function load(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function useHostGame() {
  const [state, setState] = useState<GameState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [boardSeenAt, setBoardSeenAt] = useState(0);
  const [now, setNow] = useState(0);
  const history = useRef<GameState[]>([]);
  const chan = useRef<BroadcastChannel | null>(null);
  const stateRef = useRef(state);
  const [undoCount, setUndoCount] = useState(0);

  useEffect(() => {
    const saved = load();
    if (saved) {
      stateRef.current = saved;
      // Hydrate from localStorage after mount (static export has no storage at build time).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(saved);
    }
    setLoaded(true);
    const c = new BroadcastChannel(CHANNEL);
    chan.current = c;
    c.onmessage = (e: MessageEvent<Msg>) => {
      if (e.data.type === "hello" || e.data.type === "ping") setBoardSeenAt(Date.now());
      if (e.data.type === "hello") c.postMessage({ type: "state", state: stateRef.current } satisfies Msg);
    };
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      c.close();
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    stateRef.current = state;
    if (!loaded) return;
    localStorage.setItem(KEY, JSON.stringify(state));
    chan.current?.postMessage({ type: "state", state } satisfies Msg);
  }, [state, loaded]);

  const dispatch = useCallback((a: Action) => {
    const s = stateRef.current;
    const next = reducer(s, a);
    if (next === s) return;
    history.current = [...history.current.slice(-99), s];
    setUndoCount(history.current.length);
    stateRef.current = next;
    setState(next);
  }, []);

  const undo = useCallback(() => {
    const prev = history.current.pop();
    setUndoCount(history.current.length);
    if (!prev) return;
    // Bump the event id past anything the board has seen, with no effect attached,
    // so the board neither replays an old effect nor skips the next real one.
    const next: GameState = { ...prev, event: { id: stateRef.current.event.id + 1, kind: "none" } };
    stateRef.current = next;
    setState(next);
  }, []);

  const boardConnected = now - boardSeenAt < 4000;
  return { state, dispatch, undo, canUndo: undoCount > 0, loaded, boardConnected };
}

/**
 * Board side: mirrors the host's state and calls `onEvent` once for each new
 * host event (reveal, strike, award, ...) so the board can play effects. The
 * event that was current when the board loaded is not replayed.
 */
export function useBoardState(onEvent?: (ev: GameEvent, state: GameState) => void) {
  const [state, setState] = useState<GameState | null>(null);
  const onEventRef = useRef(onEvent);
  const lastEvent = useRef<number | null>(null);

  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    const receive = (next: GameState) => {
      const last = lastEvent.current;
      lastEvent.current = Math.max(last ?? -1, next.event.id);
      setState(next);
      if (last !== null && next.event.id > last) onEventRef.current?.(next.event, next);
    };
    const saved = load();
    if (saved) {
      lastEvent.current = saved.event.id;
      // Hydrate from localStorage after mount (static export has no storage at build time).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(saved);
    } else {
      lastEvent.current = null;
    }
    const c = new BroadcastChannel(CHANNEL);
    c.onmessage = (e: MessageEvent<Msg>) => {
      if (e.data.type !== "state") return;
      // First message with no saved state: adopt it without replaying its event.
      if (lastEvent.current === null) lastEvent.current = e.data.state.event.id;
      receive(e.data.state);
    };
    c.postMessage({ type: "hello" } satisfies Msg);
    const ping = setInterval(() => c.postMessage({ type: "ping" } satisfies Msg), 2000);
    // Fallback: other tabs writing localStorage.
    const onStorage = (e: StorageEvent) => {
      if (e.key !== KEY || !e.newValue) return;
      const next = JSON.parse(e.newValue) as GameState;
      if (lastEvent.current === null) lastEvent.current = next.event.id;
      receive(next);
    };
    window.addEventListener("storage", onStorage);
    return () => {
      c.close();
      clearInterval(ping);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return state;
}
