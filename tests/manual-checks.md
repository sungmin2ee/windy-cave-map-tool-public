# Live board verification — 2026-11-19

Verified in the local browser against the working tree, using actual clicks and mouse drags. These checks do not establish timing equivalence with an Android Royal Match runtime.

## Difficulty-driven automatic objective quantities, client 2.7.71 — 2026-11-20

Supersedes the prior generated auto-map quantity policy. Fixed-object goals in auto-map mode now share an estimated workload based on requested difficulty, usable area, move budget and object durability/footprint. Explicit manual targets reserve space first and retain their entered quantities. Rebuilding clears previous automatic target placements; preserving placement keeps existing objects as a minimum. Regenerated Jelly records that it uses authored cells rather than stale original group coordinates. The selected count stays auto-map and is resolved from the resulting board in JSON and gameplay. Color-block auto-map goals continue to count the generated color distribution.

Browser: added a Jelly goal in auto-map mode to an otherwise blank 10×12 board. With zero optional objects, target difficulty 10 generated candidate counts 23/19/19; target difficulty 90 generated 88/77/73. Applied the first hard candidate: the editor showed 88 and the real player popup showed 0/88. Regenerated at difficulty 10 from the applied 88-Jelly map: counts dropped to 22/21/19. Undid the three setup/application edits and confirmed the blank board and no goals; browser error log empty. Screenshot: `../analysis-tools/automatic-goal-difficulty.jpg`.

New tests cover increasing difficulty/area, move budget, durability, manual-count invariance, reducing previous auto placements, preserving existing placement, manual-first capacity reservation and imported Jelly round trips with runtime target agreement. Combined suite: 68/68 passed; JS syntax and whitespace checks passed.

## Required goal quantities and event icons, client 2.7.70

Created a Jelly terrain goal with explicit quantity 20 on the ordinary blank level. Enabled mouse/spider events and generated automatic difficulty candidates with zero optional terrain/gimmick kinds selected. All three candidate DOM grids contained exactly 20 Jelly tiles and zero mouse/spider placements; each card displayed a 20-unit goal plus two event icons outside the grid. Applied the first candidate: editor board contained 20 Jelly tiles, the goal input remained 20, and both board-side event badges remained visible. Opened the actual player popup: goal was 0/20. Undid all seven temporary changes and confirmed the blank board, no goals and events off. Repeated candidate generation to save a readable screenshot and undid the six setup edits again. No browser errors. Screenshot: `../analysis-tools/difficulty-jelly-20-events.jpg`.

The generator now removes legacy event placements even when copying the original board, populates fixed-object goals before optional decoration, retains original quantities for auto-map goals, and rejects candidates below the required count. Required placements can use other active cells when the decoration pattern has too few slots. Insufficient space reports the requested quantity rather than shrinking the goal. Extra authored Jelly cells count alongside original grouped Jelly data. New helper tests cover manual Jelly 20, automatic counts, multiple terrain/item/gimmick goals, capacity failure, legacy-event cleanup and grouped Jelly compatibility. Combined suite: 63/63 passed; syntax and whitespace checks passed.

## Event-only mouse/spider authoring, client 2.7.69

Supersedes the prior authoring classification: the user clarified that mouse and spider should be configured as in-game events, not placed into new boards. Their legacy panel definitions and imported placements remain readable for compatibility. Removed both IDs from the object palette, original-gimmick picker and automatic difficulty generation pools; the paint path also rejects new placements. Added per-level mouse/spider event checkboxes. Explicit `turnEvents` settings override original flags in the common engine and are retained by project JSON; original-format exports update mouse/spider flags as well.

Browser: confirmed both entries absent from the object picker/palette and difficulty list. Enabled both checkboxes and observed the event descriptions. On a filled ordinary map with zero placed gimmick images, ran one automatic game in the preview popup with a 999999-point goal and 6 moves; its representative replay finished at 0 moves. Undid all six editor test edits, restoring the blank board, mission mode, 20 moves and both events off. Browser error log empty. Screenshot: `../analysis-tools/level-turn-events.jpg`.

New engine tests confirm ordinary maps invoke the spider at move 2 and mouse at move 4 without placed actors, explicit event flags override imported values, and settings survive JSON round trips. Combined suite: 57/57 passed; syntax and whitespace checks passed.

## Swap opacity, manual reset, and original panel identity, client 2.7.68

On `royal-flow.json`, attempted an invalid normal exchange through actual page controls. During the outbound animation, observed two swap actors at opacity 1, two delayed return actors at opacity 0, and both covered base blocks at opacity 0/visibility hidden. After rollback, zero swap actors/covered cells remained, the rollback message appeared, and moves remained 25. This also prevents explicitly visible special-sheet descendants from escaping their hidden parent's visibility through the added parent opacity. Screenshot: `../analysis-tools/invalid-swap-opacity.jpg`.

In Editor Playtest, ran 2 automatic games, observed the representative game win in 1 move, then pressed Restart. The board reset to 20 moves/0 used moves, 120 manual board buttons, no automatic summary, and no replay pause control. Undid both map edits. Screenshot: `../analysis-tools/reset-manual-playtest.jpg`.

Compared original Unity source: `LevelManager.cs` places H in `objectList` as type 15 and % as type 33 and counts these board objects; `MousePanel.cs` and `SpiderCavePanel.cs` implement their board behavior. In contrast, `GameManager.cs` checks `isMouseEnabled()`/`isSpiderEnabled()` before invoking the resetLine/Spider turn-event coroutines. The placed mouse panel and spider cave are therefore distinct from non-placeable turn actors. Retained original placement and renamed catalog entries to explicitly say placement type; selected-object help explains the distinction. Verified both hints in the browser, then undid the two catalog test additions. No browser errors. Earlier core and batch run passed 55/55; subsequent name/help changes passed syntax and whitespace checks. Screenshot: `../analysis-tools/placed-gimmick-explanation.jpg`.

## Automatic tests inside the player preview, client 2.7.67

Opened Play Preview and entered 7 runs directly inside its player iframe. The summary showed 7/7 wins and 100%; the first game's replay completed with 800 points against a 500-point goal. Restarted that representative replay, paused it, and observed the resume label. Direct Play reset to 20 moves and hid the summary. Started 1000 runs, observed 6/1000 progress, then canceled and confirmed the start button was enabled. Changed the editor goal to 999999 with 2 moves and ran 3 games in the popup: 0/3 wins and 0%, with the representative replay ending at 0 moves and the move-exhaustion message. Quit returned to the editor; undid all four temporary editor changes and confirmed a blank board, mission mode and 20 moves. Browser error log was empty. Screenshots: `../analysis-tools/preview-auto-batch.jpg` and `../analysis-tools/preview-auto-batch-failure.jpg`.

Both editor and popup use the shared batch runner and game engine. The popup replays the same first-run seed using the shared animation function with clear bonuses disabled, matching the calculation. The controls appear only for a validated local editor preview; normal published player sessions retain their ordinary UI. Tests remained 55/55 passing; syntax and whitespace checks passed.

## In-page player preview, client 2.7.66

Clicked Play Preview on a filled ordinary level with a 500-point goal. The editor stayed on its original URL and opened a modal containing the actual player iframe, with matching level name, 20 moves, and 0/500 points. Used the player's hint and clicked its suggested pair; observed 19 moves and 300/500 points. The modal's Restart restored 20 moves. The player's Quit closed the modal, and reopening followed by the modal's Close returned to the editor. Both close paths removed the iframe. Undid both temporary map edits and confirmed the blank original board and mission mode were restored. Browser error log empty; existing 55 tests passed. Screenshots: `../analysis-tools/preview-popup.jpg` and `../analysis-tools/preview-popup-playing.jpg`.

Preview passes the current single-level JSON and theme through a same-origin Blob URL. Host messages require matching origin, iframe source, protocol version, and run ID. Closing removes the iframe, listener and timeout and revokes the Blob URL; reopening or restarting creates a fresh session.

## Repeated automatic Playtest, client 2.7.65

In the editor's Verification Tools → Editor Playtest, entered 7 runs on an ordinary filled board with a 500-point goal. The batch showed 7/7 wins and 100%; the first game's animated replay finished with 1700 points and 1 used move, matching the successful batch result. Changed the goal to 999999 with 2 moves and ran 3 games: 0/3 wins and 0%, with the representative replay ending in move exhaustion after 2 moves. Batch statistics remained visible during and after replay. Screenshots: `../analysis-tools/auto-play-batch-success.jpg` and `../analysis-tools/auto-play-batch-failure.jpg`.

Restarted the representative game and paused it; the button changed to resume. Started 1000 games, observed 10/1000 progress, canceled, and confirmed editable run count, enabled start button and restored manual board. Zero runs failed native input validation without starting a batch; a subsequent 2-run batch completed correctly. Browser error log was empty. Undid all four editor test changes, restoring the blank ordinary Cave 0001, mission mode, 20 moves and no goals.

The batch uses fresh derived seeds, restarts each game from the editor board, keeps the first result regardless of success, and yields between games. Cancellation discards partial statistics. Unlimited-move replay uses the same 100-turn test cap as the calculation. Core and batch tests passed 55/55; syntax and whitespace checks passed. Probability keeps one decimal place so 1 success in 1000 games displays as 0.1%.

## Collection gimmicks, client 2.7.64

Compared the Unity source `TreasurePiece.cs` and `WinningConditions.collectTreasure`: hats and bags are non-matching falling pieces collected at exit coordinates. This was a source comparison, not a new Unity playthrough.

The browser now lists both under Gimmick and neither under Item. Placed both into an ordinary blank level: both original images decoded. Added the bag as a goal using the selected-object button; the goal displayed category Gimmick, exit collection, and automatic quantity 1. Undid all three test edits and confirmed zero placed images and no goals remained. Screenshots: `../analysis-tools/collection-gimmick-palette.jpg` and `../analysis-tools/collection-gimmick-goal.jpg`.

Legacy item slots and collection objectives remain compatible with existing JSON. Play state converts these slots into falling pieces on ordinary maps too. Theme packs migrate their collection artwork into the Gimmick category while retaining legacy object-image definitions. The core suite passed 51/51, including exit collection, normal-match/explosion exclusion, automatic target counting, and JSON round trips. JS syntax and whitespace checks passed.

## Artwork on ordinary levels, client 2.7.63

Built-in block, special-piece and mapped gimmick artwork is available independently of a level's external-source metadata. Object-image overrides and applied theme artwork retain priority.

In the browser, duplicated a blank ordinary Cave 0001 without DDUNG source metadata and placed red/red/blue pieces. Set the middle piece to bee through the cell inspector. The palette's six default color images and all three placed images decoded successfully; the bee used `special-pieces.webp`. Uploaded the existing blue image into the Red theme slot, applied the theme, and duplicated the test level again: the red cell retained the custom data image, while the bee and blue cell retained their built-in images. Screenshots outside the repository: `../analysis-tools/new-level-default-images.jpg` and `../analysis-tools/new-level-themed-images.jpg`.

The in-app browser does not support the New Level button's native `prompt()`, so this browser check used ordinary blank-level duplication rather than that dialog. The shared artwork resolver is used by both creation paths. Native confirmation dialogs also required user assistance during test cleanup. JS syntax, whitespace checks, and existence of the 12 relevant default artwork files passed.

## Level list navigation, client 2.7.62

With the guide closed, selected Cave 0001 from the level list: Board Edit became the selected tab, the matching level title and board became visible, and the board editor scrolled to 52px below the top of the viewport. Repeated using the level-number jump with the same result. With the guide open on step 1, selecting the level retained the Level List tab and step 1 until Next. Closed the guide and selected the level again to confirm normal navigation resumed. Browser warning/error log empty; JS syntax and whitespace checks passed. Screenshot: `../analysis-tools/level-list-board-navigation.jpg`.

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

## Empty destination input, client 2.7.58

Input/match occupancy now excludes a motion's distant final target. Fall planning retains that reservation, while the moving piece's departure and immediate arrival cells remain protected. This supersedes the earlier blanket final-target input lock.

In `empty-swap.json`, activated the corner bomb, selected cell 31, and pressed Enter on cell 32 during another piece's 20 → 26 motion targeting 32. DOM observation: 20 and 26 disabled, empty cell 32 enabled. The valid match spent the second move immediately (25 → 24 → 23), while other motions continued, then returned to an interactive settled board with 0 movement actors. Repeated with cell 33 → 32 to produce an invalid swap: 24 moves remained, rollback message displayed while two fall actors were still moving, and the board later settled. Inputs used real page controls, without mutating game state through browser evaluation. Browser error log empty. Core regression tests: 36/36 passed, including valid/invalid swaps into a distant fall target and incoming-cell protection. Screenshot: `../analysis-tools/empty-swap-fix.jpg` relative to repository root.

## Clear bonus, client 2.7.59

Opened `clear-bonus.json` (DDUNG 7 board, 6 moves, target 100 points), clicked the vertical special. During conversion: remaining MOVE 4 after the first of 5 generated pieces, bonus generation label, 0 enabled board cells, clear dialog closed. After automatic bonus attacks and cascades: MOVE display 0, movement/bee actors 0, clear dialog open, three stars. The first implementation waited for every individual surviving special to settle; changed bonus activation to a batch to avoid the extended pause observed on this bee-heavy board. Repeated with `clear-bonus-sequential.json`, which explicitly disables concurrent input: same countdown and three-star popup after the bonus. Both browser error logs were empty. Screenshot: `../analysis-tools/clear-bonus-generation.jpg` relative to repository root.

Core tests also verify exactly one generated piece per remaining move, multiple batches for 60 leftover moves, preserved player move statistics, no conversion for unlimited/zero leftover moves, sequential mode, automatic simulation exclusion, and no turn-end hazard loss after meeting the clear goal.

## Level 78 dust and bee-impact presentation, client 2.7.60

Loaded `ddung-level-78.json`. All six dust block images used the existing original `goal-dust.webp` asset and were decoded with ready styling; screenshot inspection confirmed the purple fallback tiles were replaced. The dust target icon had already used this art; the board block mapping was missing. No new source artwork was copied.

In `bee-impact.json`, clicked the bee at cell 0. Observed a flight actor with DOM destination 29 while destination ice HP remained 2 and the stone immediately below the launch site (cell 6) remained 3. After the flight disappeared, destination HP became 1 and the stone remained 3. Remaining moves were 24; browser error log empty. The live rule state still commits immediately to close input safely; obstacle HP and artwork now use a separate pending-impact presentation until the corresponding flight impact frame. Tests cover both a durability decrement and an obstacle destroyed logically before its flight arrives. Core suite: 43 tests passed. Screenshots: `../analysis-tools/level78-dust-fix.jpg` and `../analysis-tools/bee-impact-fix.jpg`, relative to repository root.
