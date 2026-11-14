import { test } from "node:test";
import assert from "node:assert/strict";
import { BANK, initialState, reducer, type GameState, type Action } from "./game.ts";

const TEAMS = ["Lions", "Tigers", "Bears", "Wolves"];
const run = (s: GameState, ...actions: Action[]) => actions.reduce(reducer, s);
const introduced = () => run(initialState(), { type: "start", teams: TEAMS });
const started = () =>
  run(
    introduced(),
    { type: "revealTeam" },
    { type: "revealTeam" },
    { type: "revealTeam" },
    { type: "revealTeam" },
    { type: "beginMatches" },
  );

test("bank typos are fixed and every question has 6 answers", () => {
  assert.equal(BANK.length, 6);
  for (const q of BANK) assert.equal(q.answers.length, 6);
  const all = BANK.flatMap((q) => q.answers.map((a) => a.ans));
  assert.ok(all.includes("Long Jump"));
  assert.ok(all.includes("Magic Carpet"));
});

test("beginMatches: match 1 is team 0 vs 1 on question 0", () => {
  const s = started();
  assert.equal(s.stage, "playing");
  assert.deepEqual(s.matches[0].teams, [0, 1]);
  assert.deepEqual(s.matches[0].questions, [0, 1]);
  assert.equal(s.round?.q, 0);
  assert.equal(s.round?.bank, 0);
});

test("start goes to the team intro with no teams revealed and no match yet", () => {
  const s = introduced();
  assert.equal(s.stage, "intro");
  assert.equal(s.introRevealed, 0);
  assert.equal(s.matches.length, 0);
  assert.equal(s.round, null);
});

test("revealTeam reveals teams one at a time in order, max 4, with an event each", () => {
  let s = run(introduced(), { type: "revealTeam" });
  assert.equal(s.introRevealed, 1);
  assert.deepEqual(s.event.kind, "teamReveal");
  assert.equal(s.event.kind === "teamReveal" && s.event.index, 0);
  s = run(s, { type: "revealTeam" }, { type: "revealTeam" }, { type: "revealTeam" });
  assert.equal(s.introRevealed, 4);
  assert.equal(s.event.kind === "teamReveal" && s.event.index, 3);
  assert.equal(run(s, { type: "revealTeam" }), s);
});

test("beginMatches only works once all 4 teams are revealed", () => {
  const partial = run(introduced(), { type: "revealTeam" });
  assert.equal(run(partial, { type: "beginMatches" }), partial);
});

test("start trims names and falls back to Team N for blanks", () => {
  const s = run(initialState(), { type: "start", teams: ["  A  ", "", "C", " "] });
  assert.deepEqual(s.teams, ["A", "Team 2", "C", "Team 4"]);
});

test("reveal adds points to the bank once; revealing twice is a no-op", () => {
  const s = run(started(), { type: "reveal", index: 0 }, { type: "reveal", index: 0 }, { type: "reveal", index: 2 });
  assert.equal(s.round?.bank, 31 + 15);
  assert.deepEqual(s.round?.revealed, [true, false, true, false, false, false]);
});

test("strikes cap at 3", () => {
  const s = run(started(), { type: "strike" }, { type: "strike" }, { type: "strike" }, { type: "strike" });
  assert.equal(s.round?.strikes, 3);
});

test("award gives the bank to one side once; later reveals don't change the bank or scores", () => {
  const s = run(
    started(),
    { type: "reveal", index: 0 },
    { type: "award", side: 1 },
    { type: "award", side: 0 },
    { type: "reveal", index: 1 },
  );
  assert.deepEqual(s.matches[0].scores, [0, 31]);
  assert.equal(s.round?.awardedTo, 1);
  assert.equal(s.round?.bank, 31);
  assert.equal(s.round?.revealed[1], true);
});

test("events get a fresh id per action so the board can replay effects", () => {
  const a = run(started(), { type: "strike" });
  const b = run(a, { type: "strike" });
  assert.equal(a.event.kind, "strike");
  assert.ok(b.event.id > a.event.id);
});

test("next moves to question 2 of the match, then ends the match with a winner", () => {
  let s = run(started(), { type: "reveal", index: 0 }, { type: "award", side: 0 }, { type: "next" });
  assert.equal(s.round?.q, 1);
  assert.equal(s.matches[0].roundIndex, 1);
  s = run(s, { type: "reveal", index: 5 }, { type: "award", side: 1 }, { type: "next" });
  assert.equal(s.stage, "matchOver");
  assert.equal(s.matches[0].winner, 0); // 31 vs 4
});

test("tie after 2 questions adds a tiebreaker not already played in that match", () => {
  // Both rounds awarded with an empty bank -> 0 vs 0.
  const s = run(started(), { type: "award", side: 0 }, { type: "next" }, { type: "award", side: 1 }, { type: "next" });
  assert.equal(s.stage, "playing");
  assert.equal(s.matches[0].questions.length, 3);
  const tb = s.matches[0].questions[2];
  assert.ok(![0, 1].includes(tb));
  assert.equal(s.round?.q, tb);
  assert.equal(s.matches[0].winner, null);
});

const winMatch = (s: GameState, side: 0 | 1) =>
  run(s, { type: "reveal", index: 0 }, { type: "award", side }, { type: "next" }, { type: "next" });

test("bracket: match 2 is team 2 vs 3, final is the two winners on questions 4 and 5", () => {
  let s = winMatch(started(), 1); // Tigers win
  assert.equal(s.stage, "matchOver");
  s = run(s, { type: "nextMatch" });
  assert.deepEqual(s.matches[1].teams, [2, 3]);
  assert.deepEqual(s.matches[1].questions, [2, 3]);
  assert.equal(s.round?.q, 2);
  s = winMatch(s, 0); // Bears win
  s = run(s, { type: "nextMatch" });
  assert.deepEqual(s.matches[2].teams, [1, 2]);
  assert.deepEqual(s.matches[2].questions, [4, 5]);
  assert.equal(s.round?.q, 4);
});

test("winning the final crowns a champion", () => {
  let s = run(winMatch(started(), 0), { type: "nextMatch" });
  s = run(winMatch(s, 1), { type: "nextMatch" });
  s = winMatch(s, 1); // final: team 0 vs team 3, team 3 wins
  assert.equal(s.stage, "champion");
  assert.equal(s.champion, 3);
  assert.equal(s.event.kind, "champion");
});

test("next is ignored outside of play; nextMatch is ignored unless a match is over", () => {
  const s0 = initialState();
  assert.equal(run(s0, { type: "next" }), s0);
  const s1 = started();
  assert.equal(run(s1, { type: "nextMatch" }), s1);
  assert.equal(run(s0, { type: "revealTeam" }), s0);
  assert.equal(run(s1, { type: "revealTeam" }), s1);
});

test("toggleQuestion flips board visibility; reset returns to setup", () => {
  const s = run(started(), { type: "toggleQuestion" });
  assert.equal(s.round?.showQuestion, true);
  assert.equal(run(s, { type: "reset" }).stage, "setup");
});
