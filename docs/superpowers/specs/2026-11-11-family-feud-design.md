# Family Feud — design (short)

**Why:** A live 4-team Family Feud bracket for the same crowd events as `/spinner`. The host runs it from a laptop; the audience watches a projector. Real buzzers are used, so the app is only the board and the scorekeeper.

**What**
- Hidden routes (noindex, unlinked): `/ff` = host console, `/ff/board` = audience board.
- **Sync (approach A, chosen):** one laptop, two windows. The host window owns the state and broadcasts every change over `BroadcastChannel`; it also writes it to `localStorage` so a refreshed board/host recovers. No server and no internet needed.
  - Rejected: B) separate devices via a realtime service. It needs a backend and venue Wi-Fi.
- **Bracket:** 4 named teams. Match 1: T1 vs T2. Match 2: T3 vs T4. Final: the two winners.
- **Questions:** the 6-question bank, 2 per match in order (match 1 → Q1, Q2; match 2 → Q3, Q4; final → Q5, Q6). If a match is tied after 2 questions, play a tiebreaker question (reuses a bank question not played in that match).
- **Round flow (classic, host-driven):** the host reveals answers (points add to the round bank) and adds strikes (big X on the board), then awards the bank to a team with one click. That covers both "play" and "steal". After it's awarded, the host can reveal the rest without changing scores.
- **Board:** classic blue/gold look: 6 numbered answer tiles that flip on reveal, the round bank, both team scores, strike X overlay with buzzer sound, ding on reveal. Between matches it shows the bracket; at the end it shows a champion screen with confetti. It needs one click to enable sound (browser rule).
- **Host:** the current matchup and question, all answers with points (reveal buttons + keys 1–6), Strike (X), award buttons, a "show question on board" toggle, next question/match, undo, reset. It shows the bracket and a button to open the board window.

**Builder's calls:** two typo fixes in the bank ("Lomg Jump" → "Long Jump", "magic Carpet" → "Magic Carpet"); colors and sounds; game logic in a pure reducer (`src/app/ff/game.ts`) unit-tested with `node --test`.
