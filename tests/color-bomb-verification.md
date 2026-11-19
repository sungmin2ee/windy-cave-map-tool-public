# Color bomb neutrality — 2026-11-19, client 2.7.61

Color-effect pieces retain their serialized block ID for storage/artwork but do not have a normal match color. This applies to the built-in rainbow, DDUNG type 5, and configured color effects. A standalone activation selects a present playable color using the deterministic effects RNG; exchanging with another piece selects the partner color. Hidden colors no longer contribute to block-color objective progress or automatic map goal counts.

Possible-swap checks move special metadata together with blocks and recognize special combinations. A color bomb with an eligible adjacent partner prevents an unnecessary shuffle. A board without any action still shuffles.

`node --test tests/live-game.test.mjs`: 48 passed. Added coverage for both normal and DDUNG color bombs, initial editor data, no spontaneous match, color objective counts, partner-color exchange, standalone activation, and dead-board shuffling.

Browser verification used `play.html?map=tests/fixtures/color-bomb-neutral.json&level=1`. The top row remained red / color bomb / red without automatically matching or spending a move. Selected the green below the bomb, then clicked the bomb: moves 25→24; the bomb and green cells entered removal; the red objective remained 0 at the initial impact. Subsequent refill cascades proceeded normally. Browser warning/error log empty. Interactions used visible page controls, without mutating game state through evaluation.

Screenshots outside the repository: `../analysis-tools/color-bomb-neutral-before.jpg` and `../analysis-tools/color-bomb-neutral-after.jpg`. The latter is after refill cascades, so its red goal progress reflects those later matches. No GitHub push performed in this task.
