# Skit Spinner — design (short)

**Why:** A crowd game shown on a projector. Each team gets a random *Style × Bible story* pairing to act out.

**What**
- Hidden page at `/spinner`: not linked from anywhere, `noindex`, no site nav.
- Two wheels: Styles (8) and Bible stories (9). One SPIN button starts both at once; the result is always the combination.
- Wheels stop at different times (Styles ≈4s, Stories ≈6.5s) for suspense, with a small pop when the first lands.
- When both land: confetti, screen shake, giant result zoom, flying emoji/meme text, synthesized sounds (mute toggle).
- No repeats: the picked style AND picked story are removed from their wheels after each spin. Max 8 teams.
- Taken pairings are listed on screen and persisted in localStorage; Reset clears them.

**Approaches considered**
1. *Chosen:* one client-side page inside the existing Next.js static export, SVG wheels + hand-rolled canvas confetti + Web Audio. No new deps.
2. Wheel/confetti npm libraries — extra deps for a small feature.
3. Standalone HTML in `public/` — outside the site's stack/tooling.

**Builder's calls:** colors, meme copy, exact easing, sounds.

**Follow-up polish (after review)**
- Wheel labels flip so they always read upright at rest; long labels shortened on the wheel only ("Ye Olde English").
- 300ms pause after the 2nd wheel stops before the celebration covers it.
- Layout fits 1280×720 projectors: team list moved to a side column on wide screens.
- "Saved game" banner on load with Start fresh / Keep going.
- A wheel with one option left doesn't spin; it shows "LAST ONE LEFT".
- Audio unlocks on first click/key; unmuting plays a test ding.
- Honors prefers-reduced-motion (no shake/emoji rain, fewer particles, fades instead of spins).
- End screen: after the last team, wheels + title are replaced by a full-screen 4×2 "lineup" of all teams sized to fit the viewport.
- ⚡ Instant button: confirms, then randomly pairs all remaining styles/stories (keeping already-spun teams) and jumps to the lineup.
