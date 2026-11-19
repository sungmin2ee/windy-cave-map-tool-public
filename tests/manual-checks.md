# Live board verification — 2026-11-19

Verified in the local browser against the working tree, using actual clicks and mouse drags. These checks do not establish timing equivalence with an Android Royal Match runtime.

| Case | Observed result |
|---|---|
| Player, `live-board.json`: tap corner bomb, then bottom row special during removal | Remaining moves changed 25 → 24 → 23. Burst actors were still present, and no falling actors had started when the second special committed. |
| Player: corner bomb, then normal swap at column 4/5, row 5 | The second move committed while removal effects were present; remaining moves became 23. |
| Player: falling column after that normal swap | Falling cells were disabled for ordinary exchange; 30 other steady/empty eligible cells remained enabled in the observed frame. |
| Editor Playtest, same imported fixture, 0.5× speed | An actual mouse drag from column 4 to column 5 in row 5 during the corner-bomb burst committed move 2. Seven burst sprites were still present. |
| Editor: switch live session to automatic play and back | Used moves advanced from 2 to 20; manual mode could be restored; no browser errors were captured. |
| Editor: turn `swapDuringEffects` off and reopen Playtest | After tapping a special, the board had no enabled input cells during the sequential animation. No live movement actors were created. |
| DDUNG level 7 fixture: drag the two adjacent line specials together | One move was spent (30 → 29). Bee/line effects and cascades completed, the board refilled, the two treasure pieces were present, and the board became interactive again. No browser errors were captured. |
| Bee-overlay regression, client 2.7.52: repeat level 7's line-special drag | Observed 11 flight actors during the attack. After the board settled, flight actors and all temporary turn/burst/swap/movement actors were 0. Screenshot inspection confirmed that bees no longer remained over ordinary blocks. The earlier check above verified logical settling but missed these retained flight overlays. |
| Last-goal input regression, client 2.7.53, `bee-last-goal.json` | With one terrain goal remaining, tapped the bee. During the observed flight: 1 flight actor, 0 enabled board cells, 24 remaining moves, no clear dialog, and the completion message. After the flight and resolution: 0 flight actors, the clear dialog was open, and remaining moves were still 24. |
| `live-score.json`: one remaining move, target 500, 100 points/block; tap bottom row special | Score reached 600 and remaining moves became 0 while bursts were still active and the clear dialog was closed. After resolution, the clear dialog appeared with the 500-point success message and one star. |

## Royal-style flow, client 2.7.54

| Case | Observed result |
|---|---|
| `royal-flow.json`: click bottom horizontal special | Moves 25 → 24. Observed cross motions 13 → 20 and 16 → 21 beneath the two central walls. After resolution, 34 non-wall cells were filled and no movement actors remained. |
| Same board: drag the next legal pair | A real mouse drag committed the next move, 24 → 23, and returned to idle. Browser error log was empty. |
| Original DDUNG level 7: drag adjacent line specials | Moves 30 → 29. Resolution returned to idle with 0 movement actors and 0 bee flights. Browser error log was empty. |

Core regression suite: `node --test tests/live-game.test.mjs` — 34 tests passed. Includes genuine empty-cell matching, moving special taps, duplicate ID prevention, invalid move rollback, all four gravity directions, remote reservations with diagonal flow, move exhaustion, cancellation, scoring, combinations, last-goal input closure and synchronous simulation compatibility. The control case verifies that bee flights still allow concurrent input when another goal remains. Royal flow cases cover straight-supply priority, upper candidate selection, normal/special side priority, frozen donors and paths, shared target reservations, source-only refill, portals, local gravity, disabled diagonal flow, donor uniqueness and synchronous wall-pocket filling.

Editor tests used a separate `localhost` origin; the existing editor's `127.0.0.1` project was not replaced with a test fixture.

## Falling image readiness, client 2.7.55

Live cell reconciliation now compares the requested markup saved at render time instead of live `innerHTML`, which image load handlers mutate. Unchanged cells retain their image nodes; cached ordinary and special-sheet sprites receive their ready styling synchronously when already decoded. In the browser, tapped the horizontal special in `royal-flow.json`: observed 24 movement actors with 0 decoded images missing their ready styling, then an interactive settled board. Repeated the action after restarting; browser error log was empty. Core suite remained 34/34 passing. Screenshot: `../analysis-tools/fall-image-fix.jpg` relative to repository root.

## Invalid swap rendering, client 2.7.56

Dragged the first row's yellow/blue pair in `royal-flow.json` to make an invalid swap. Outbound: only two swap actors visible, both underlying cell blocks hidden, delayed return actors hidden. Return: two visible actors, both underlying cell blocks hidden. After completion: zero swap actors, zero covered cells, original yellow/blue restored, remaining moves still 25, and the rollback message displayed. Browser error log empty; core tests 34/34 passed. Screenshot: `../analysis-tools/invalid-swap-fix.jpg` relative to repository root.
