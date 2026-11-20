import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameEngine } from '../game-engine.js';
import { createLiveGame } from '../live-game.js';

function fixture(overrides = {}) {
  const colors = ['red', 'yellow', 'blue', 'green', 'orange', 'purple'];
  const cave = {
    id: 'live-test', number: 1, name: '동시 입력 검증', width: 6, height: 6,
    gravity: 'down', flowRule: 'royal', randomSeed: 'live-regression',
    usableBlocks: colors, blockWeights: {}, specialMatches: false,
    layers: { terrain: Array(36).fill('floor'), block: Array.from({length: 36}, (_, i) => colors[(i % 6 + 2 * Math.floor(i / 6)) % 6]),
      gimmick: Array(36).fill(null), item: Array(36).fill(null) },
    initialPieceTypes: { 0: 'bomb', 35: 'horizontal' }, initialPieceDefinitions: [],
    terrainRules: { floor: { reaction: 'none', durability: 1, blocksFlow: false } },
    gimmickRules: {}, objectives: [{ layer: 'block', targetId: 'red', countMode: 'manual', count: 1000 }],
    moveLimit: 25, moveLimitEnabled: true, scoreTarget: null, pointsPerBlock: 100,
    ...overrides,
  };
  const project = { caves: [cave], specialPieceRules: { combos: [] } };
  const engine = createGameEngine(() => project);
  const state = engine.createPlayState(cave, 'test', true);
  const frames = [];
  const live = createLiveGame(state, engine, { effects: (batch) => frames.push(...batch) });
  return { engine, state, live, frames, cave };
}

function settle(live, limit = 5000) {
  let ticks = 0;
  while (live.active && ticks++ < limit) live.tick(1 / 60);
  assert.ok(ticks < limit, 'live board settles without an endless clock');
}

function colorBombBoard(type = 'rainbow', extra = {}) {
  const { cave: base } = fixture();
  return fixture({ width: 3, height: 3, initialPieceTypes: { 1: type },
    layers: { terrain: Array(9).fill('floor'),
      block: ['red', 'red', 'red', 'blue', 'green', 'yellow', 'yellow', 'blue', 'green'],
      gimmick: Array(9).fill(null), item: Array(9).fill(null) },
    objectives: base.objectives, ...extra });
}

function collectionGimmickBoard({ exit = 32, countMode = 'manual', special = 0 } = {}) {
  const { cave: base } = fixture();
  const layers = structuredClone(base.layers);
  layers.item[14] = 'ddung-treasure-1';
  layers.gimmick[exit] = 'exit';
  return fixture({ layers, initialPieceTypes: { [special]: 'bomb' },
    objectives: [{ layer: 'item', targetId: 'ddung-treasure-1', countMode, count: 1 }] });
}

test('level turn-event settings override imported flags and survive JSON round trips', () => {
  const externalSource = { format: 'DDUNG MapInfo v68', rawMap: { mouse: 'True', spider: false } };
  const { engine, cave } = fixture({ externalSource });
  assert.deepEqual(engine.ddungTurnEvents(cave), { mouse: true, spider: false });
  cave.turnEvents = { mouse: false, spider: true };
  assert.deepEqual(engine.ddungTurnEvents(JSON.parse(JSON.stringify(cave))), { mouse: false, spider: true });
  const state = engine.createPlayState(cave, 'events');
  assert.deepEqual(state.ddungEvents, { mouse: false, spider: true });
  assert.equal(engine.isEventOnlyGimmick('ddung-mouse-panel'), true);
  assert.equal(engine.isEventOnlyGimmick('ddung-spider-cave'), true);
  assert.equal(engine.isEventOnlyGimmick('ddung-box'), false);
  assert.equal(engine.isEventOnlyGimmick(null), false);
});

test('ordinary authored levels run enabled mouse and spider events without placed actors', () => {
  const { engine, cave } = fixture({ turnEvents: { mouse: true, spider: true } });
  assert.equal(cave.layers.gimmick.some(engine.isEventOnlyGimmick), false);
  const state = engine.createPlayState(cave, 'events');
  const labels = [];
  for (let turn = 0; turn < 4; turn++) {
    assert.equal(state.status, 'playing');
    engine.playSimulationTurn(state, engine.chooseAutoAction(state), (label) => labels.push(label));
  }
  assert.ok(labels.includes('거미 등장 · 블록을 가져갑니다'));
  assert.ok(labels.includes('쥐 등장 · 한 행의 블록 교환'));
  assert.equal(state.cave.layers.gimmick.some(engine.isEventOnlyGimmick), false);
});

test('ordinary maps use falling collection pieces and collect them only at the exit', () => {
  const { engine, state, live } = collectionGimmickBoard({ exit: 20 });
  state.clearBonusEnabled = false;
  assert.equal(state.cave.layers.item[14], null);
  assert.equal(state.cave.layers.block[14], 'ddung-treasure-1');
  assert.equal(engine.collectDdungTreasure(state), 0);
  state.cave.layers.block[20] = null;
  state.cave.livePieceIds[20] = null;
  assert.equal(live.submit({ first: 0 }), true);
  settle(live);
  assert.equal(state.objectiveProgress[0].current, 1);
  assert.equal(state.status, 'won');
  assert.equal(state.cave.layers.block.includes('ddung-treasure-1'), false);
});

test('collection gimmicks are not normal matches or destructible bomb targets', () => {
  const { engine, state, live } = collectionGimmickBoard({ special: 13 });
  assert.equal(engine.findMatches(state.cave).has(14), false);
  assert.equal(live.submit({ first: 13 }), true);
  assert.equal(state.cave.layers.block[14], 'ddung-treasure-1', 'nearby explosion keeps the collection piece');
  assert.equal(state.objectiveProgress[0].current, 0);
});

test('collection goal counts survive item-to-falling-piece conversion and JSON round trips', () => {
  const { engine, cave, state } = collectionGimmickBoard({ countMode: 'auto-map' });
  assert.equal(engine.countObjectiveAssets(cave, cave.objectives[0]), 1);
  assert.equal(engine.countObjectiveAssets(state.cave, state.cave.objectives[0]), 1);
  assert.equal(state.objectiveProgress[0].target, 1);
  const reloaded = engine.createPlayState(JSON.parse(JSON.stringify(cave)), 'reload', true);
  assert.equal(reloaded.objectiveProgress[0].target, 1);
  assert.equal(reloaded.cave.layers.block[14], 'ddung-treasure-1');
});

test('color bombs never join a normal match using their serialized color', () => {
  for (const [type, extra] of [['rainbow', {}], [5, { externalSource: { format: 'DDUNG MapInfo v68' } }]]) {
    const { engine, state, cave } = colorBombBoard(type, extra);
    assert.equal(engine.findMatches(state.cave).size, 0);
    assert.equal(engine.findMatches(cave).size, 0, 'editor board also excludes initial color bombs');
    engine.resolveMatches(state);
    assert.equal(engine.specialEffect(state.cave, state.cave.playtestPieces[1]), 'color');
    assert.equal(state.blocksRemoved, 0, 'settling does not spontaneously trigger the color bomb');
  }
});

test('a color bomb exchange is playable without a normal match and prevents an unnecessary shuffle', () => {
  const { engine, state, live } = colorBombBoard();
  const before = structuredClone(state.cave.layers.block);
  assert.equal(engine.hasPossibleSwap(state.cave), true);
  assert.deepEqual(state.cave.layers.block, before);
  assert.equal(state.cave.playtestPieces[1].type, 'rainbow');
  engine.finishLiveState(state);
  assert.equal(state.shuffleCount, 0);
  assert.equal(live.submit({ first: 1, second: 4 }), true);
  assert.equal(state.movesUsed, 1);
  assert.equal(state.cave.layers.block.includes('green'), false, 'partner green is selected, not hidden red');
  assert.equal(state.cave.layers.block[0], 'red');
  assert.equal(state.objectiveProgress[0].current, 0, 'color bomb does not count as its hidden red color');
});

test('automatic color-goal counts exclude color bombs in editor data and runtime data', () => {
  const { engine, cave, state } = colorBombBoard('rainbow', {
    objectives: [{ layer: 'block', targetId: 'red', countMode: 'auto-map', count: 0 }],
  });
  assert.equal(engine.countObjectiveAssets(cave, cave.objectives[0]), 2);
  assert.equal(state.objectiveProgress[0].target, 2);
});

test('standalone color bombs select a color instead of using their hidden layer color', () => {
  const { state, live } = colorBombBoard();
  state.beeRandom = () => .4;
  assert.equal(live.submit({ first: 1 }), true);
  // usable order: red, yellow, blue, green -> .4 selects yellow.
  assert.equal(state.cave.layers.block[5], null);
  assert.equal(state.cave.layers.block[6], null);
  assert.equal(state.cave.layers.block[0], 'red');
  assert.equal(state.cave.layers.block[2], 'red');
});

test('a board with no normal matches or special actions still shuffles', () => {
  const { engine, state } = colorBombBoard(null);
  state.cave.layers.block = ['red', 'yellow', 'green', 'yellow', 'green', 'red', 'green', 'red', 'yellow'];
  assert.equal(engine.findMatches(state.cave).size, 0);
  assert.equal(engine.hasPossibleSwap(state.cave), false);
  const before = state.shuffleCount;
  engine.finishLiveState(state);
  assert.equal(state.shuffleCount, before + 1);
  assert.equal(engine.findMatches(state.cave).size, 0);
  assert.ok(engine.findPlayableAction(state));
});

test('special taps commit immediately during another explosion, before any refill', () => {
  const { live, state } = fixture();
  assert.equal(live.submit({ first: 0 }), true);
  assert.equal(state.movesUsed, 1);
  const holes = state.cave.layers.block.filter(x => !x).length;
  assert.ok(holes > 0);
  assert.equal(live.canTap(35), true);
  assert.equal(live.submit({ first: 35 }), true);
  assert.equal(state.movesUsed, 2);
  assert.equal(state.cave.layers.block[35], null);
  assert.ok(state.cave.layers.block.filter(x => !x).length > holes);
  assert.equal(live.motions.size, 0);
  settle(live);
});

test('a stable normal swap starts immediately while another area clears', () => {
  const { live, state } = fixture();
  // Bottom rows: swap yellow with blue to form a new blue vertical match.
  state.cave.layers.block[21] = 'blue';
  state.cave.layers.block[27] = 'yellow';
  state.cave.layers.block[28] = 'blue';
  state.cave.layers.block[33] = 'blue';
  live.submit({ first: 0 });
  assert.equal(live.canSwap(27), true);
  assert.equal(live.submit({ first: 27, second: 28 }), true);
  assert.equal(state.movesUsed, 2);
  assert.equal(state.cave.layers.block[27], null);
  assert.equal(live.active, true);
  settle(live);
});

test('falling pieces and their incoming cells are unavailable to normal swaps', () => {
  const { live, state } = fixture();
  live.submit({ first: 35 });
  for (let i = 0; !live.motions.size && i < 100; i++) live.tick(1 / 60);
  assert.ok(live.motions.size > 0);
  const move = [...live.motions.values()].find(x => !x.spawned);
  assert.ok(move);
  assert.equal(live.canSwap(move.to), false);
  assert.equal(live.canSwap(move.from, true), false);
  const used = state.movesUsed;
  assert.equal(live.submit({ first: move.to, second: move.to - 1 }), false);
  assert.equal(state.movesUsed, used);
  settle(live);
});

test('genuine empty destination can make a match; invalid empty swaps do not spend a move', () => {
  const { live, state } = fixture();
  state.cave.layers.block[20] = null;
  state.cave.livePieceIds[20] = null;
  state.cave.layers.block[19] = 'red';
  state.cave.layers.block[14] = 'red';
  state.cave.layers.block[26] = 'red';
  assert.equal(live.canSwap(20, true), true);
  live.submit({ first: 19, second: 20 });
  assert.equal(state.movesUsed, 1);
  assert.equal(state.cave.layers.block[20], null);
  settle(live);
  const invalid = fixture();
  invalid.state.cave.layers.block[1] = null;
  invalid.state.cave.livePieceIds[1] = null;
  invalid.live.submit({ first: 2, second: 1 });
  assert.equal(invalid.state.movesUsed, 0);
});

test('move exhaustion and scoring wait for active effects and cascades', () => {
  const { live, state } = fixture({ moveLimit: 1, scoreTarget: 100, pointsPerBlock: 100 });
  live.submit({ first: 0 });
  assert.equal(state.movesLeft, 0);
  assert.equal(state.status, 'playing');
  assert.equal(live.submit({ first: 35 }), false);
  settle(live);
  assert.equal(state.status, 'won');
  assert.equal(state.movesUsed, 1);
});

test('IDs stay unique through refill and the board remains immutable while idle', () => {
  const { live, state } = fixture();
  live.submit({ first: 0 });
  settle(live);
  const ids = state.cave.livePieceIds.filter(Boolean);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, state.cave.layers.block.filter(Boolean).length);
  const saved = JSON.stringify(state.cave.layers);
  for (let i = 0; i < 60; i++) live.tick(1 / 60);
  assert.equal(JSON.stringify(state.cave.layers), saved);
});

for (const gravity of ['up', 'left', 'right']) {
  test(`${gravity} gravity settles using shared spatial rules`, () => {
    const { live, state } = fixture({ gravity });
    live.submit({ first: 0 });
    settle(live);
    assert.equal(state.cave.layers.block.filter(Boolean).length, 36);
    assert.equal(live.motions.size, 0);
  });
}

test('synchronous simulation still resolves a complete turn with the same goals', () => {
  const { engine, cave } = fixture();
  const state = engine.createPlayState(cave, 'sync', true);
  engine.playSimulationTurn(state, { first: 0 });
  assert.equal(state.movesUsed, 1);
  assert.ok(state.blocksRemoved > 0);
  assert.equal(state.cave.layers.block.filter(Boolean).length, 36);
  assert.equal(state.liveMode, undefined);
});

test('stop cancels simulation work without advancing the board', () => {
  const { live, state } = fixture();
  live.submit({ first: 0 });
  live.stop();
  const saved = JSON.stringify(state.cave.layers);
  live.tick(1);
  assert.equal(live.submit({ first: 35 }), false);
  assert.equal(JSON.stringify(state.cave.layers), saved);
});

test('special combinations spend one move and do not discard an active explosion', () => {
  const { live, state } = fixture({ initialPieceTypes: { 0: 'bomb', 28: 'horizontal', 29: 'vertical' } });
  live.submit({ first: 0 });
  const removed = state.blocksRemoved;
  assert.equal(live.submit({ first: 28, second: 29 }), true);
  assert.equal(state.movesUsed, 2);
  assert.ok(state.blocksRemoved > removed);
  settle(live);
  assert.equal(state.cave.layers.block.filter(Boolean).length, 36);
});

test('a falling special can be tapped while normal swapping of that piece remains blocked', () => {
  const { live, state } = fixture({ initialPieceTypes: { 21: 'bomb', 35: 'horizontal' } });
  live.submit({ first: 35 });
  let moving;
  for (let i = 0; i < 100 && !moving; i++) {
    live.tick(1 / 120);
    moving = [...live.motions.values()].find(move => move.piece?.type === 'bomb');
  }
  assert.ok(moving);
  assert.equal(live.canSwap(moving.to), false);
  assert.equal(live.canTap(moving.to), true);
  assert.equal(live.submit({ first: moving.to }), true);
  assert.equal(state.movesUsed, 2);
  assert.equal(live.motions.has(moving.id), false);
  settle(live);
});

test('an unsuccessful final move reports loss only after effects stop', () => {
  const { live, state } = fixture({ moveLimit: 1, scoreTarget: 1000000 });
  live.submit({ first: 0 });
  assert.equal(state.status, 'playing');
  settle(live);
  assert.equal(state.status, 'lost');
  assert.equal(state.movesLeft, 0);
  assert.equal(state.animating, false);
});

test('invalid swapping restores the board and has no physics or turn-end side effects', () => {
  const { live, state } = fixture();
  const board = JSON.stringify(state.cave.layers);
  assert.equal(live.submit({ first: 2, second: 3 }), true);
  settle(live);
  assert.equal(state.movesUsed, 0);
  assert.equal(state.blocksRemoved, 0);
  assert.equal(JSON.stringify(state.cave.layers), board);
  assert.equal(state.message, '매치가 만들어지지 않아 교환을 되돌렸습니다.');
});

test('a remote moving reservation does not stop diagonal flow around a real wall', () => {
  const { engine, state } = fixture();
  state.cave.terrainRules.wall = { blocksFlow: true, reaction: 'none' };
  state.cave.layers.terrain[14] = 'wall';
  for (const i of [14, 20]) { state.cave.layers.block[i] = null; state.cave.livePieceIds[i] = null; }
  const moves = engine.planLiveFalls(state, new Set([35]));
  assert.ok(moves.some(move => move.to === 20 && [13, 15].includes(move.from)));
});

function beeGoal(count) {
  const result = fixture({ initialPieceTypes: { 0: 'bee', 35: 'horizontal' },
    objectives: [{ layer: 'terrain', targetId: 'ice', countMode: 'manual', count }] });
  result.state.cave.terrainRules.ice = { reaction: 'under', durability: 1, blocksFlow: false };
  result.state.cave.layers.terrain[31] = 'ice';
  if (count > 1) result.state.cave.layers.terrain[32] = 'ice';
  return result;
}

test('the last goal targeted by a bee closes input before its flight finishes', () => {
  const { live, state, frames } = beeGoal(1);
  assert.equal(live.submit({ first: 0 }), true);
  assert.ok(frames.some(frame => frame.turnActor?.type === 'bee'));
  assert.equal(state.objectiveProgress[0].current, 1);
  assert.equal(state.status, 'playing', 'visual completion still waits for the live clock');
  assert.equal(live.active, true);
  assert.equal(live.canSwap(20), false);
  assert.equal(live.canTap(35), false);
  assert.equal(live.submit({ first: 35 }), false);
  assert.equal(live.submit({ first: 20, second: 21 }), false);
  assert.equal(state.movesUsed, 1);
  settle(live);
  assert.equal(state.status, 'won');
  assert.equal(state.movesUsed, 1);
});

test('bee flights keep concurrent input when another goal remains', () => {
  const { live, state } = beeGoal(2);
  live.submit({ first: 0 });
  assert.equal(state.objectiveProgress[0].current, 1);
  assert.equal(live.canSwap(20), true);
  assert.equal(live.canTap(35), true);
  assert.equal(live.submit({ first: 35 }), true);
  assert.equal(state.movesUsed, 2);
  settle(live);
});

test('reaching a score target also closes input while completion effects run', () => {
  const { live, state } = fixture({ scoreTarget: 100 });
  live.submit({ first: 0 });
  assert.equal(state.status, 'playing');
  assert.equal(live.canTap(35), false);
  assert.equal(live.submit({ first: 35 }), false);
  settle(live);
  assert.equal(state.status, 'won');
  assert.equal(state.movesUsed, 1);
});

function blockedColumn(holes = [20]) {
  const result = fixture();
  const { cave } = result.state;
  cave.terrainRules.wall = { blocksFlow: true, reaction: 'none' };
  cave.layers.terrain[14] = 'wall';
  for (const index of [14, ...holes]) {
    cave.layers.block[index] = null;
    cave.playtestPieces[index] = null;
    cave.livePieceIds[index] = null;
  }
  return result;
}

test('royal cross flow selects the ordinary left candidate first', () => {
  const { engine, state } = blockedColumn();
  const cross = engine.planLiveFalls(state, new Set()).find(move => move.target === 20);
  assert.equal(cross.from, 13);
  assert.equal(cross.to, 20);
  assert.equal(cross.kind, 'cross');
});

test('royal cross flow checks the right candidate when the left is special', () => {
  const { engine, state } = blockedColumn();
  state.cave.playtestPieces[13] = { type: 'bee' };
  const cross = engine.planLiveFalls(state, new Set()).find(move => move.target === 20);
  assert.equal(cross.from, 15);
});

test('a special left candidate is retained when the right has no eligible piece', () => {
  const { engine, state } = blockedColumn();
  state.cave.playtestPieces[13] = { type: 'bee' };
  const cross = engine.planLiveFalls(state, new Set([15])).find(move => move.target === 20);
  assert.equal(cross.from, 13);
});

test('straight assignments have priority over a neighbouring cross request', () => {
  const { engine, state } = blockedColumn([19, 20]);
  const moves = engine.planLiveFalls(state, new Set());
  assert.ok(moves.some(move => move.from === 13 && move.to === 19 && move.kind === 'straight'));
  assert.equal(moves.find(move => move.target === 20).from, 15);
  assert.equal(new Set(moves.map(move => move.from)).size, moves.length);
  assert.equal(new Set(moves.map(move => move.to)).size, moves.length);
});

test('a deep empty pocket is entered at its upper edge instead of jumping to the bottom', () => {
  const { engine, state } = blockedColumn([20, 26, 32]);
  const moves = engine.planLiveFalls(state, new Set());
  const cross = moves.find(move => move.target === 32);
  assert.equal(cross.from, 13);
  assert.equal(cross.to, 20);
  assert.equal(moves.filter(move => move.kind === 'cross').length, 1);
});

test('an open vertical source reserves its empty column rather than borrowing diagonally', () => {
  const { engine, state } = fixture();
  for (const index of [2, 8, 14, 20]) {
    state.cave.layers.block[index] = null;
    state.cave.livePieceIds[index] = null;
  }
  assert.equal(engine.planLiveFalls(state, new Set()).some(move => move.kind === 'cross'), false);
});

test('cross flow does not invent a refill source underneath a wall', () => {
  const { engine, state } = blockedColumn();
  const spawned = engine.refillLiveSources(state, new Set());
  assert.equal(spawned.length, 0);
  assert.equal(state.cave.layers.block[20], null);
});

test('a frozen vertical path waits instead of treating moving cells as a wall', () => {
  const { engine, state } = fixture();
  state.cave.layers.block[20] = null;
  state.cave.livePieceIds[20] = null;
  const moves = engine.planLiveFalls(state, new Set([14]));
  assert.equal(moves.some(move => move.target === 20), false);
});

test('live cross motion reserves its final fall target without locking empty-cell input', () => {
  const { live, state } = blockedColumn([20, 26, 32]);
  live.submit({ first: 0 });
  let cross;
  for (let i = 0; i < 1000 && !cross; i++) {
    live.tick(1 / 120);
    cross = [...live.motions.values()].find(move => move.kind === 'cross' && move.target !== move.to);
  }
  assert.ok(cross);
  assert.equal(live.fallBlockedCells().has(cross.target), true);
  assert.equal(live.blockedCells().has(cross.target), false);
  assert.equal(live.canSwap(cross.target, true), true);
  assert.equal(live.canSwap(cross.to, true), false);
  assert.equal(live.canSwap(cross.from, true), false);
  settle(live);
  const ids = state.cave.livePieceIds.filter(Boolean);
  assert.equal(new Set(ids).size, ids.length);
});

test('royal straight allocation preserves an explicit portal route', () => {
  const { engine, state } = fixture();
  state.cave.externalSource = { format: 'DDUNG MapInfo v68', rawMap: { size: 6, warps: '0154' } };
  state.cave.layers.gimmick[6] = 'teleport-a';
  state.cave.layers.gimmick[29] = 'teleport-b';
  state.cave.layers.block[29] = null;
  state.cave.livePieceIds[29] = null;
  const warp = engine.planLiveFalls(state, new Set()).find(move => move.target === 29);
  assert.equal(warp.from, 6);
  assert.equal(warp.to, 29);
  assert.equal(warp.warp, true);
});

test('a valid swap into a distant fall target commits before the incoming piece reaches it', () => {
  const { live, state } = blockedColumn([20, 26, 32]);
  for (const index of [31, 33, 34]) state.cave.layers.block[index] = 'red';
  live.submit({ first: 0 });
  let cross;
  for (let i = 0; i < 1000 && !cross; i++) {
    live.tick(1 / 120);
    cross = [...live.motions.values()].find(move => move.to === 20 && move.target === 32);
  }
  assert.ok(cross);
  assert.equal(state.cave.layers.block[32], null);
  assert.equal(live.canSwap(31), true);
  const used = state.movesUsed;
  assert.equal(live.submit({ first: 31, second: 32 }), true);
  assert.equal(state.movesUsed, used + 1);
  assert.ok(live.motions.has(cross.id), 'the other falling piece continues immediately');
  assert.equal(state.cave.layers.block[32], null, 'match at the empty destination resolved');
  settle(live);
  const ids = state.cave.livePieceIds.filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
});

test('an invalid swap into a distant target rolls back while its fall remains intact', () => {
  const { live, state } = blockedColumn([20, 26, 32]);
  live.submit({ first: 0 });
  let cross;
  for (let i = 0; i < 1000 && !cross; i++) {
    live.tick(1 / 120);
    cross = [...live.motions.values()].find(move => move.to === 20 && move.target === 32);
  }
  assert.ok(cross);
  const used = state.movesUsed;
  const original = state.cave.layers.block[31];
  assert.equal(live.submit({ first: 31, second: 32 }), true);
  assert.equal(state.movesUsed, used);
  assert.equal(state.cave.layers.block[31], original);
  assert.equal(state.cave.layers.block[32], null);
  assert.ok(live.motions.has(cross.id));
  settle(live);
});

test('royal allocation keeps a map cell\'s local gravity direction', () => {
  const { engine, state } = fixture();
  const gravitys = Array(36).fill('1');
  gravitys[14] = '2'; // raw y=2 -> web row 3, column 2; gravity left
  state.cave.externalSource = { format: 'DDUNG MapInfo v68', rawMap: { size: 6, gravitys: gravitys.join('') } };
  state.cave.layers.block[20] = null;
  state.cave.livePieceIds[20] = null;
  const move = engine.planLiveFalls(state, new Set()).find(move => move.target === 20);
  assert.equal(move.from, 21);
  assert.equal(move.to, 20);
});

test('explicitly disabling cross flow leaves a pocket below a wall empty', () => {
  const { engine, state } = blockedColumn();
  state.cave.flowRule = 'none';
  assert.equal(engine.planLiveFalls(state, new Set()).length, 0);
  assert.equal(engine.refillLiveSources(state, new Set()).length, 0);
  assert.equal(state.cave.layers.block[20], null);
});

test('when both cross candidates are special, the eligible right candidate wins', () => {
  const { engine, state } = blockedColumn();
  state.cave.playtestPieces[13] = { type: 'bee' };
  state.cave.playtestPieces[15] = { type: 'bomb' };
  assert.equal(engine.planLiveFalls(state, new Set()).find(move => move.target === 20).from, 15);
});

test('two cross requests cannot reserve the same donor twice', () => {
  const { engine, state } = blockedColumn([20, 22]);
  state.cave.layers.terrain[16] = 'wall';
  state.cave.layers.block[16] = null;
  state.cave.livePieceIds[16] = null;
  const moves = engine.planLiveFalls(state, new Set([13, 17]));
  assert.equal(moves.filter(move => move.from === 15).length, 1);
  assert.equal(new Set(moves.map(move => move.to)).size, moves.length);
});

test('synchronous Playtest also fills wall pockets through the royal planner', () => {
  const { engine, cave } = fixture();
  cave.terrainRules.wall = { blocksFlow: true, reaction: 'none' };
  for (const index of [14, 15]) { cave.layers.terrain[index] = 'wall'; cave.layers.block[index] = null; }
  const state = engine.createPlayState(cave, 'wall-sync', true);
  engine.playSimulationTurn(state, { first: 35 });
  assert.equal(state.movesUsed, 1);
  assert.equal(state.cave.layers.block.filter(Boolean).length, 34);
  for (const index of [14, 15]) assert.equal(state.cave.layers.block[index], null);
  for (const index of [20, 21]) assert.ok(state.cave.layers.block[index]);
});

test('clear bonus generates one random special per remaining move, then finishes without spending player moves', () => {
  const { live, state, frames } = fixture({ moveLimit: 6, scoreTarget: 100 });
  live.submit({ first: 0 });
  for (let i = 0; i < 1000 && !state.clearBonus; i++) live.tick(1 / 120);
  assert.ok(state.clearBonus);
  assert.equal(state.status, 'playing', 'result waits for the bonus');
  assert.equal(live.canSwap(35), false);
  assert.equal(live.canTap(35), false);
  settle(live);
  assert.equal(state.status, 'won');
  assert.equal(state.clearBonus.total, 5);
  assert.equal(state.clearBonus.generated, 5);
  assert.equal(state.clearBonus.remaining, 0);
  assert.equal(state.clearBonus.phase, 'done');
  assert.equal(state.movesUsed, 1);
  assert.equal(state.movesLeft, 5, 'remaining moves for stars and host rewards are preserved');
  const conversions = frames.filter(frame => frame.kind === 'bonus' && frame.label.includes('생성'));
  assert.equal(conversions.length, 5);
  for (const frame of conversions) {
    const piece = frame.cave.playtestPieces[frame.cells[0]];
    assert.ok(['horizontal', 'vertical', 'bomb', 'bee'].includes(piece.type));
  }
  const generated = state.clearBonus.generated;
  live.tick(1);
  assert.equal(state.clearBonus.generated, generated);
});

test('clear bonus uses multiple batches when remaining moves exceed available cells', () => {
  const { live, state } = fixture({ moveLimit: 61, scoreTarget: 100 });
  live.submit({ first: 0 });
  settle(live);
  assert.equal(state.status, 'won');
  assert.equal(state.clearBonus.generated, 60);
  assert.equal(state.clearBonus.remaining, 0);
  assert.equal(state.movesUsed, 1);
  const ids = state.cave.livePieceIds.filter(Boolean);
  assert.equal(new Set(ids).size, ids.length);
});

test('zero remaining moves and unlimited-move wins skip move conversion', () => {
  for (const settings of [{ moveLimit: 1 }, { moveLimitEnabled: false }]) {
    const { live, state } = fixture({ ...settings, scoreTarget: 100 });
    live.submit({ first: 0 });
    settle(live);
    assert.equal(state.status, 'won');
    assert.equal(state.clearBonus, undefined);
    assert.equal(state.movesUsed, 1);
  }
});

test('sequential preview supports the same clear bonus while automatic simulation skips presentation', () => {
  const { engine, cave } = fixture({ moveLimit: 6, scoreTarget: 100 });
  const state = engine.createPlayState(cave, 'sequential-bonus', true);
  engine.playSimulationTurn(state, { first: 0 });
  assert.equal(state.status, 'won');
  engine.playClearBonus(state);
  assert.equal(state.clearBonus.generated, 5);
  assert.equal(state.clearBonus.remaining, 0);
  assert.equal(state.movesUsed, 1);
  assert.equal(state.movesLeft, 5);
  const automatic = engine.createPlayState(cave, 'automatic', false);
  engine.playSimulationTurn(automatic, { first: 0 });
  engine.playClearBonus(automatic);
  assert.equal(automatic.status, 'won');
  assert.equal(automatic.clearBonus, undefined);
});

test('a completed goal cannot be changed to failure by a turn-end hazard before its bonus', () => {
  const { live, state } = fixture({ moveLimit: 6, scoreTarget: 100 });
  state.cave.layers.gimmick[0] = 'ddung-bee-up';
  live.submit({ first: 35 });
  settle(live);
  assert.equal(state.status, 'won');
  assert.equal(state.clearBonus.generated, 5);
  assert.equal(state.movesUsed, 1);
});

test('bee impact HP is displayed at its flight destination on arrival, not at takeoff', () => {
  const { live, state, frames } = fixture({ initialPieceTypes: { 0: 'bee' },
    objectives: [{ layer: 'terrain', targetId: 'ice', countMode: 'manual', count: 2 }] });
  state.cave.terrainRules.ice = { reaction: 'under', durability: 2, blocksFlow: false };
  state.cave.layers.terrain[29] = 'ice';
  state.cave.terrainRules.stone = { reaction: 'under', durability: 3, blocksFlow: false };
  state.cave.layers.terrain[6] = 'stone';
  live.submit({ first: 0 });
  const flight = frames.flatMap(f => f.turnActor?.flights ?? [])[0];
  assert.deepEqual([flight.from, flight.to], [0, 29]);
  const impact = frames.find(f => f.kind === 'match' && f.cells.includes(29));
  assert.ok(impact.at > 0);
  assert.equal(state.terrainHits[29], 1, 'rule state commits for input safety');
  assert.equal(live.presentation().terrainHits[29], 0, 'visible HP waits for the bee');
  while (live.clock < (impact.at - 40) / 1000) live.tick(1 / 120);
  assert.equal(live.presentation().terrainHits[29], 0);
  while (live.clock < (impact.at + 10) / 1000) live.tick(1 / 120);
  assert.equal(live.presentation().terrainHits[29], 1);
  assert.equal(state.terrainHits[6], 0, 'the block below the launch site is not hit');
  assert.equal(live.presentation().terrainHits[6], 0);
  settle(live);
});

test('a bee-destroyed obstacle keeps its artwork until arrival without restoring logical occupancy', () => {
  const { live, state, frames } = fixture({ initialPieceTypes: { 0: 'bee' },
    objectives: [{ layer: 'terrain', targetId: 'ice', countMode: 'manual', count: 2 }] });
  state.cave.terrainRules.ice = { reaction: 'under', durability: 1, blocksFlow: false };
  state.cave.layers.terrain[29] = 'ice';
  live.submit({ first: 0 });
  assert.equal(state.cave.layers.terrain[29], null);
  assert.equal(live.presentation().cave.layers.terrain[29], 'ice');
  const impact = frames.find(f => f.kind === 'match' && f.cells.includes(29));
  while (live.clock < (impact.at + 10) / 1000) live.tick(1 / 120);
  assert.equal(live.presentation().cave.layers.terrain[29], null);
  settle(live);
});
