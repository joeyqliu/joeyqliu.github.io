// Pure Family Feud game logic. No React / DOM here so it can be unit-tested with `node --test`.

export type Answer = { ans: string; pnt: number };
export type Question = { question: string; answers: Answer[]; multiply: number };

export const BANK: Question[] = [
  {
    question: "In The Bible, Name A Creature Noah Would Have Had The Hardest Time Capturing Two Of For His Ark.",
    answers: [
      { ans: "Elephant", pnt: 31 },
      { ans: "Lion/Big Cats", pnt: 27 },
      { ans: "Snake", pnt: 15 },
      { ans: "Birds", pnt: 11 },
      { ans: "Shark", pnt: 8 },
      { ans: "Whales", pnt: 5 },
    ],
    multiply: 1,
  },
  {
    question: "Name A Way You Might Be Able to Tell Your Baby Is Really An Alien",
    answers: [
      { ans: "Strange Appearance", pnt: 19 },
      { ans: "Weird Eyes", pnt: 18 },
      { ans: "Large Ears", pnt: 7 },
      { ans: "Antennas", pnt: 6 },
      { ans: "Speech", pnt: 6 },
      { ans: "He Can Fly", pnt: 4 },
    ],
    multiply: 1,
  },
  {
    question: "Other Than An Airplane, What Might A Cartoon Character Use To Help Them Fly?",
    answers: [
      { ans: "Wings", pnt: 46 },
      { ans: "Arms", pnt: 18 },
      { ans: "Bird", pnt: 13 },
      { ans: "Balloon", pnt: 8 },
      { ans: "Kite", pnt: 4 },
      { ans: "Magic Carpet", pnt: 4 },
    ],
    multiply: 1,
  },
  {
    question: "Which Olympic Sport Would A Cow Look Most Funny Participating In?",
    answers: [
      { ans: "Running", pnt: 33 },
      { ans: "Swimming", pnt: 19 },
      { ans: "Skiing", pnt: 15 },
      { ans: "Long Jump", pnt: 10 },
      { ans: "Gymnastics", pnt: 9 },
      { ans: "Figure Skating", pnt: 8 },
    ],
    multiply: 1,
  },
  {
    question: "Name Something You Need In Order To Go Sledding.",
    answers: [
      { ans: "Sled", pnt: 42 },
      { ans: "Snow", pnt: 24 },
      { ans: "Hill", pnt: 12 },
      { ans: "Mittens", pnt: 10 },
      { ans: "Jacket", pnt: 4 },
      { ans: "Boots", pnt: 4 },
    ],
    multiply: 1,
  },
  {
    question: "What Christmas “Gift” Can You Give Someone, Without Going Shopping?",
    answers: [
      { ans: "Money", pnt: 37 },
      { ans: "Love", pnt: 20 },
      { ans: "Baked Goods", pnt: 13 },
      { ans: "Card", pnt: 11 },
      { ans: "Gift Card", pnt: 8 },
      { ans: "Hugs/Kiss", pnt: 8 },
    ],
    multiply: 1,
  },
];

/** Bank question indexes for each match: match 1, match 2, final. */
export const MATCH_QUESTIONS: [number, number][] = [
  [0, 1],
  [2, 3],
  [4, 5],
];

export type Side = 0 | 1;

export type Round = {
  q: number;
  revealed: boolean[];
  strikes: number;
  bank: number;
  awardedTo: Side | null;
  showQuestion: boolean;
};

export type Match = {
  /** Indexes into GameState.teams. */
  teams: [number, number];
  scores: [number, number];
  /** Bank question indexes; a tiebreaker gets appended on a tie. */
  questions: number[];
  roundIndex: number;
  winner: number | null;
};

export type GameEvent =
  | { id: number; kind: "none" }
  | { id: number; kind: "reveal"; index: number }
  | { id: number; kind: "strike"; count: number }
  | { id: number; kind: "award"; side: Side; points: number }
  | { id: number; kind: "round" }
  | { id: number; kind: "teamReveal"; index: number }
  | { id: number; kind: "matchOver"; winner: number }
  | { id: number; kind: "champion"; team: number };

export type GameState = {
  stage: "setup" | "intro" | "playing" | "matchOver" | "champion";
  teams: string[];
  /** How many team names have been revealed on the board's "meet the teams" screen (0–4). */
  introRevealed: number;
  matches: Match[];
  matchIndex: number;
  round: Round | null;
  champion: number | null;
  event: GameEvent;
};

export type Action =
  | { type: "start"; teams: string[] }
  | { type: "revealTeam" }
  | { type: "beginMatches" }
  | { type: "reveal"; index: number }
  | { type: "strike" }
  | { type: "clearStrikes" }
  | { type: "award"; side: Side }
  | { type: "toggleQuestion" }
  | { type: "next" }
  | { type: "nextMatch" }
  | { type: "reset" };

type EventBody = GameEvent extends infer E ? (E extends GameEvent ? Omit<E, "id"> : never) : never;

export function initialState(): GameState {
  return {
    stage: "setup",
    teams: ["Team 1", "Team 2", "Team 3", "Team 4"],
    introRevealed: 0,
    matches: [],
    matchIndex: 0,
    round: null,
    champion: null,
    event: { id: 0, kind: "none" },
  };
}

const newRound = (q: number): Round => ({
  q,
  revealed: BANK[q].answers.map(() => false),
  strikes: 0,
  bank: 0,
  awardedTo: null,
  showQuestion: false,
});

const newMatch = (teams: [number, number], questions: [number, number]): Match => ({
  teams,
  scores: [0, 0],
  questions: [...questions],
  roundIndex: 0,
  winner: null,
});

const withEvent = (s: GameState, e: EventBody): GameState => ({
  ...s,
  event: { ...e, id: s.event.id + 1 } as GameEvent,
});

const updateMatch = (s: GameState, patch: Partial<Match>): Match[] =>
  s.matches.map((m, i) => (i === s.matchIndex ? { ...m, ...patch } : m));

export function reducer(s: GameState, a: Action): GameState {
  const match = s.matches[s.matchIndex];
  const round = s.round;

  switch (a.type) {
    case "start": {
      const teams = [0, 1, 2, 3].map((i) => (a.teams[i] ?? "").trim() || `Team ${i + 1}`);
      return withEvent({ ...initialState(), stage: "intro", teams, event: s.event }, { kind: "none" });
    }

    case "revealTeam": {
      if (s.stage !== "intro" || s.introRevealed >= 4) return s;
      return withEvent(
        { ...s, introRevealed: s.introRevealed + 1 },
        { kind: "teamReveal", index: s.introRevealed },
      );
    }

    case "beginMatches": {
      if (s.stage !== "intro" || s.introRevealed < 4) return s;
      return withEvent(
        {
          ...s,
          stage: "playing",
          matches: [newMatch([0, 1], MATCH_QUESTIONS[0])],
          matchIndex: 0,
          round: newRound(MATCH_QUESTIONS[0][0]),
        },
        { kind: "round" },
      );
    }

    case "reveal": {
      if (s.stage !== "playing" || !round || round.revealed[a.index] !== false) return s;
      const revealed = round.revealed.map((r, i) => r || i === a.index);
      const q = BANK[round.q];
      const bank = round.awardedTo === null ? round.bank + q.answers[a.index].pnt * q.multiply : round.bank;
      return withEvent({ ...s, round: { ...round, revealed, bank } }, { kind: "reveal", index: a.index });
    }

    case "strike": {
      if (s.stage !== "playing" || !round) return s;
      const strikes = Math.min(3, round.strikes + 1);
      return withEvent({ ...s, round: { ...round, strikes } }, { kind: "strike", count: strikes });
    }

    case "clearStrikes": {
      if (s.stage !== "playing" || !round) return s;
      return { ...s, round: { ...round, strikes: 0 } };
    }

    case "award": {
      if (s.stage !== "playing" || !round || !match || round.awardedTo !== null) return s;
      const scores: [number, number] = [...match.scores];
      scores[a.side] += round.bank;
      return withEvent(
        { ...s, matches: updateMatch(s, { scores }), round: { ...round, awardedTo: a.side } },
        { kind: "award", side: a.side, points: round.bank },
      );
    }

    case "toggleQuestion": {
      if (s.stage !== "playing" || !round) return s;
      return { ...s, round: { ...round, showQuestion: !round.showQuestion } };
    }

    case "next": {
      if (s.stage !== "playing" || !match) return s;
      const nextIndex = match.roundIndex + 1;
      if (nextIndex < match.questions.length) {
        const q = match.questions[nextIndex];
        return withEvent(
          { ...s, matches: updateMatch(s, { roundIndex: nextIndex }), round: newRound(q) },
          { kind: "round" },
        );
      }
      const [a0, a1] = match.scores;
      if (a0 === a1) {
        // Tiebreaker: first bank question this match hasn't used yet.
        const tb = BANK.findIndex((_, i) => !match.questions.includes(i));
        const q = tb === -1 ? match.questions[0] : tb;
        return withEvent(
          {
            ...s,
            matches: updateMatch(s, { questions: [...match.questions, q], roundIndex: nextIndex }),
            round: newRound(q),
          },
          { kind: "round" },
        );
      }
      const winner = a0 > a1 ? match.teams[0] : match.teams[1];
      const matches = updateMatch(s, { winner });
      if (s.matchIndex === 2) {
        return withEvent({ ...s, matches, stage: "champion", champion: winner }, { kind: "champion", team: winner });
      }
      return withEvent({ ...s, matches, stage: "matchOver" }, { kind: "matchOver", winner });
    }

    case "nextMatch": {
      if (s.stage !== "matchOver") return s;
      const i = s.matchIndex + 1;
      const teams: [number, number] =
        i === 1 ? [2, 3] : [s.matches[0].winner ?? 0, s.matches[1].winner ?? 2];
      const m = newMatch(teams, MATCH_QUESTIONS[i]);
      return withEvent(
        { ...s, stage: "playing", matchIndex: i, matches: [...s.matches, m], round: newRound(m.questions[0]) },
        { kind: "round" },
      );
    }

    case "reset":
      return withEvent({ ...initialState(), event: s.event }, { kind: "none" });
  }
}

/** Label for the bracket stage of a match index. */
export const matchLabel = (i: number) => (i === 2 ? "FINAL" : `MATCH ${i + 1}`);
