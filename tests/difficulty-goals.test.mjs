import test from 'node:test';
import assert from 'node:assert/strict';
import { createGameEngine } from '../game-engine.js';
import { populateDifficultyGoals } from '../difficulty-goals.js';

function fixture(goals, size = 8) {
  const cave = { width: size, height: size, gravity: 'down', flowRule: 'royal',
    randomSeed: 'required-goals', usableBlocks: ['red', 'blue', 'yellow'], initialPieceTypes: {},
    objectives: goals, moveLimit: 20, parMoves: 1, scoreTarget: null, pointsPerBlock: 100,
    layers: { terrain: Array(size * size).fill('floor'), block: Array(size * size).fill(null),
      item: Array(size * size).fill(null), gimmick: Array(size * size).fill(null) } };
  const engine = createGameEngine(() => ({ caves: [cave], specialPieceRules: {} }));
  cave.terrainRules = engine.DEFAULT_TERRAIN_RULES;
  cave.gimmickRules = {};
  const populate = (source = cave, options = {}) => populateDifficultyGoals(cave, source, engine, {
    random: engine.seededRandom('test'),
    preferredSlots: (cells) => cells.slice(0, 4),
    place: (board, layer, index, id) => { board.layers[layer][index] = id; },
    ...options,
  });
  return { cave, engine, populate };
}

test('Jelly 20 is mandatory even with no optional terrain and only four preferred slots', () => {
  const goal = { id: 'jelly', layer: 'terrain', targetId: 'ddung-jelly', countMode: 'manual', count: 20 };
  const { cave, engine, populate } = fixture([goal]);
  assert.equal(populate().ok, true);
  assert.equal(engine.countObjectiveAssets(cave, goal), 20);
  assert.equal(cave.objectives[0].count, 20);
  assert.equal(engine.createPlayState(cave, 'test').objectiveProgress[0].target, 20);
});

test('falling dust goals place initial objects instead of using normal color-goal generation', () => {
  const goal = { layer: 'block', targetId: 'ddung-dust-piece', countMode: 'manual', count: 6 };
  const { cave, engine, populate } = fixture([goal]);
  assert.equal(populate().ok, true);
  assert.equal(engine.countObjectiveAssets(cave, goal), 6);
  cave.layers.terrain[cave.layers.block.indexOf(goal.targetId)] = 'ddung-frost';
  const state = engine.createPlayState(JSON.parse(JSON.stringify(cave)), 'dust-in-ice');
  assert.equal(state.objectiveProgress[0].target, 6);
  assert.equal(state.cave.layers.block.filter(id => id === goal.targetId).length, 6);
  const trapped = state.cave.layers.terrain.indexOf('ddung-frost');
  assert.equal(state.cave.layers.block[trapped], goal.targetId);
  assert.equal(engine.isSwapBlocked(state.cave, trapped), true);
  assert.equal(engine.findMatches(state.cave).has(trapped), false);
});

test('board-count goals keep their original quantity instead of becoming one', () => {
  const goal = { layer: 'terrain', targetId: 'ddung-jelly', countMode: 'auto-map', count: 1 };
  const { cave, engine, populate } = fixture([goal]);
  const source = structuredClone(cave);
  source.layers.terrain.fill('ddung-jelly', 0, 20);
  assert.equal(populate(source).ok, true);
  assert.equal(engine.resolvedObjectiveCount(cave, goal), 20);
});

test('legacy event images are removed from candidates while event flags stay enabled', () => {
  const { cave, populate } = fixture([]);
  cave.layers.gimmick[0] = 'ddung-mouse-panel';
  cave.layers.gimmick[1] = 'ddung-spider-cave';
  cave.turnEvents = { mouse: true, spider: true };
  assert.equal(populate().ok, true);
  assert.equal(cave.layers.gimmick.some(Boolean), false);
  assert.deepEqual(cave.turnEvents, { mouse: true, spider: true });
});

test('multiple fixed-object goals are supplied before optional decorations', () => {
  const goals = [
    { layer: 'terrain', targetId: 'ddung-jelly', countMode: 'manual', count: 20 },
    { layer: 'terrain', targetId: 'ice', countMode: 'manual', count: 10 },
    { layer: 'gimmick', targetId: 'ddung-box', countMode: 'manual', count: 3 },
    { layer: 'item', targetId: 'ddung-treasure-1', countMode: 'manual', count: 2 },
  ];
  const { cave, engine, populate } = fixture(goals);
  assert.equal(populate().ok, true);
  for (const goal of goals) {
    assert.equal(engine.countObjectiveAssets(cave, goal), engine.isDdungTreasure(goal.targetId) ? 0 : goal.count);
    assert.equal(engine.resolvedObjectiveCount(cave, goal), goal.count);
  }
});

test('collection quotas exceed board capacity without preplacing collection pieces', () => {
  const goal = { layer: 'item', targetId: 'ddung-treasure-1', countMode: 'manual', count: 20 };
  const { cave, engine, populate } = fixture([goal], 4);
  assert.equal(populate().ok, true);
  assert.equal(engine.countObjectiveAssets(cave, goal), 0);
  assert.equal(cave.layers.gimmick.filter(id => id === 'exit').length, 4);
  const state = engine.createPlayState(JSON.parse(JSON.stringify(cave)), 'collection');
  assert.equal(state.objectiveProgress[0].target, 20);
  assert.equal(state.cave.layers.block.some(engine.isDdungTreasure), false);
  assert.equal(state.status, 'playing');
});

test('automatic collection quotas survive JSON loading without initial collection pieces', () => {
  const setup = difficulty => {
    const goal = { layer: 'item', targetId: 'ddung-treasure-2', countMode: 'auto-map', count: 1 };
    const { cave, engine, populate } = fixture([goal]);
    assert.equal(populate(structuredClone(cave), { difficulty, keepPlacement: false }).ok, true);
    const saved = JSON.parse(JSON.stringify(cave));
    assert.equal(engine.createPlayState(saved, 'auto-collection').objectiveProgress[0].target, goal.count);
    assert.equal(engine.countObjectiveAssets(cave, goal), 0);
    return goal.count;
  };
  assert.ok(setup(90) > setup(10));
});

test('insufficient space reports the requested amount instead of reducing the goal', () => {
  const goal = { layer: 'terrain', targetId: 'ddung-jelly', countMode: 'manual', count: 20 };
  const { cave, populate } = fixture([goal], 4);
  const result = populate();
  assert.equal(result.ok, false);
  assert.match(result.error, /20개.*공간이 부족/);
  assert.equal(cave.objectives[0].count, 20);
});

test('additional Jelly cells count alongside imported Jelly groups after generation', () => {
  const goal = { id: 'ddung-target-0-36', layer: 'terrain', targetId: 'ddung-jelly', countMode: 'manual', count: 20 };
  const { cave, engine, populate } = fixture([goal]);
  cave.externalSource = { format: 'DDUNG MapInfo v68', rawMap: { size: 8, jellys: '00101101010110111101' } };
  for (const index of [0, 1, 8, 9]) cave.layers.terrain[index] = 'ddung-jelly';
  assert.equal(engine.countObjectiveAssets(cave, goal), 1);
  assert.equal(populate().ok, true);
  assert.equal(engine.countObjectiveAssets(cave, goal), 20);
  const reloaded = JSON.parse(JSON.stringify(cave));
  assert.equal(engine.resolvedObjectiveCount(reloaded, goal), 20);
});

function adaptiveJelly(difficulty, size = 8, extras = {}) {
  const goal = { layer: 'terrain', targetId: 'ddung-jelly', countMode: 'auto-map', count: 1 };
  const setup = fixture([goal], size);
  Object.assign(setup.cave, extras);
  assert.equal(setup.populate(structuredClone(setup.cave), { difficulty, keepPlacement: false }).ok, true);
  return { ...setup, count: setup.engine.resolvedObjectiveCount(setup.cave, goal) };
}

test('automatic objective counts grow with requested difficulty and board area', () => {
  const easy = adaptiveJelly(10).count;
  const normal = adaptiveJelly(50).count;
  const hard = adaptiveJelly(90).count;
  assert.ok(easy > 1);
  assert.ok(easy < normal && normal < hard);
  assert.ok(adaptiveJelly(50, 10).count > normal);
  assert.ok(adaptiveJelly(50, 8, { moveLimit: 10 }).count < normal);
});

test('manual counts stay fixed while automatic counts consider object durability', () => {
  const manual = fixture([{ layer: 'terrain', targetId: 'ddung-jelly', countMode: 'manual', count: 20 }]);
  assert.equal(manual.populate(structuredClone(manual.cave), { difficulty: 100, keepPlacement: false }).ok, true);
  assert.equal(manual.cave.layers.terrain.filter(x => x === 'ddung-jelly').length, 20);
  const ice = fixture([{ layer: 'terrain', targetId: 'ice', countMode: 'auto-map', count: 1 }]);
  assert.equal(ice.populate(structuredClone(ice.cave), { difficulty: 90, keepPlacement: false }).ok, true);
  assert.ok(ice.cave.layers.terrain.filter(x => x === 'ice').length < adaptiveJelly(90).count);
});

test('regeneration can lower old automatic quantities, while preserving placement keeps them', () => {
  const goal = { layer: 'terrain', targetId: 'ddung-jelly', countMode: 'auto-map', count: 50 };
  for (const keepPlacement of [false, true]) {
    const { cave, engine, populate } = fixture([structuredClone(goal)]);
    cave.layers.terrain.fill('ddung-jelly', 0, 50);
    assert.equal(populate(structuredClone(cave), { difficulty: 10, keepPlacement }).ok, true);
    assert.equal(engine.countObjectiveAssets(cave, goal) === 50, keepPlacement);
  }
});

test('manual goals reserve space before automatic goals even when ordered after them', () => {
  const auto = { layer: 'terrain', targetId: 'ddung-jelly', countMode: 'auto-map', count: 1 };
  const manual = { layer: 'terrain', targetId: 'ice', countMode: 'manual', count: 50 };
  const { cave, engine, populate } = fixture([auto, manual]);
  assert.equal(populate(structuredClone(cave), { difficulty: 90, keepPlacement: false }).ok, true);
  assert.equal(engine.countObjectiveAssets(cave, manual), 50);
  assert.ok(engine.countObjectiveAssets(cave, auto) >= 1);
  assert.ok(engine.countObjectiveAssets(cave, auto) <= 14);
});

test('regenerated imported Jelly uses the chosen quantity after JSON reload and play startup', () => {
  const auto = { id: 'ddung-target-0-36', layer: 'terrain', targetId: 'ddung-jelly', countMode: 'auto-map', count: 1 };
  const { cave, engine, populate } = fixture([auto]);
  cave.generatedBoard = true;
  cave.externalSource = { format: 'DDUNG MapInfo v68', rawMap: { size: 8, jellys: '00101101010110111101' } };
  for (const index of [0, 1, 8, 9]) cave.layers.terrain[index] = 'ddung-jelly';
  assert.equal(populate(structuredClone(cave), { difficulty: 80, keepPlacement: false }).ok, true);
  const actual = cave.layers.terrain.filter(x => x === 'ddung-jelly').length;
  assert.ok(actual > 4);
  const saved = JSON.parse(JSON.stringify(cave));
  assert.equal(engine.resolvedObjectiveCount(saved, auto), actual);
  assert.equal(engine.createPlayState(saved, 'reload').objectiveProgress[0].target, actual);
});
