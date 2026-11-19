import { AUTO_UNLIMITED_TURN_LIMIT, createGameEngine } from "./game-engine.js?v=19";
import { createLiveGame } from "./live-game.js?v=8";

const gameEngine = createGameEngine(() => project);

const {
  SPAWNER_ID,
  DDUNG_PANELS,
  DDUNG_JAM_COLORS,
  DDUNG_PANEL_TILES,
  DDUNG_SOLID_PANELS,
  DEFAULT_TERRAIN_RULES,
  deepCopy,
  clampNumber,
  isDdungSource,
  ddungObjectiveType,
  ddungUsesBoardCount,
  isDdungBoardObjective,
  ddungGoalLimitation,
  matchesObjectiveAsset,
  countObjectiveAssets,
  resolvedObjectiveCount,
  isExcluded,
  seededRandom,
  placeGenerationSpawners,
  usesDdungGeneration,
  findMatches,
  customMatchCells,
  neighborsOf,
  ddungCellGravities,
  ddungBoxDurability,
  isSwapBlocked,
  ddungPanelId,
  ddungGimmickBase,
  ddungGimmickGroup,
  ddungGimmickDurability,
  isDdungGimmickBarrier,
  isBarrier,
  isDdungTreasure,
  ddungMarkersAt,
  terrainGroup,
  matchesObjectiveOnLayer,
  ddungJellyCells,
  terrainDurabilityAt,
  hasPossibleSwap,
  SPECIAL_EFFECTS,
  SCRIPT_EFFECT_LABEL,
  parseEffectScript,
  specialEffectLabel,
  specialEffect,
  canCombineSpecials,
  swapPlaytestBlocks,
  findPlayableAction,
  chooseAutoAction,
  bombPanelReady,
  ddungTurnEvents,
  playSimulationTurn,
  createPlayState,
  runAutoGame,
  DDUNG_COLOR_IDS,
  DDUNG_BLOCK_CHARACTERS,
  ddungGridIndex,
  ddungPositionGroups,
  blockWeight,
  ddungCellSource,
  ddungInitialPiece,
  initialPieceAt,
  EDITABLE_INITIAL_PIECES,
  SPECIAL_MATCH_SHAPES,
  PROJECT_COMBO_EFFECTS,
  allowsSquareMatches,
} = gameEngine;

const COLORS = {
  red: "#ef4f5f", yellow: "#f7c73b", blue: "#35a9ff",
  green: "#36d477", orange: "#ff8a36", purple: "#b65bff",
};

const CLIENT_VERSION = "2.7.64";
const SCHEMA_VERSION = 5;
const MIN_SCHEMA_VERSION = 1;

const ASSETS = {
  terrain: [
    { id: "floor", name: "Floor", className: "terrain-floor", visual: "·" },
    { id: "ddung-jam-blue", name: "DDUNG Jam Blue", visual: "●" },
    { id: "ddung-jam-green", name: "DDUNG Jam Green", visual: "●" },
    { id: "ddung-jam-orange", name: "DDUNG Jam Orange", visual: "●" },
    { id: "ddung-jam-pink", name: "DDUNG Jam Pink", visual: "●" },
    { id: "ddung-jam-purple", name: "DDUNG Jam Purple", visual: "●" },
    { id: "ddung-jam-yellow", name: "DDUNG Jam Yellow", visual: "●" },
    { id: "ddung-bomb-panel", name: "DDUNG Bomb Panel", visual: "✹" },
    { id: "ddung-chocolate", name: "DDUNG Chocolate", visual: "▣" },
    { id: "wall", name: "Wall", className: "terrain-wall", visual: "▦" },
    { id: "ice", name: "Ice", className: "terrain-ice", visual: "❄" },
    { id: "pit", name: "Pit", className: "terrain-pit", visual: "●" },
    { id: "conveyor", name: "Conveyor", className: "terrain-conveyor", visual: "➜" },
    { id: "ddung-web", name: "DDUNG Web", className: "terrain-ddung-web", visual: "⌁" },
    { id: "ddung-dust", name: "DDUNG Dust", className: "terrain-ddung-dust", visual: "░" },
    { id: "ddung-oak", name: "DDUNG Oak", className: "terrain-ddung-oak", visual: "♣" },
    { id: "ddung-stone", name: "DDUNG Stone", className: "terrain-ddung-stone", visual: "▰" },
    { id: "ddung-stone-thick", name: "DDUNG Stone (2단계)", className: "terrain-ddung-stone", visual: "▰" },
    { id: "ddung-water", name: "DDUNG Water", className: "terrain-ddung-water", visual: "≈" },
    { id: "ddung-frost", name: "DDUNG Frost", className: "terrain-ddung-ice", visual: "❅" },
    { id: "ddung-ice", name: "DDUNG Ice", className: "terrain-ddung-ice", visual: "❅" },
    { id: "ddung-heather-small", name: "DDUNG Heather Small", className: "terrain-ddung-heather", visual: "♨" },
    { id: "ddung-heather-large", name: "DDUNG Heather Large", className: "terrain-ddung-heather", visual: "♨" },
    { id: "ddung-jelly", name: "DDUNG Jelly", className: "terrain-ddung-jelly", visual: "◫" },
  ],
  block: [
    ...Object.keys(COLORS).map((id) => ({ id, name: id[0].toUpperCase() + id.slice(1), className: `block-${id}`, visual: "◆" })),
    { id: "ddung-dust-piece", name: "DDUNG Dust", visual: "░" },
  ],
  gimmick: [
    { id: "teleport-a", name: "Teleport A", visual: "◉" },
    { id: "teleport-b", name: "Teleport B", visual: "◎" },
    { id: "switch", name: "Switch", visual: "⏻" },
    { id: "door", name: "Door", visual: "▥" },
    { id: "arrow-up", name: "Arrow Up", visual: "↑" },
    { id: "arrow-down", name: "Arrow Down", visual: "↓" },
    { id: SPAWNER_ID, name: "Spawner", visual: "✦" },
    { id: "exit", name: "Exit", visual: "⇥", className: "cell-exit" },
    { id: "ddung-box", name: "DDUNG Box", visual: "□" },
    { id: "ddung-mouse-panel", name: "DDUNG Mouse Panel", visual: "◉" },
    { id: "ddung-dungs", name: "DDUNG Dungs", visual: "♟" },
    { id: "ddung-bulldozer", name: "DDUNG Ghost", visual: "▸" },
    { id: "ddung-spider-cave", name: "DDUNG Spider Cave", visual: "⌂" },
    { id: "ddung-bee", name: "DDUNG Honey", visual: "♢" },
    { id: "ddung-feng", name: "DDUNG Feng", visual: "風" },
    { id: "ddung-mayor-small", name: "DDUNG Mayor Small", visual: "♙" },
    { id: "ddung-mayor-large", name: "DDUNG Mayor Large", visual: "♛" },
    { id: "ddung-bee-up", name: "DDUNG Bee Up", visual: "⇧" },
    { id: "ddung-octo", name: "DDUNG 얼음 속 가방", visual: "👜" },
    ...Object.entries(DDUNG_PANELS).map(([id, [, name, visual]]) => ({ id, name, visual })),
  ],
  item: [
    { id: "coin", name: "Coin", visual: "●" },
    { id: "key", name: "Key", visual: "⚿" },
    { id: "star", name: "Star", visual: "★" },
    { id: "bomb", name: "Bomb", visual: "✹" },
    { id: "bonus", name: "Bonus", visual: "+" },
    { id: "ddung-treasure-1", name: "모자 · 수집형 기믹", visual: "◆" },
    { id: "ddung-treasure-2", name: "가방 · 수집형 기믹", visual: "◇" },
  ],
};

const FLOW_RULES = ["royal", "none"];
const MAX_OBJECTIVES = 4;
const LAYER_LABELS = { block: "블록", terrain: "지형", gimmick: "기믹", item: "아이템" };
const OBJECTIVE_ACTIONS = {
  block: { action: "match", label: "매치해서 제거" },
  terrain: { action: "destroy", label: "내구도 소진 후 파괴" },
  gimmick: { action: "activate", label: "매치로 활성화" },
  item: { action: "collect", label: "같은 칸 매치로 수집" },
};

const STORAGE_KEY = "windy-cave-map-tool-v1";

const emptyLayers = (size) => ({ terrain: Array(size).fill(null), block: Array(size).fill(null), gimmick: Array(size).fill(null), item: Array(size).fill(null) });

// Older saves used the then-current palette order and did not store a dictionary.
const LEGACY_PACKED_LAYERS = [
  {
    terrain: ["floor","wall","ice","pit","conveyor","ddung-web","ddung-dust","ddung-oak","ddung-stone","ddung-stone-thick","ddung-water","ddung-frost","ddung-ice","ddung-heather-small","ddung-heather-large","ddung-jelly"],
    item: ["coin","key","star","bomb","bonus","ddung-treasure-1","ddung-treasure-2","ddung-chocolate","ddung-jam-blue","ddung-jam-green","ddung-jam-orange","ddung-jam-pink","ddung-jam-purple","ddung-jam-yellow"],
  },
  {
    terrain: ["floor","ddung-chocolate","wall","ice","pit","conveyor","ddung-web","ddung-dust","ddung-oak","ddung-stone","ddung-stone-thick","ddung-water","ddung-frost","ddung-ice","ddung-heather-small","ddung-heather-large","ddung-jelly"],
    item: ["coin","key","star","bomb","bonus","ddung-treasure-1","ddung-treasure-2","ddung-jam-blue","ddung-jam-green","ddung-jam-orange","ddung-jam-pink","ddung-jam-purple","ddung-jam-yellow"],
  },
  {
    terrain: ["floor","ddung-jam-blue","ddung-jam-green","ddung-jam-orange","ddung-jam-pink","ddung-jam-purple","ddung-jam-yellow","ddung-bomb-panel","ddung-chocolate","wall","ice","pit","conveyor","ddung-web","ddung-dust","ddung-oak","ddung-stone","ddung-stone-thick","ddung-water","ddung-frost","ddung-ice","ddung-heather-small","ddung-heather-large","ddung-jelly"],
    item: ["coin","key","star","bomb","bonus","ddung-treasure-1","ddung-treasure-2"],
  },
];

function legacyPackedCatalog(source) {
  if (source.storageFormat !== "packed-layers-v1" && !source.caves.some((cave) => cave?.packedLayers)) return {};
  // Browser saves contain a timestamp. These are the two Pages deployments that changed the old order.
  const savedAt = Number(source.savedAt) || 0;
  const preferred = savedAt >= Date.parse("2026-11-12T07:11:54Z") ? 2
    : savedAt >= Date.parse("2026-11-12T07:03:34Z") ? 1 : 0;
  const mismatches = (catalog) => {
    let count = 0;
    for (const layer of ["terrain", "item"]) {
      const palette = new Set(source.paletteAssets?.[layer] || []);
      const codes = new Set(source.caves.flatMap((cave) => [...String(cave?.packedLayers?.[layer] || "")]));
      for (const code of codes) {
        const index = code.charCodeAt(0) - 34;
        if (index < 0) continue;
        const id = catalog[layer][index];
        if (!id || (palette.size && !palette.has(id))) count += 1;
      }
    }
    return count;
  };
  let best = LEGACY_PACKED_LAYERS[preferred];
  let errors = mismatches(best);
  for (const catalog of LEGACY_PACKED_LAYERS) {
    const count = mismatches(catalog);
    if (count < errors) {
      best = catalog;
      errors = count;
    }
  }
  return best;
}

function packLayer(ids, values) {
  return values.map((value) => value === null ? "!" : String.fromCharCode(34 + ids.indexOf(value))).join("");
}

function unpackLayer(ids, packed, size) {
  const text = String(packed || "");
  return Array.from({ length: size }, (_, index) => ids[text.charCodeAt(index) - 34] || null);
}

function packProjectForStorage(value) {
  const packedLayerIds = Object.fromEntries(Object.entries(ASSETS).map(([layer, assets]) =>
    [layer, assets.map(({ id }) => id)]));
  return {
    ...value,
    storageFormat: "packed-layers-v2",
    packedLayerIds,
    caves: value.caves.map((cave) => {
      const layers = {};
      const packedLayers = {};
      for (const [layer, values] of Object.entries(cave.layers)) {
        const ids = packedLayerIds[layer];
        const knownIds = new Set(ids);
        if (values.some((id) => id !== null && !knownIds.has(id))) layers[layer] = values;
        else packedLayers[layer] = packLayer(ids, values);
      }
      const compact = { ...cave, layers, packedLayers };
      delete compact.targetType;
      delete compact.targetCount;
      delete compact.terrainRules;
      delete compact.gimmickRules;
      if (compact.testClearMoves === 0) delete compact.testClearMoves;
      if (compact.simulationRuns === 30) delete compact.simulationRuns;
      if (compact.randomDensity === 100) delete compact.randomDensity;
      if (compact.flowRule === "royal") delete compact.flowRule;
      if (!compact.failureBonus) delete compact.failureBonus;
      return compact;
    }),
  };
}

function createCave(number, name = `Cave ${String(number).padStart(4, "0")}`) {
  const width = 10;
  const height = 12;
  const layers = emptyLayers(width * height);
  return {
    id: crypto.randomUUID(), number, name, width, height, gravity: "down", layers,
    usableBlocks: Object.keys(COLORS),
    levelSettings: normalizeLevelSettings({}),
    objectives: [],
    scoreTarget: null, pointsPerBlock: 100,
    targetType: null, targetCount: 0,
    moveLimit: 20, moveLimitEnabled: true, parMoves: 14, testClearMoves: 0,
    simulationRuns: 30,
    randomSeed: `CAVE-${String(number).padStart(4, "0")}`, randomDensity: 100,
    flowRule: "royal", terrainRules: deepCopy(DEFAULT_TERRAIN_RULES),
    specialMatches: true, failureBonus: true, note: "",
  };
}

const defaultProject = () => ({ version: "V0001", assetDefinitions: {}, paletteAssets: { gimmick: [SPAWNER_ID] }, caves: [createCave(1)], activeCaveId: null });
let project;
let projectDatabase;
let saveQueue = Promise.resolve();

let activeLayer = "block";
let activeTool = "brush";
let selectedAssets = { terrain: null, block: null, gimmick: null, item: null };
let undoStack = [];
let redoStack = [];
let isPainting = false;
let strokeSnapshotTaken = false;
let playtestState = null;
let puzzleArtwork = null;
let puzzleView = null;
let puzzleBurst = null;
let selectedTerrainRule = "ice";
let caveSearchQuery = "";

const $ = (id) => document.getElementById(id);
const activeCave = () => project.caves.find((c) => c.id === project.activeCaveId);

function normalizeColor(value) {
  if (value == null) return null;
  const key = String(value).trim().toLowerCase();
  const aliases = {
    r: "red", 빨강: "red", 빨간색: "red",
    y: "yellow", 노랑: "yellow", 노란색: "yellow",
    b: "blue", 파랑: "blue", 파란색: "blue",
    g: "green", 초록: "green", 녹색: "green",
    o: "orange", 주황: "orange", 주황색: "orange",
    p: "purple", 보라: "purple", 보라색: "purple",
  };
  const normalized = aliases[key] || key;
  return Object.hasOwn(COLORS, normalized) ? normalized : null;
}

function normalizeGravity(value) {
  const key = String(value ?? "down").trim().toLowerCase();
  const aliases = { 0: "down", 1: "left", 2: "up", 3: "right", d: "down", u: "up", l: "left", r: "right", 아래: "down", 위: "up", 왼쪽: "left", 오른쪽: "right" };
  const normalized = aliases[key] || key;
  return ["up", "down", "left", "right"].includes(normalized) ? normalized : "down";
}

function assetId(value) {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const id = String(value).trim();
  if (!id || /^(?:0|empty|none|null|air|void|__proto__|constructor|prototype)$/i.test(id)) return null;
  return id;
}

const DDUNG_ART = new Set(["red", "blue", "green", "yellow", "purple", "orange",
  "ddung-box", "ddung-ice", "ddung-web", "ddung-mouse-panel", "ddung-water",
  "ddung-heather-small", "ddung-heather-large", "ddung-stone", "ddung-stone-thick",
  "ddung-jelly", "ddung-dungs", "ddung-iron-box"]);

function normalizeObjectImage(value, maxLength = 100000) {
  return typeof value === "string" && value.length <= maxLength &&
    /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/]+={0,2}$/.test(value) ? value : null;
}

function normalizeAssetDefinitions(source) {
  return Object.fromEntries(Object.keys(ASSETS).map((layer) => {
    const definitions = Array.isArray(source?.[layer]) ? source[layer] : [];
    const unique = new Map();
    for (const definition of definitions) {
      const id = assetId(definition?.id);
      if (!id) continue;
      const image = normalizeObjectImage(definition.image);
      unique.set(id, { id, name: String(definition.name || id), ...(image ? { image } : {}) });
    }
    return [layer, [...unique.values()]];
  }));
}

function normalizeObjective(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : {};
  const requestedLayer = String(source.layer || source.category || fallback.layer || "block").toLowerCase();
  let layer = Object.prototype.hasOwnProperty.call(ASSETS, requestedLayer) ? requestedLayer : "block";
  const fallbackTarget = ASSETS[layer][0]?.id || "red";
  let targetId = source.targetId ?? source.objectId ?? source.type ?? source.target ?? source.color ?? fallback.targetId ?? fallbackTarget;
  targetId = assetId(targetId) || fallbackTarget;
  // Keep the existing JSON collection key while presenting treasures as gimmicks.
  if (isDdungTreasure(targetId)) layer = "item";
  const defaultAction = OBJECTIVE_ACTIONS[layer].action;
  const requestedAction = String(source.action || source.condition || defaultAction).toLowerCase();
  const actionAliases = { clear: "match", remove: layer === "terrain" ? "destroy" : defaultAction, break: "destroy", pickup: "collect", trigger: "activate" };
  const action = actionAliases[requestedAction] || requestedAction;
  const countMode = String(source.countMode || source.count_mode || fallback.countMode || "manual").toLowerCase() === "auto-map" ? "auto-map" : "manual";
  return {
    id: String(source.id || fallback.id || crypto.randomUUID()),
    layer,
    targetId,
    action: action === defaultAction ? action : defaultAction,
    countMode,
    count: clampNumber(source.count, fallback.count || 1, 1, 999),
  };
}

function normalizeObjectives(source) {
  if (Array.isArray(source.objectives)) {
    return source.objectives.slice(0, MAX_OBJECTIVES).map((objective) => normalizeObjective(objective));
  }
  if (source.targetType == null && source.targetCount == null) return [];
  const legacyTarget = normalizeColor(source.targetType) || assetId(source.targetType) || "purple";
  return [normalizeObjective({ layer: "block", targetId: legacyTarget, action: "match", countMode: "manual", count: clampNumber(source.targetCount, 8, 1, 999) })];
}

function collectPaletteAssets(caves, saved = {}, definitions = {}) {
  const used = Object.fromEntries(Object.keys(ASSETS).map((layer) => [
    layer, new Set([...(Array.isArray(saved?.[layer]) ? saved[layer] : []), ...(definitions[layer] || []).map(({ id }) => id)]),
  ]));
  used.gimmick.add(SPAWNER_ID);
  for (const cave of caves) {
    for (const layer of Object.keys(ASSETS)) {
      for (const id of cave.layers[layer]) used[layer].add(layer === "gimmick" && id ? ddungGimmickBase(id) : id);
    }
    for (const id of cave.usableBlocks) used.block.add(id);
    for (const objective of cave.objectives) used[objective.layer].add(objective.targetId);
  }
  return Object.fromEntries(Object.entries(used).map(([layer, ids]) => [
    layer, [...ids].filter((id) => assetId(id)),
  ]));
}

function normalizeProject(data) {
  const source = data && typeof data === "object" ? data : {};
  const rawCaves = Array.isArray(source.caves) ? source.caves : [];
  const ddungOnly = rawCaves.some((cave) => isDdungSource(cave?.externalSource)) &&
    rawCaves.every((cave) => !cave?.externalSource || isDdungSource(cave.externalSource));
  const catalog = source.storageFormat === "packed-layers-v2"
    ? source.packedLayerIds || {} : legacyPackedCatalog({ ...source, caves: rawCaves });
  const caves = rawCaves.map((cave, index) => normalizeCave(cave, index, ddungOnly, catalog));
  if (!caves.length) caves.push(createCave(1));
  const usedNumbers = new Set();
  for (const cave of caves) {
    if (!Number.isSafeInteger(cave.number) || cave.number < 1 || usedNumbers.has(cave.number)) delete cave.number;
    else usedNumbers.add(cave.number);
  }
  let nextNumber = 1;
  for (const cave of caves) {
    if (cave.number) continue;
    while (usedNumbers.has(nextNumber)) nextNumber += 1;
    cave.number = nextNumber;
    usedNumbers.add(nextNumber);
  }
  const activeCaveId = caves.some((cave) => cave.id === source.activeCaveId) ? source.activeCaveId : caves[0].id;
  const assetDefinitions = normalizeAssetDefinitions(source.assetDefinitions);
  for (const definition of assetDefinitions.item) {
    const id = ddungPanelFromItem(definition.id, ddungOnly);
    if (id && !assetDefinitions.terrain.some((asset) => asset.id === id)) {
      assetDefinitions.terrain.push({ ...definition, id });
    }
  }
  assetDefinitions.item = assetDefinitions.item.filter(({ id }) => !ddungPanelFromItem(id, ddungOnly));
  const palette = source.paletteAssets;
  const paletteAssets = collectPaletteAssets(caves, {
    ...palette,
    item: Array.isArray(palette?.item) ? palette.item.filter((id) => !ddungPanelFromItem(id, ddungOnly)) : [],
  }, assetDefinitions);
  const { savedAt, storageFormat, packedLayerIds, ...metadata } = source;
  const terrainRules = source.terrainRules && typeof source.terrainRules === "object"
    ? normalizeTerrainRules(source.terrainRules)
    : { ...normalizeTerrainRules(), ...legacySharedRules(caves, "terrainRules", isCustomTerrainRule) };
  const gimmickRules = source.gimmickRules && typeof source.gimmickRules === "object"
    ? normalizeGimmickRules(source.gimmickRules)
    : legacySharedRules(caves, "gimmickRules");
  const normalized = { ...metadata, specialPieceRules: normalizeSpecialPieceRules(source.specialPieceRules), version: String(source.contentVersion || source.version || "V0001"), caves, activeCaveId, assetDefinitions, paletteAssets, terrainRules, gimmickRules };
  if (normalized.editorTheme) normalized.editorTheme = collectionGimmickTheme(normalized.editorTheme);
  if (normalized.appliedEditorTheme) normalized.appliedEditorTheme = collectionGimmickTheme(normalized.appliedEditorTheme);
  normalized.swapDuringEffects = source.swapDuringEffects !== false;
  bindProjectObjectRules(normalized);
  return normalized;
}

function legacySharedRules(caves, field, include = () => true) {
  const rules = new Map();
  for (const cave of [...caves].sort((a, b) => a.number - b.number)) {
    for (const [id, rule] of Object.entries(cave[field] ?? {})) {
      if (!rules.has(id) && include(id, rule)) rules.set(id, rule);
    }
  }
  return Object.fromEntries(rules);
}

function bindProjectObjectRules(value) {
  for (const cave of value.caves) {
    cave.terrainRules = value.terrainRules;
    cave.gimmickRules = value.gimmickRules;
  }
}

function normalizeTerrainRule(id, rule = {}) {
  const fallback = getDefaultTerrainRule(id);
  return {
    blocksFlow: rule.blocksFlow == null ? fallback.blocksFlow : Boolean(rule.blocksFlow),
    blocksSwap: rule.blocksSwap == null ? Boolean(fallback.blocksSwap) : Boolean(rule.blocksSwap),
    locksBlock: rule.locksBlock == null ? Boolean(fallback.locksBlock) : Boolean(rule.locksBlock),
    reaction: ["none", "under", "adjacent", "adjacent-only", "splash"].includes(rule.reaction) ? rule.reaction : fallback.reaction,
    durability: clampNumber(rule.durability, fallback.durability, 1, 99),
  };
}

function normalizeTerrainRules(saved = {}) {
  const ids = new Set([...Object.keys(DEFAULT_TERRAIN_RULES), ...Object.keys(saved).filter(assetId)]);
  return Object.fromEntries([...ids].map((id) => [id, normalizeTerrainRule(id, saved[id] ?? {})]));
}

function isCustomTerrainRule(id, rule) {
  return JSON.stringify(rule) !== JSON.stringify(normalizeTerrainRule(id));
}

function normalizeGimmickRules(saved = {}) {
  return Object.fromEntries(Object.entries(saved).flatMap(([key, rule]) => {
    const id = assetId(key);
    if (!id || !rule || typeof rule !== "object") return [];
    return [[id, {
      durability: clampNumber(rule.durability, 1, 1, 99),
      reaction: ["direct", "adjacent", "either"].includes(rule.reaction) ? rule.reaction : "direct",
      blocksFlow: rule.blocksFlow === true,
      nextId: assetId(rule.nextId),
    }]];
  }));
}

function normalizeLevelSettings(source) {
  const raw = source.externalSource?.rawMap;
  const scores = [null, null, null];
  for (const entry of String(raw?.starscores ?? "").match(/\d{8}/g) || []) {
    const star = Number(entry.slice(0, 2));
    if (star >= 1 && star <= 3) scores[star - 1] = Number(entry.slice(2));
  }
  const settings = source.levelSettings;
  return {
    starScores: scores.map((fallback, index) => {
      const score = settings?.starScores ? settings.starScores[index] : fallback;
      return Number.isSafeInteger(score) && score >= 0 ? score : null;
    }),
    difficulty: [0, 1, 2].includes(settings?.difficulty) ? settings.difficulty
      : [0, 1, 2].includes(raw?.levelclass) ? raw.levelclass : 0,
    spawnMode: [0, 1, 2].includes(settings?.spawnMode) ? settings.spawnMode
      : [0, 1, 2].includes(raw?.objectcreate) ? raw.objectcreate : raw ? 0 : 1,
  };
}

function renderLevelSettings(cave) {
  const settings = cave.levelSettings;
  for (const [index, score] of settings.starScores.entries()) {
    $("levelStar" + (index + 1)).value = score ?? "";
  }
  $("levelDifficulty").value = settings.difficulty;
  $("levelSpawnMode").value = settings.spawnMode;
}

function saveLevelSettings(event) {
  event.preventDefault();
  const starScores = [1, 2, 3].map((star) => $("levelStar" + star).valueAsNumber).map((score) =>
    Number.isNaN(score) ? null : score
  );
  const specified = starScores.filter((score) => score !== null);
  if (specified.some((score, index) => !Number.isSafeInteger(score) || (index > 0 && score < specified[index - 1]))) {
    $("levelSettingsStatus").textContent = "별 점수는 낮은 별부터 오름차순으로 입력하세요.";
    return;
  }
  snapshot();
  activeCave().levelSettings = {
    starScores,
    difficulty: Number($("levelDifficulty").value),
    spawnMode: Number($("levelSpawnMode").value),
  };
  persist();
  $("levelSettingsStatus").textContent = "레벨 설정을 저장했습니다.";
}

function ddungPanelFromItem(id, ddung) {
  if (id === "bomb" && ddung) return "ddung-bomb-panel";
  return id === "ddung-chocolate" || Object.hasOwn(DDUNG_JAM_COLORS, id) ? id : null;
}

function normalizeCave(data, index = 0, ddungProject = false, packedCatalog = {}) {
  const source = data && typeof data === "object" ? data : {};
  const width = clampNumber(source.width, 10, 4, 20);
  const height = clampNumber(source.height, 12, 4, 20);
  const size = width * height;
  const layers = emptyLayers(size);
  for (const layer of Object.keys(layers)) {
    const values = Array.isArray(source.layers?.[layer])
      ? source.layers[layer]
      : unpackLayer(packedCatalog[layer] || ASSETS[layer].map(({ id }) => id), source.packedLayers?.[layer], size);
    for (let i = 0; i < size; i += 1) layers[layer][i] = assetId(values[i]);
  }
  const excludedCells = Array.isArray(source.excludedCells)
    ? [...new Set(source.excludedCells.filter((index) => Number.isInteger(index) && index >= 0 && index < size))].sort((a, b) => a - b)
    : [];
  for (const index of excludedCells) for (const layer of Object.values(layers)) layer[index] = null;
  // Legacy editor JSON stores collection pieces in item; play mode moves them
  // into the falling-piece slots. Keep this format while grouping them as gimmicks.
  for (let cell = 0; cell < size; cell++) {
    for (const layer of ["block", "gimmick"]) {
      if (isDdungTreasure(layers[layer][cell]) && !layers.item[cell]) {
        layers.item[cell] = layers[layer][cell];
        layers[layer][cell] = null;
      }
    }
    if (isDdungTreasure(layers.item[cell])) layers.block[cell] = null;
  }
  const usableBlocks = Array.isArray(source.usableBlocks)
    ? source.usableBlocks.map(assetId).filter(Boolean)
    : layers.block.filter(Boolean);
  const externalSource = source.externalSource;
  const ddung = isDdungSource(externalSource) || (!externalSource && ddungProject);
  let migratedPanel = false;
  for (const [cell, id] of layers.item.entries()) {
    const panel = ddungPanelFromItem(id, ddung);
    if (!panel) continue;
    layers.item[cell] = null;
    layers.terrain[cell] = panel;
    migratedPanel = true;
  }
  const objectives = normalizeObjectives(source).map((objective) => {
    const panel = objective.layer === "item" ? ddungPanelFromItem(objective.targetId, ddung) : null;
    if (!panel) return objective;
    migratedPanel = true;
    return normalizeObjective({ ...objective, layer: "terrain", targetId: panel, action: OBJECTIVE_ACTIONS.terrain.action });
  });
  if (isDdungSource(externalSource)) {
    for (const [cell, id] of layers.gimmick.entries()) {
      const tile = ddungCellSource({ width, externalSource }, cell)?.tile;
      if (id === "switch" && tile && "YZ1234r".includes(tile) ||
          id === "arrow-up" && tile === "A" || id === "arrow-down" && tile === "Q") {
        layers.gimmick[cell] = ddungPanelId(tile);
      }
    }
  }
  if (isDdungSource(externalSource) && !externalSource.jellyGroupsParsed) {
    for (const [cell] of ddungJellyCells({ externalSource, width, height })) {
      if (!excludedCells.includes(cell)) layers.terrain[cell] = "ddung-jelly";
    }
  }
  const migrateDdungGoals = isDdungSource(externalSource) && !externalSource.goalRulesVersion;
  const migrateWaterReaction = isDdungSource(externalSource) && !externalSource.waterReactionNormalized;
  const savedWater = source.terrainRules?.["ddung-water"];
  const oldWaterRule = migrateWaterReaction && (!savedWater || (savedWater.reaction === "adjacent" && savedWater.durability === 1 && savedWater.blocksFlow === false));
  let goalChanged = migratedPanel || (oldWaterRule && layers.terrain.includes("ddung-water"));
  if (migrateDdungGoals) {
    for (const [index, objective] of objectives.entries()) {
      const type = ddungObjectiveType(objective);
      goalChanged ||= Boolean(ddungGoalLimitation({ externalSource }, objective));
      const savedObjective = source.objectives?.[index];
      if (savedObjective?.countMode != null || savedObjective?.count_mode != null) continue;
      if (!ddungUsesBoardCount(type) || (type === 14 && externalSource.waterGoalNormalized)) continue;
      const previousCount = resolvedObjectiveCount({ layers }, objective);
      objective.countMode = "auto-map";
      goalChanged ||= previousCount !== resolvedObjectiveCount({ layers }, objective);
    }
  }
  const primaryBlockObjective = objectives.find((objective) => objective.layer === "block") || objectives[0];
  const targetType = primaryBlockObjective?.layer === "block" ? primaryBlockObjective.targetId : null;
  const targetCount = primaryBlockObjective?.count ?? 0;
  const moveLimit = clampNumber(source.moveLimit, 20, 1, 999);
  const estimatedTargetCount = objectives.reduce((sum, objective) => sum + resolvedObjectiveCount({ layers }, objective), 0);
  const estimatedPar = Math.max(1, Math.ceil(estimatedTargetCount * 0.8 + usableBlocks.length * 0.7));
  const terrainIds = new Set([...Object.keys(DEFAULT_TERRAIN_RULES), ...Object.keys(source.terrainRules || {}).filter(assetId)]);
  const terrainRules = Object.fromEntries([...terrainIds].map((terrainId) => {
    const saved = source.terrainRules?.[terrainId];
    const oldJellyRule = terrainId === "ddung-jelly" && isDdungSource(externalSource) &&
      !externalSource.jellyGroupsParsed && saved?.reaction === "adjacent" && saved.durability === 1;
    const useDefault = (terrainId === "ddung-water" && oldWaterRule) || oldJellyRule;
    return [terrainId, normalizeTerrainRule(terrainId, useDefault ? undefined : saved ?? {})];
  }));
  const gimmickRules = normalizeGimmickRules(source.gimmickRules ?? {});
  const normalized = {
    ...source,
    gimmickRules,
    id: source.id || crypto.randomUUID(),
    name: String(source.name || `Cave ${String(index + 1).padStart(4, "0")}`),
    width, height, gravity: normalizeGravity(source.gravity), layers, excludedCells,
    scoreTarget: Number.isSafeInteger(source.scoreTarget) && source.scoreTarget > 0 ? source.scoreTarget : null,
    pointsPerBlock: Number.isInteger(source.pointsPerBlock) && source.pointsPerBlock >= 1 && source.pointsPerBlock <= 1000000
      ? source.pointsPerBlock : 100,
    levelSettings: normalizeLevelSettings(source),
    specialMatches: source.specialMatches ?? true,
    usableBlocks: [...new Set(usableBlocks)],
    blockWeights: normalizeBlockWeights(source.blockWeights),
    objectives, targetType, targetCount, moveLimit, moveLimitEnabled: source.moveLimitEnabled !== false,
    parMoves: clampNumber(source.parMoves, Math.min(moveLimit, estimatedPar), 1, 999),
    testClearMoves: goalChanged ? 0 : clampNumber(source.testClearMoves, 0, 0, 999),
    simulationRuns: [10, 30, 100].includes(Number(source.simulationRuns)) ? Number(source.simulationRuns) : 30,
    randomSeed: String(source.randomSeed || `CAVE-${String(index + 1).padStart(4, "0")}`),
    randomDensity: clampNumber(source.randomDensity, 100, 10, 100),
    flowRule: FLOW_RULES.includes(source.flowRule) ? source.flowRule : "royal",
    terrainRules,
    failureBonus: Boolean(source.failureBonus),
    note: String(source.note || ""),
  };
  if (migrateDdungGoals || migrateWaterReaction || (isDdungSource(externalSource) && !externalSource.jellyGroupsParsed)) normalized.externalSource = { ...externalSource, goalRulesVersion: 2, waterReactionNormalized: true, jellyGroupsParsed: true };
  delete normalized.packedLayers;
  delete normalized.storageFormat;
  return normalized;
}

function openProjectDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("windy-cave-map-tool", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("projects");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("저장소를 열 수 없습니다."));
  });
}

async function loadProject() {
  let local = null;
  try {
    local = JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (_) {}
  let stored = null;
  try {
    projectDatabase = await openProjectDatabase();
    projectDatabase.onversionchange = () => {
      projectDatabase.close();
      projectDatabase = null;
    };
    stored = await new Promise((resolve, reject) => {
      const request = projectDatabase.transaction("projects").objectStore("projects").get(STORAGE_KEY);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (_) {}
  const choices = [stored, local].filter((saved) => saved?.caves?.length)
    .sort((left, right) => (right.savedAt ?? 0) - (left.savedAt ?? 0));
  for (const saved of choices) {
    try {
      return normalizeProject({ ...saved, contentVersion: saved.version || saved.contentVersion });
    } catch (_) {}
  }
  return normalizeProject(defaultProject());
}

function persist(showMessage = false, message = "브라우저에 저장했습니다.") {
  const saved = { ...packProjectForStorage(project), savedAt: Date.now() };
  saveQueue = saveQueue.then(async () => {
    try {
      if (!projectDatabase) throw new Error("IndexedDB를 열 수 없습니다.");
      await new Promise((resolve, reject) => {
        const transaction = projectDatabase.transaction("projects", "readwrite");
        transaction.oncomplete = resolve;
        transaction.onabort = () => reject(transaction.error);
        transaction.objectStore("projects").put(saved, STORAGE_KEY);
      });
    } catch (_) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      } catch (_) {
        toast("브라우저에 저장하지 못했습니다. 현재 변경사항은 전체 레벨 JSON으로 내보낼 수 있습니다.");
        return false;
      }
    }
    if (showMessage) toast(message);
    return true;
  });
  return saveQueue;
}

function snapshot() {
  undoStack.push(JSON.stringify(project));
  if (undoStack.length > 80) undoStack.shift();
  redoStack = [];
  updateUndoButtons();
}

function restore(serialized) {
  project = JSON.parse(serialized);
  renderAll();
  persist();
}

function undo() {
  if (!undoStack.length) return;
  redoStack.push(JSON.stringify(project));
  restore(undoStack.pop());
  updateUndoButtons();
}

function redo() {
  if (!redoStack.length) return;
  undoStack.push(JSON.stringify(project));
  restore(redoStack.pop());
  updateUndoButtons();
}

function updateUndoButtons() {
  $("undoButton").disabled = !undoStack.length;
  $("redoButton").disabled = !redoStack.length;
}

function getDefaultTerrainRule(id) {
  return Object.hasOwn(DEFAULT_TERRAIN_RULES, id)
    ? DEFAULT_TERRAIN_RULES[id]
    : { blocksFlow: false, reaction: "none", durability: 1 };
}

const DDUNG_GIMMICK_ART = Object.freeze({
  "ddung-mayor-small": "ddung-mayor-small", "ddung-mayor-large": "ddung-mayor-large",
  "ddung-bulldozer": "ddung-bulldozer", "ddung-spider-cave": "ddung-spider-cave",
  "ddung-bee": "ddung-bee", "ddung-bee-up": "ddung-bee-up",
  "ddung-feng": "ddung-feng",
  "arrow-up": "arrow-up", "arrow-down": "arrow-down", switch: "switch", door: "door",
  "teleport-a": "warp", "teleport-b": "warp",
});

function getAsset(layer, id, cave = activeCave()) {
  if (!assetId(id)) return null;
  if (isDdungTreasure(id)) layer = "item";
  const baseId = layer === "gimmick" ? ddungGimmickBase(id) : id;
  const known = ASSETS[layer === "block" && isDdungTreasure(id) ? "item" : layer].find((asset) => asset.id === baseId) ??
    (layer === "gimmick" && id === "ddung-iron-box" ? { name: "DDUNG Iron Box", visual: "▣" } : null);
  const itemArt = (layer === "terrain" && DDUNG_SOLID_PANELS.has(id)) || DDUNG_ITEM_IDS.has(id) && (
    layer === "item" || (layer === "block" && isDdungTreasure(id))
  );
  const definitionLayer = itemArt && layer === "block" ? "item" : layer;
  const definition = project.assetDefinitions?.[definitionLayer]?.find((asset) => asset.id === baseId);
  // Built-in artwork is shared by imported and newly authored levels.
  // The level's source controls its rules, not whether its images are visible.
  const original = DDUNG_ART.has(id);
  const panel = layer === "gimmick" ? DDUNG_PANELS[baseId] : null;
  const gimmickArt = panel?.[3] || (layer === "gimmick" && Object.hasOwn(DDUNG_GIMMICK_ART, baseId)
    ? DDUNG_GIMMICK_ART[baseId] : null);
  const iceArt = id === "ddung-octo" ? "./art/ddung/ice-bag.webp" :
    id === "ddung-frost" ? "./art/ddung/frost-3.webp" : null;
  const exitArt = layer === "gimmick" && id === "exit" ? "./art/ddung/exit.webp" : null;
  const dustArt = layer === "block" && id === "ddung-dust-piece" ? "./art/ddung/goal-dust.webp" : null;
  const image = definition?.image || exitArt || iceArt || dustArt || (gimmickArt ? `./art/ddung/${gimmickArt}.webp` :
    itemArt ? `./art/ddung/item-${id === "ddung-bomb-panel" ? "bomb" : id}.webp` : original ? `./art/ddung/${id}.webp` : null);
  return { visual: { terrain: "▦", block: "◆", gimmick: "◈", item: "●" }[layer],
    ...known, id, name: definition?.name || known?.name || id, image, panelMark: panel && "AQZY1234r".includes(panel[0]) ? panel[2] : null };
}

function showObjectImage(element, source) {
  if (!source) return;
  // Older map exports can reference the built-in sprites by their PNG paths.
  source = source.replace(/^(\.\/art\/ddung\/[^/]+)\.png$/, "$1.webp");
  const image = document.createElement("img");
  image.alt = "";
  image.draggable = false;
  image.className = "object-image";
  // These Unity prefabs rotate their sprite child by +90° in world space.
  if (/^\.\/art\/ddung\/(?:red|blue|purple|yellow)\.webp$/.test(source)) {
    image.classList.add("object-image-rotate-left");
  }
  image.onload = () => element.classList.add("has-object-image");
  image.onerror = () => image.remove();
  image.src = source;
  if (image.complete && image.naturalWidth) element.classList.add("has-object-image");
  element.append(image);
  return image;
}

function blockColor(id) {
  if (Object.hasOwn(COLORS, id)) return COLORS[id];
  let hash = 0;
  for (const character of id) hash = (Math.imul(hash, 31) + character.codePointAt(0)) >>> 0;
  return `hsl(${hash % 360} 68% 55%)`;
}

function paletteIdsFor(layer, cave = activeCave()) {
  const ids = project.paletteAssets[layer] || [];
  if (layer === "gimmick") return [...new Set([...ids, ...DDUNG_ITEM_IDS])];
  return ids.filter((id) => !isDdungTreasure(id));
}

function paletteOptions(layer, extraId) {
  return [...new Set([...paletteIdsFor(layer), extraId].filter(Boolean))]
    .map((id) => getAsset(layer, id));
}

function objectiveLabel(objective) {
  const category = isDdungTreasure(objective.targetId) ? "gimmick" : objective.layer;
  const layer = LAYER_LABELS[category];
  const asset = getAsset(objective.layer, objective.targetId);
  return `${layer} · ${asset?.name || objective.targetId}`;
}

function syncLegacyTarget(cave) {
  const primary = cave.objectives.find((objective) => objective.layer === "block");
  cave.targetType = primary?.targetId ?? null;
  cave.targetCount = primary ? resolvedObjectiveCount(cave, primary) : 0;
}

function addObjective(layer = null, targetId = null) {
  const cave = activeCave();
  if (cave.objectives.length >= MAX_OBJECTIVES) return toast(`목표는 최대 ${MAX_OBJECTIVES}개까지 설정할 수 있습니다.`);
  layer ??= Object.keys(ASSETS).find((key) => paletteIdsFor(key, cave).length);
  if (!layer) return toast("먼저 팔레트에 오브젝트 종류를 추가하세요.");
  snapshot();
  cave.objectives.push(normalizeObjective({ layer, targetId: targetId ?? paletteIdsFor(layer, cave)[0], countMode: "auto-map", count: 1 }));
  syncLegacyTarget(cave); renderRules(); persist();
}

function removeObjective(index) {
  const cave = activeCave();
  snapshot(); cave.objectives.splice(index, 1); syncLegacyTarget(cave); renderRules(); persist();
}

function updateObjective(index, values) {
  const cave = activeCave();
  const current = cave.objectives[index];
  if (!current) return;
  snapshot();
  const next = normalizeObjective({ ...current, ...values }, current);
  if (next.layer !== current.layer || next.targetId !== current.targetId) next.id = crypto.randomUUID();
  cave.objectives[index] = next;
  syncLegacyTarget(cave); renderRules(); persist();
}

function renderObjectives() {
  const cave = activeCave();
  const list = $("objectiveList");
  list.innerHTML = "";
  cave.objectives.forEach((objective, index) => {
    const category = isDdungTreasure(objective.targetId) ? "gimmick" : objective.layer;
    const row = document.createElement("div");
    row.className = "objective-row";
    const targetOptions = paletteOptions(category, objective.targetId)
      .map((asset) => `<option value="${escapeHtml(asset.id)}"${asset.id === objective.targetId ? " selected" : ""}>${escapeHtml(asset.name)}</option>`).join("");
    const autoCount = resolvedObjectiveCount(cave, objective);
    row.innerHTML = `
      <div class="objective-row-top">
        <label><span class="field-label">분류</span><select class="field objective-layer">${Object.keys(ASSETS).filter((layer) => layer === category || paletteIdsFor(layer, cave).length).map((layer) => `<option value="${layer}"${layer === category ? " selected" : ""}>${LAYER_LABELS[layer]}</option>`).join("")}</select></label>
        <label><span class="field-label">대상</span><select class="field objective-target">${targetOptions}</select></label>
        <button class="button objective-remove" title="목표 삭제" aria-label="목표 삭제">×</button>
      </div>
      <div class="objective-row-bottom">
        <label><span class="field-label">완료 조건</span><div class="objective-auto-count">${escapeHtml(isDdungTreasure(objective.targetId) ? "출구까지 낙하시켜 수집" : objective.targetId === "ddung-octo" ? "얼음 파괴 후 가방 수집" : objective.targetId === "ddung-dust-piece" ? "특수 피스로 먼지 제거" : ddungObjectiveType(objective) === 7 ? "내구도 소진 후 파괴" : OBJECTIVE_ACTIONS[objective.layer].label)}</div></label>
        <label><span class="field-label">수량 방식</span><select class="field objective-count-mode"><option value="manual"${objective.countMode === "manual" ? " selected" : ""}>직접 입력</option><option value="auto-map"${objective.countMode === "auto-map" ? " selected" : ""}>맵 개수 자동</option></select></label>
      </div>
      <div class="objective-row-bottom objective-count-row">
        <label><span class="field-label">목표 수량</span>${objective.countMode === "auto-map" ? `<div class="objective-auto-count">현재 ${autoCount}개</div>` : `<input class="field objective-count" type="number" min="1" max="999" value="${objective.count}" />`}</label>
        <div class="objective-auto-count">${escapeHtml(objectiveLabel(objective))}</div>
      </div>`;
    row.querySelector(".objective-layer").addEventListener("change", (event) => {
      const layer = event.target.value;
      updateObjective(index, { layer, targetId: paletteIdsFor(layer, cave)[0], action: OBJECTIVE_ACTIONS[layer].action });
    });
    row.querySelector(".objective-target").addEventListener("change", (event) => updateObjective(index, { targetId: event.target.value }));
    row.querySelector(".objective-count-mode").addEventListener("change", (event) => updateObjective(index, { countMode: event.target.value }));
    row.querySelector(".objective-count")?.addEventListener("change", (event) => updateObjective(index, { count: clampNumber(event.target.value, 1, 1, 999) }));
    row.querySelector(".objective-remove").addEventListener("click", () => removeObjective(index));
    const image = editorGoalArt(objective);
    if (image) {
      const icon = document.createElement("img");
      icon.alt = "";
      icon.className = "editor-goal-art";
      icon.src = image;
      row.querySelector(".objective-count-row > .objective-auto-count").prepend(icon);
    }
    list.appendChild(row);
  });
  $("addObjectiveButton").disabled = cave.objectives.length >= MAX_OBJECTIVES;
}

function renderAll() {
  bindProjectObjectRules(project);
  renderAppliedEditorTheme();
  renderCaveList();
  renderRules();
  renderPalette();
  renderGrid();
  updateUndoButtons();
  $("versionInput").value = project.version;
  $("clientVersionBadge").textContent = `CLIENT ${CLIENT_VERSION}`;
  $("schemaVersionBadge").textContent = `SCHEMA ${SCHEMA_VERSION}`;
  renderLevelSettings(activeCave());
  $("levelSettingsStatus").textContent = "";
}

function renderCaveList() {
  const list = $("caveList");
  list.innerHTML = "";
  const activeIndex = Math.max(0, project.caves.findIndex((cave) => cave.id === project.activeCaveId));
  const query = caveSearchQuery.trim().toLocaleLowerCase();
  const indexedCaves = project.caves.map((cave, index) => ({ cave, index }));
  let visibleCaves;
  let summary;
  if (query) {
    visibleCaves = indexedCaves.filter(({ cave }) => {
      const number = String(cave.number);
      return cave.name.toLocaleLowerCase().includes(query) || number === query || number.padStart(4, "0").includes(query);
    }).slice(0, 250);
    summary = `${visibleCaves.length}${visibleCaves.length === 250 ? "+" : ""}개 검색 결과 · 전체 ${project.caves.length}개`;
  } else {
    const windowSize = 200;
    const start = Math.max(0, Math.min(activeIndex - Math.floor(windowSize / 2), project.caves.length - windowSize));
    visibleCaves = indexedCaves.slice(start, start + windowSize);
    const end = start + visibleCaves.length;
    summary = project.caves.length > windowSize
      ? `${start + 1}–${end} / ${project.caves.length} · 검색으로 바로 이동`
      : `전체 ${project.caves.length}개`;
  }
  $("caveListSummary").textContent = summary;
  if (!visibleCaves.length) {
    list.innerHTML = `<div class="cave-empty">일치하는 레벨이 없습니다.</div>`;
    return;
  }
  visibleCaves.forEach(({ cave }) => {
    const button = document.createElement("button");
    button.className = `cave-item${cave.id === project.activeCaveId ? " active" : ""}`;
    button.innerHTML = `<span class="cave-number">${String(cave.number).padStart(4, "0")}</span><strong>${escapeHtml(cave.name)}</strong>`;
    button.addEventListener("click", () => {
      project.activeCaveId = cave.id;
      undoStack = []; redoStack = [];
      renderAll(); persist();
      revealSelectedCave();
    });
    list.appendChild(button);
  });
}

function renderRules() {
  const cave = activeCave();
  $("caveName").value = cave.name;
  const events = ddungTurnEvents(cave);
  $("ddungTurnEvents").hidden = !events.mouse && !events.spider;
  $("caveEventBadges").hidden = !events.mouse && !events.spider;
  $("caveMouseBadge").hidden = !events.mouse;
  $("caveSpiderBadge").hidden = !events.spider;
  $("ddungTurnEvents").textContent = [
    events.mouse ? "쥐 · 사용한 이동이 4의 배수일 때 한 행의 블록 교환" : "",
    events.spider ? "거미 · 2번째 이동부터 4번마다 블록 1개 제거" : "",
  ].filter(Boolean).join(" / ");
  $("mapWidth").value = cave.width;
  $("mapHeight").value = cave.height;
  renderClearMode(cave);
  renderObjectives();
  $("moveLimit").value = cave.moveLimit;
  $("moveLimitEnabled").checked = cave.moveLimitEnabled;
  $("moveLimit").disabled = !cave.moveLimitEnabled;
  $("parMoves").value = cave.parMoves;
  $("testClearMoves").value = cave.testClearMoves || "";
  $("simulationRuns").value = String(cave.simulationRuns);
  $("randomSeed").value = cave.randomSeed;
  $("randomDensity").value = cave.randomDensity;
  $("flowRule").value = cave.flowRule;
  $("failureBonus").checked = cave.failureBonus;
  $("specialMatches").checked = cave.specialMatches;
  $("noteInput").value = cave.note || "";
  document.querySelectorAll("[data-gravity]").forEach((button) => button.classList.toggle("active", button.dataset.gravity === cave.gravity));
  $("currentCaveTitle").textContent = cave.name;
  $("mapSizeBadge").textContent = `${cave.width} × ${cave.height}`;
  const arrows = { up: "↑", down: "↓", left: "←", right: "→" };
  $("gravityBadge").textContent = `GRAVITY ${arrows[cave.gravity]}`;
  renderDifficultySummary(cave);
  renderTerrainRuleEditor();
}

function renderTerrainRuleEditor() {
  const terrainSelect = $("terrainRuleType");
  const terrainIds = project.paletteAssets.terrain || [];
  $("terrainRuleSection").hidden = terrainIds.length === 0;
  if (!terrainIds.length) return;
  terrainSelect.innerHTML = paletteOptions("terrain").map((asset) => `<option value="${escapeHtml(asset.id)}">${escapeHtml(asset.name)}</option>`).join("");
  if (!terrainIds.includes(selectedTerrainRule)) selectedTerrainRule = terrainIds[0];
  const rule = project.terrainRules[selectedTerrainRule] || getDefaultTerrainRule(selectedTerrainRule);
  terrainSelect.value = selectedTerrainRule;
  $("terrainReaction").value = rule.reaction;
  $("terrainDurability").value = rule.durability;
  $("terrainBlocksFlow").checked = rule.blocksFlow;
  $("terrainBlocksSwap").checked = Boolean(rule.blocksSwap);
  $("terrainLocksBlock").checked = Boolean(rule.locksBlock);
  $("terrainDurability").disabled = rule.reaction === "none";
  const terrainName = getAsset("terrain", selectedTerrainRule)?.name || selectedTerrainRule;
  const reactionLabel = rule.reaction === "none"
    ? "3-Match로 제거할 수 없습니다."
    : `${rule.durability}번 반응하면 사라집니다.`;
  $("terrainRuleSummary").innerHTML = `<strong>${escapeHtml(terrainName)}</strong><span>${rule.blocksFlow || rule.locksBlock ? "블록의 교환, 매치, 낙하를 막습니다." : rule.blocksSwap ? "직접 교환은 막고 매치와 낙하는 허용합니다." : "이 지형 위의 블록은 교환하고 매치할 수 있습니다."} ${reactionLabel}</span>`;
}

function renderDifficultySummary(cave) {
  const analysis = analyzeDifficulty(cave);
  const node = $("difficultySummary");
  node.className = `difficulty-summary difficulty-${analysis.key}`;
  node.innerHTML = `
    <div><span>휴리스틱 난이도</span><strong>${analysis.label}</strong></div>
    <small>점수 ${analysis.score} · 목표 작업량 ${analysis.objectiveWork} · ${moveBudgetSummary(analysis)} · 블록 ${analysis.totalBlocks}</small>
    <small>면적 + 사용 색상 + 기믹/아이템 + 목표 비율 + 클리어 기록 대비 Moves로 계산</small>
  `;
}

function renderPalette() {
  document.querySelectorAll("[data-layer]").forEach((button) => button.classList.toggle("active", button.dataset.layer === activeLayer));
  const assetGrid = $("assetGrid");
  assetGrid.innerHTML = "";
  const eraseButton = document.createElement("button");
  eraseButton.className = `asset-card erase-card${activeTool === "eraser" ? " active" : ""}`;
  eraseButton.innerHTML = `<span class="asset-visual erase-visual">×</span><span>지우기</span>`;
  eraseButton.title = `현재 ${activeLayer} 레이어만 지웁니다.`;
  eraseButton.addEventListener("click", () => {
    if (activeTool === "eraser") {
      activeTool = "brush";
      selectedAssets[activeLayer] = null;
    } else {
      activeTool = "eraser";
    }
    syncToolButtons(); renderPalette();
  });
  assetGrid.appendChild(eraseButton);
  const layer = activeLayer;
  const ddungPicker = $("addDdungGimmick");
  ddungPicker.hidden = layer !== "gimmick";
  if (layer === "gimmick") {
    ddungPicker.replaceChildren(new Option("DDUNG 원작 기믹 추가", ""));
    for (const { id } of ASSETS.gimmick) {
      if (id.startsWith("ddung-") && id !== "ddung-feng") ddungPicker.add(new Option(getAsset("gimmick", id).name, id));
    }
    ddungPicker.add(new Option("DDUNG Iron Box", "ddung-iron-box"));
  }
  const paletteIds = paletteIdsFor(layer);
  const originalItems = layer === "item" && usesDdungGeneration(activeCave());
  $("showAssetDefinition").hidden = originalItems;
  if (!paletteIds.includes(selectedAssets[layer])) selectedAssets[layer] = null;

  $("assetDefinitionForm").hidden = true;

  paletteOptions(layer).forEach((asset) => {
    const button = document.createElement("button");
    button.className = `asset-card${activeTool !== "eraser" && selectedAssets[activeLayer] === asset.id ? " active" : ""}`;
    const style = activeLayer === "block" ? `background:${blockColor(asset.id)}` : "";
    button.innerHTML = `<span class="asset-visual ${asset.className || ""}" style="${style}">${escapeHtml(asset.visual)}</span><span>${escapeHtml(asset.name)}</span>`;
    const icon = button.querySelector(".asset-visual");
    if (asset.panelMark) icon.dataset.panelMark = asset.panelMark;
    showObjectImage(icon, asset.image);
    button.addEventListener("click", () => {
      const isSameSelection = activeTool !== "eraser" && selectedAssets[activeLayer] === asset.id;
      selectedAssets[activeLayer] = isSameSelection ? null : asset.id;
      if (activeLayer === "terrain") {
        selectedTerrainRule = asset.id;
        renderTerrainRuleEditor();
      }
      activeTool = "brush";
      syncToolButtons(); renderPalette();
    });
    assetGrid.appendChild(button);
  });
  const current = getAsset(activeLayer, selectedAssets[activeLayer]);
  $("selectedAssetSummary").textContent = activeTool === "eraser"
    ? `${activeLayer.toUpperCase()} · 지우기 (이 레이어만)`
    : `${activeLayer.toUpperCase()} · ${current?.name || "선택 없음"}`;
  const hideAssetActions = !current || activeTool === "eraser";
  $("viewAssetUsage").hidden = $("openAssetReplace").hidden = hideAssetActions;
  $("deleteSelectedAsset").hidden = hideAssetActions || originalItems || isDdungTreasure(current?.id) || (layer === "gimmick" && current?.id === SPAWNER_ID);
  renderSelectedObjectRules(hideAssetActions ? null : current);
  const colors = $("usableColors");
  colors.innerHTML = "";
  const blockIds = project.paletteAssets.block || [];
  $("usableColorsSection").hidden = blockIds.length === 0;
  blockIds.forEach((name) => {
    const color = blockColor(name);
    const button = document.createElement("button");
    button.className = `color-toggle${activeCave().usableBlocks.includes(name) ? " active" : ""}`;
    button.setAttribute("aria-pressed", String(activeCave().usableBlocks.includes(name)));
    button.title = getAsset("block", name).name;
    const swatch = document.createElement("span");
    swatch.className = "color-swatch";
    swatch.style.background = color;
    const label = document.createElement("span");
    label.textContent = getAsset("block", name).name;
    button.append(swatch, label);
    button.addEventListener("click", () => {
      snapshot();
      const usable = activeCave().usableBlocks;
      const enabling = !usable.includes(name);
      activeCave().usableBlocks = enabling ? [...usable, name] : usable.filter((value) => value !== name);
      renderPalette(); persist();
    });
    colors.appendChild(button);
  });
  renderBlockWeights();
}

function renderSelectedObjectRules(asset) {
  $("selectedObjectRules").hidden = !asset;
  $("resetObjectImage").hidden = !asset || !project.assetDefinitions?.[isDdungTreasure(asset.id) ? "item" : activeLayer]?.some(
    (definition) => definition.id === asset.id && definition.image);
  const cave = activeCave();
  const showRule = asset && activeLayer === "gimmick" && asset.id !== SPAWNER_ID &&
    !asset.id.startsWith("ddung-") && !isDdungSource(cave.externalSource);
  $("gimmickRulesForm").hidden = !showRule;
  if (!showRule) return;
  const rule = project.gimmickRules[asset.id];
  $("gimmickReaction").value = rule?.reaction ?? "either";
  $("gimmickDurability").value = rule?.durability ?? 1;
  $("gimmickBlocksFlow").checked = rule?.blocksFlow ?? false;
  const next = $("gimmickNext");
  next.replaceChildren(new Option("제거", ""), ...paletteOptions("gimmick")
    .filter(({ id }) => id !== asset.id && id !== SPAWNER_ID && !isDdungTreasure(id))
    .map(({ name, id }) => new Option(name, id)));
  next.value = rule?.nextId ?? "";
}

function saveObjectImage(layer, id, image) {
  if (isDdungTreasure(id)) layer = "item";
  const definitions = project.assetDefinitions?.[layer] ?? [];
  const current = definitions.find((asset) => asset.id === id);
  const next = definitions.filter((asset) => asset.id !== id);
  if (image || current) next.push({ id, name: current?.name ?? getAsset(layer, id).name, ...(image ? { image } : {}) });
  const updated = { ...project, assetDefinitions: { ...project.assetDefinitions, [layer]: next } };
  snapshot();
  project = updated;
  renderAll();
  persist(true, image ? "오브젝트 이미지를 저장했습니다." : "기본 이미지로 복원했습니다.");
}

async function chooseObjectImage(event) {
  const file = event.currentTarget.files[0];
  event.currentTarget.value = "";
  const layer = activeLayer;
  const id = selectedAssets[layer];
  const currentProject = project;
  if (!file || !id) return;
  try {
    const data = await readArtworkImage(file);
    if (project === currentProject && paletteIdsFor(layer).includes(id)) saveObjectImage(layer, id, data);
  } catch (error) {
    toast(error.message);
  }
}

async function readArtworkImage(file, maxSide = 112, maxLength = 100000) {
  if (!/\.(?:png|jpe?g|webp)$/i.test(file.name) && !/^image\/(?:png|jpeg|webp)$/.test(file.type)) {
    throw new Error("PNG, JPG, WebP 이미지 파일을 선택하세요.");
  }
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = normalizeObjectImage(canvas.toDataURL("image/webp", 0.9), maxLength);
    if (!data) throw new Error("Image encoding failed");
    return data;
  } catch {
    throw new Error("이미지를 처리할 수 없습니다. 다른 이미지 파일을 선택하세요.");
  } finally {
    URL.revokeObjectURL(url);
  }
}

const THEME_SPECIALS = { row: "가로 줄 폭탄", column: "세로 줄 폭탄", area: "폭탄", fish: "벌", color: "오색" };
const THEME_OBJECT_LAYERS = { block: "일반 블록", terrain: "지형", gimmick: "기믹", item: "아이템" };

let pendingThemeImages = 0;
const THEME_PACK_FORMAT = "windy-cave-theme-pack";

function collectionGimmickTheme(theme) {
  if (!theme || typeof theme !== "object" || Array.isArray(theme)) return theme;
  const item = { ...theme.item };
  const gimmick = { ...theme.gimmick };
  for (const id of DDUNG_ITEM_IDS) {
    if (item[id] && !gimmick[id]) gimmick[id] = item[id];
    delete item[id];
  }
  return { ...theme, item, gimmick };
}

function readThemePack(pack) {
  if (pack?.format !== THEME_PACK_FORMAT || pack.version !== 1) {
    throw new Error("맵툴에서 저장한 테마 팩 JSON을 선택하세요.");
  }
  const imageData = (value, maxLength = 100000) => {
    const image = normalizeObjectImage(value, maxLength);
    if (!image) throw new Error("테마 팩에 읽을 수 없는 이미지가 있어요.");
    return image;
  };
  const theme = {};
  for (const category of [...Object.keys(THEME_OBJECT_LAYERS), "specials", "goals"]) {
    const entries = pack[category];
    if (entries === undefined) continue;
    if (!entries || typeof entries !== "object" || Array.isArray(entries)) {
      throw new Error("테마 팩의 이미지 목록 형식이 올바르지 않아요.");
    }
    theme[category] = Object.fromEntries(Object.entries(entries).map(([id, value]) => {
      if (!assetId(id) || Object.hasOwn(Object.prototype, id)) throw new Error("테마 팩에 잘못된 이미지 ID가 있어요.");
      return [id, imageData(value)];
    }));
  }
  if (pack.background !== undefined) theme.background = imageData(pack.background, 1500000);
  return collectionGimmickTheme(theme);
}

function objectThemeImages(layer) {
  return Object.fromEntries(Object.entries(project.assetDefinitions ?? {}).flatMap(([sourceLayer, assets]) =>
    assets.filter(({ id, image }) => image && (isDdungTreasure(id) ? "gimmick" : sourceLayer) === layer)
      .map(({ id, image }) => [id, image])));
}

function saveThemePack() {
  try {
    const draft = project.editorTheme;
    const layers = Object.fromEntries(Object.keys(THEME_OBJECT_LAYERS).map((layer) =>
      [layer, { ...objectThemeImages(layer), ...draft?.[layer] }]));
    const theme = readThemePack({ ...draft, ...layers, format: THEME_PACK_FORMAT, version: 1 });
    downloadJson({ format: THEME_PACK_FORMAT, version: 1, ...theme }, "windy-theme-pack.json");
    $("themePackStatus").textContent = "테마 팩을 저장했어요.";
  } catch (error) {
    $("themePackStatus").textContent = error.message;
  }
}

async function loadThemePack(event) {
  const input = event.currentTarget;
  const file = input.files[0];
  input.value = "";
  if (!file) return;
  const currentProject = project;
  try {
    const theme = readThemePack(JSON.parse(await file.text()));
    if (project !== currentProject) return;
    snapshot();
    project.editorTheme = theme;
    renderThemeEditor();
    persist();
    $("themePackStatus").textContent = "테마 팩을 불러왔어요. 맵툴에 적용 버튼을 누르면 편집 보드에도 표시돼요.";
  } catch (error) {
    $("themePackStatus").textContent = error instanceof SyntaxError ? "JSON 파일을 읽을 수 없어요." : error.message;
  }
}

function editorGoalArt(objective) {
  return puzzleArtwork?.goals?.[objective.targetId] || puzzleArtwork?.layers[objective.layer]?.[objective.targetId] ||
    (isDdungTreasure(objective.targetId) && puzzleArtwork?.layers.gimmick?.[objective.targetId]);
}

function renderAppliedEditorTheme() {
  let theme;
  if (project.appliedEditorTheme) {
    try {
      theme = readThemePack({ ...project.appliedEditorTheme, format: THEME_PACK_FORMAT, version: 1 });
    } catch {
      // Invalid artwork in an imported project falls back to the default theme.
    }
  }
  puzzleArtwork = theme ? {
    layers: Object.fromEntries(Object.keys(THEME_OBJECT_LAYERS).map((layer) => [layer, theme[layer]])),
    specials: theme.specials,
    goals: theme.goals,
  } : null;
  const background = theme?.background
    ? `linear-gradient(rgb(12 15 30 / 55%), rgb(12 15 30 / 78%)), url(${JSON.stringify(theme.background)})`
    : "";
  $("editorWorkspace").style.backgroundImage = background;
  $("simulationDialog").style.backgroundImage = background;
  $("clearEditorTheme").disabled = !theme;
}

function applyEditorTheme(enabled) {
  try {
    const theme = enabled ? readThemePack({ ...project.editorTheme, format: THEME_PACK_FORMAT, version: 1 }) : null;
    snapshot();
    project.appliedEditorTheme = theme;
    renderAll();
    persist();
    $("themeEditorDialog").close();
    toast(enabled ? "편집 보드와 Playtest에 테마를 적용했어요." : "맵툴을 기본 이미지로 복원했어요.");
  } catch (error) {
    $("themePackStatus").textContent = error.message;
  }
}

function renderThemeEditor() {
  const cave = activeCave();
  const objectImages = Object.fromEntries(Object.keys(THEME_OBJECT_LAYERS).map((layer) => [layer, objectThemeImages(layer)]));
  const objectGroups = Object.entries(THEME_OBJECT_LAYERS).flatMap(([layer, title]) => {
    const inherited = objectImages[layer];
    const ids = new Set([
      ...Object.keys(inherited),
      ...Object.keys(project.editorTheme?.[layer] ?? {}),
      ...Object.keys(project.appliedEditorTheme?.[layer] ?? {}),
    ]);
    if (layer === "block") {
      for (const id of [...Object.keys(COLORS), ...paletteIdsFor(layer, cave)]) ids.add(id);
    }
    if (layer === "gimmick") for (const id of DDUNG_ITEM_IDS) ids.add(id);
    const entries = [...ids].filter((id) => layer !== "item" || !isDdungTreasure(id))
      .map((id) => [id, getAsset(layer, id, cave)?.name ?? id, inherited[id]]);
    return entries.length ? [[layer, title, entries]] : [];
  });
  const goals = [...new Map(cave.objectives.map(({ layer, targetId }) =>
    [targetId, [targetId, getAsset(layer, targetId, cave)?.name ?? targetId,
      objectImages[layer]?.[targetId]]])).values()];
  const groups = [
    ...objectGroups,
    ["specials", "특수 피스", Object.entries(THEME_SPECIALS)],
    ["goals", "현재 레벨의 목표 아이콘", goals],
    ["background", "배경", [["background", "게임 배경"]]],
  ];
  $("themeImageSlots").replaceChildren(...groups.map(([category, title, entries]) => {
    const group = document.createElement("section");
    const heading = document.createElement("h3");
    heading.textContent = title;
    const grid = document.createElement("div");
    grid.className = "theme-slot-grid";
    if (entries.length) grid.append(...entries.map(([id, name, image]) => buildThemeSlot(category, id, name, image)));
    else grid.textContent = "이 레벨에 설정된 목표가 없습니다.";
    group.append(heading, grid);
    return group;
  }));
}

function buildThemeSlot(category, id, name, inheritedImage) {
  const card = document.createElement("div");
  card.className = "theme-slot";
  const title = document.createElement("strong");
  title.textContent = name;
  const thumbnail = document.createElement("img");
  thumbnail.alt = "";
  const status = document.createElement("span");
  status.setAttribute("role", "status");
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp";
  input.hidden = true;
  const upload = document.createElement("button");
  upload.type = "button";
  upload.className = "button compact";
  upload.textContent = "이미지 교체";
  upload.setAttribute("aria-label", name + " 이미지 교체");
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "button compact ghost";
  const resetToObject = category === "goals" && inheritedImage;
  reset.textContent = resetToObject ? "오브젝트 이미지로" : "기본값";
  reset.setAttribute("aria-label", name + (resetToObject ? " 오브젝트 이미지로 복원" : " 기본값으로 복원"));
  const actions = document.createElement("div");
  actions.className = "theme-slot-actions";
  actions.append(upload, reset);
  card.append(title, thumbnail, status, input, actions);

  function refresh() {
    const override = themeSlotImage(project.editorTheme, category, id);
    const applied = themeSlotImage(project.appliedEditorTheme, category, id);
    const image = override || inheritedImage || applied;
    if (image) thumbnail.src = image;
    else thumbnail.removeAttribute("src");
    thumbnail.hidden = !image;
    reset.disabled = !override && !applied && !(inheritedImage && Object.hasOwn(THEME_OBJECT_LAYERS, category));
    status.textContent = override ? "교체됨" : inheritedImage ? "오브젝트 편집에서 지정" : applied ? "맵툴에 적용됨" : "기본 이미지";
  }

  upload.addEventListener("click", () => input.click());
  reset.addEventListener("click", () => resetThemeImage(category, id));
  input.addEventListener("change", async () => {
    const file = input.files[0];
    input.value = "";
    if (!file) return;
    const currentProject = project;
    const preview = $("previewThemeButton");
    pendingThemeImages += 1;
    preview.disabled = $("applyEditorTheme").disabled = $("saveThemePack").disabled = $("openThemePack").disabled = true;
    upload.disabled = reset.disabled = true;
    status.textContent = "이미지를 준비하는 중이에요.";
    try {
      const image = category === "background" ? await readArtworkImage(file, 960, 1500000) : await readArtworkImage(file, 192);
      if (project === currentProject) setThemeImage(category, id, image);
      refresh();
    } catch (error) {
      refresh();
      status.textContent = error.message;
    } finally {
      upload.disabled = false;
      pendingThemeImages -= 1;
      preview.disabled = $("applyEditorTheme").disabled = $("saveThemePack").disabled = $("openThemePack").disabled = pendingThemeImages > 0;
    }
  });
  refresh();
  return card;
}

function setThemeImage(category, id, image) {
  snapshot();
  const theme = project.editorTheme ??= {};
  if (category === "background") theme.background = image;
  else (theme[category] ??= {})[id] = image;
  persist();
}

function themeSlotImage(theme, category, id) {
  return category === "background" ? theme?.background : theme?.[category]?.[id];
}

function resetThemeImage(category, id) {
  snapshot();
  for (const theme of [project.editorTheme, project.appliedEditorTheme]) {
    if (category === "background") delete theme?.background;
    else delete theme?.[category]?.[id];
  }
  if (Object.hasOwn(THEME_OBJECT_LAYERS, category)) {
    const definition = project.assetDefinitions?.[category]?.find((asset) => asset.id === id);
    delete definition?.image;
  }
  renderAll();
  renderThemeEditor();
  persist();
}

function saveSelectedGimmickRule(event) {
  event.preventDefault();
  const cave = activeCave();
  const id = selectedAssets.gimmick;
  if (!id || activeLayer !== "gimmick" || id === SPAWNER_ID || isDdungSource(cave.externalSource)) return;
  const nextId = $("gimmickNext").value || null;
  const seen = new Set([id]);
  for (let step = nextId; step; step = project.gimmickRules[step]?.nextId) {
    if (seen.has(step)) return toast("다음 상태가 다시 같은 오브젝트로 돌아옵니다.");
    seen.add(step);
  }
  snapshot();
  project.gimmickRules[id] = {
    reaction: $("gimmickReaction").value,
    durability: clampNumber($("gimmickDurability").value, 1, 1, 99),
    blocksFlow: $("gimmickBlocksFlow").checked,
    nextId,
  };
  persist();
  toast("모든 레벨에 적용할 오브젝트 동작을 저장했습니다.");
}

function findAssetUsage(caves, layer, id) {
  if (isDdungTreasure(id)) layer = "item";
  return caves.flatMap((cave) => {
    const reasons = [];
    const placed = cave.layers[layer].filter((value) => (layer === "gimmick" ? ddungGimmickBase(value) : value) === id).length;
    if (placed) reasons.push(`${placed}칸 배치`);
    if (cave.objectives.some((goal) => goal.layer === layer && matchesObjectiveAsset(goal, id))) reasons.push("클리어 목표");
    if (layer === "block" && cave.usableBlocks.includes(id)) reasons.push("사용 색상");
    return reasons.length ? [{ cave, reasons }] : [];
  }).sort((a, b) => a.cave.number - b.cave.number);
}

function showAssetUsage(layer, id, name, usage, message) {
  if (isDdungTreasure(id)) layer = "item";
  const dialog = $("assetUsageDialog");
  $("assetUsageMessage").textContent = message;
  const list = $("assetUsageList");
  list.replaceChildren();
  for (const { cave, reasons } of usage) {
    const item = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button ghost";
    button.textContent = `Cave ${cave.number} · ${cave.name} · ${reasons.join(", ")}`;
    button.addEventListener("click", () => {
      dialog.close();
      $("caveJump").value = String(cave.number);
      assetLocator = { caveId: cave.id, layer, id, name };
      jumpToCave();
      selectEditorTab("board");
      stepLocatedAsset(0);
    });
    item.appendChild(button);
    list.appendChild(item);
  }
  dialog.showModal();
}

function viewSelectedAssetUsage() {
  const layer = activeLayer;
  const id = selectedAssets[layer];
  if (!paletteIdsFor(layer).includes(id)) return;
  const name = getAsset(layer, id).name;
  const usage = findAssetUsage(project.caves, layer, id);
  const message = usage.length ? `‘${name}’ 사용처 · ${usage.length}개 Cave` : `‘${name}’을(를) 사용하는 Cave가 없습니다.`;
  showAssetUsage(layer, id, name, usage, message);
}

function deleteSelectedAsset() {
  const layer = activeLayer;
  const id = selectedAssets[layer];
  if (layer === "gimmick" && id === SPAWNER_ID) return;
  if (layer === "item" && usesDdungGeneration(activeCave())) return;
  if (!project.paletteAssets[layer]?.includes(id)) return;
  const name = getAsset(layer, id).name;
  const usage = findAssetUsage(project.caves, layer, id);
  if (usage.length) {
    showAssetUsage(layer, id, name, usage, `‘${name}’을(를) 사용하는 Cave가 있습니다. 배치나 설정에서 제거한 뒤 다시 시도하세요.`);
    return;
  }
  if (!window.confirm(`‘${name}’을(를) 팔레트에서 삭제할까요?`)) return;
  snapshot();
  project.paletteAssets[layer] = project.paletteAssets[layer].filter((value) => value !== id);
  project.assetDefinitions[layer] = (project.assetDefinitions[layer] || []).filter((asset) => asset.id !== id);
  selectedAssets[layer] = null;
  renderAll();
  persist();
}

function renderBlockWeights() {
  const cave = activeCave();
  const panel = $("blockWeightsPanel");
  const list = $("blockWeightsList");
  panel.hidden = !cave.usableBlocks.length;
  list.replaceChildren();
  const rows = [];
  const updatePercentages = () => {
    const total = cave.usableBlocks.reduce((sum, id) => sum + blockWeight(cave, id), 0);
    for (const { id, output } of rows) output.textContent = total ? `${(100 * blockWeight(cave, id) / total).toFixed(1)}%` : "0%";
  };
  for (const id of cave.usableBlocks) {
    const label = document.createElement("label");
    label.className = "block-weight-row";
    const name = document.createElement("span");
    name.textContent = getAsset("block", id).name;
    const input = document.createElement("input");
    input.className = "field";
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.step = "any";
    input.value = blockWeight(cave, id);
    const output = document.createElement("output");
    input.addEventListener("change", () => {
      const weight = clampNumber(input.value, blockWeight(cave, id), 0, 100);
      if (weight !== blockWeight(cave, id)) {
        snapshot();
        cave.blockWeights = { ...cave.blockWeights, [id]: weight };
        persist();
        updatePercentages();
      }
      input.value = weight;
    });
    label.append(name, input, output);
    list.appendChild(label);
    rows.push({ id, output });
  }
  updatePercentages();
}

function syncToolButtons() {
  document.querySelectorAll("[data-tool]").forEach((button) => button.classList.toggle("active", button.dataset.tool === activeTool));
}

let assetLocator = null;
let assetReplacement = null;

function openAssetReplacement() {
  const id = selectedAssets[activeLayer];
  const layer = isDdungTreasure(id) ? "item" : activeLayer;
  const cave = activeCave();
  if (!id || !paletteIdsFor(activeLayer, cave).includes(id)) return toast("교체할 오브젝트를 선택하세요.");
  if (layer === "gimmick" && ddungLargeGimmick(id)) return toast("2×2 기믹은 보드에서 지우거나 다시 배치하세요.");
  const alternatives = (isDdungTreasure(id) ? paletteOptions("gimmick").filter((asset) => isDdungTreasure(asset.id)) : paletteOptions(layer))
    .filter((asset) => asset.id !== id && (layer !== "gimmick" || !ddungLargeGimmick(asset.id)));
  if (!alternatives.length) return toast("같은 레이어에 교체할 오브젝트를 먼저 추가하세요.");
  const select = $("assetReplaceTarget");
  select.replaceChildren(...alternatives.map(({ name, id }) => new Option(name, id)));
  $("assetReplaceRange").value = "";
  $("assetReplaceCaves").replaceChildren();
  assetReplacement = { caveId: cave.id, layer, id };
  selectEditorTab("board");
  renderGrid();
  select.focus();
}

function updateAssetReplaceRange() {
  const change = assetReplacement;
  const range = $("assetReplaceRange").value.trim();
  const list = $("assetReplaceCaves");
  list.replaceChildren();
  list.hidden = !range;
  if (change && range) {
    const caves = cavesInRange(range) || [];
    for (const cave of caves) {
      const count = cave.layers[change.layer].filter((id) => id === change.id).length;
      if (!count) continue;
      const label = document.createElement("label");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = cave.id;
      checkbox.checked = true;
      const goalUsed = cave.objectives.some((goal) => goal.layer === change.layer && matchesObjectiveAsset(goal, change.id));
      label.append(checkbox, ` Cave ${cave.number} · ${cave.name} · ${count}칸${goalUsed ? " · 클리어 목표에 사용 중" : ""}`);
      list.appendChild(label);
    }
    if (!list.children.length) list.textContent = "유효한 범위에 교체할 칸이 없습니다.";
  }
  renderGrid();
}

function assetReplacementCaves(change, cave) {
  const range = $("assetReplaceRange").value.trim();
  if (!range) return [cave];
  const selected = new Set(Array.from($("assetReplaceCaves").querySelectorAll("input:checked"), (input) => input.value));
  return (cavesInRange(range) || []).filter(({ id }) => selected.has(id))
    .filter((candidate) => candidate.layers[change.layer].includes(change.id));
}

function applyAssetReplacement(event) {
  event.preventDefault();
  const cave = activeCave();
  const change = assetReplacement;
  const target = $("assetReplaceTarget").value;
  if (!change || change.caveId !== cave.id || target === change.id ||
      !paletteIdsFor(change.layer, cave).includes(target)) return;
  const caves = assetReplacementCaves(change, cave);
  if (!caves.some((candidate) => candidate.layers[change.layer].includes(change.id))) return;
  snapshot();
  for (const candidate of caves) {
    candidate.layers[change.layer] = candidate.layers[change.layer].map((id) => id === change.id ? target : id);
    candidate.testClearMoves = 0;
  }
  assetReplacement = null;
  renderAll();
  persist();
}

function locatedAssetCells(cave) {
  if (assetLocator?.caveId !== cave.id) return [];
  return cave.layers[assetLocator.layer].flatMap((id, index) =>
    (assetLocator.layer === "gimmick" ? ddungGimmickBase(id) : id) === assetLocator.id ? [index] : []);
}

function stepLocatedAsset(delta) {
  const cells = locatedAssetCells(activeCave());
  if (!cells.length) return;
  const current = cells.indexOf(assetLocator.index);
  const next = current < 0 ? (delta < 0 ? cells.length - 1 : 0) : (current + delta + cells.length) % cells.length;
  assetLocator.index = cells[next];
  renderGrid();
  $("mapGrid").querySelector(".asset-located-current")?.scrollIntoView({ block: "nearest", inline: "nearest" });
}

function renderGrid() {
  const cave = activeCave();
  const grid = $("mapGrid");
  if (assetReplacement && assetReplacement.caveId !== cave.id) assetReplacement = null;
  const replacement = assetReplacement;
  $("assetReplaceForm").hidden = !replacement;
  if (replacement) {
    const caves = assetReplacementCaves(replacement, cave);
    const count = caves.reduce((sum, candidate) => sum + candidate.layers[replacement.layer].filter((id) => id === replacement.id).length, 0);
    $("assetReplaceApply").textContent = `${count}칸 교체`;
    $("assetReplaceApply").disabled = count === 0;
    const goalUsed = cave.objectives.some((goal) => goal.layer === replacement.layer && matchesObjectiveAsset(goal, replacement.id));
    $("assetReplaceStatus").textContent = getAsset(replacement.layer, replacement.id).name +
      (goalUsed ? " · 기존 오브젝트가 클리어 목표에 포함돼 있습니다. 목표 설정을 확인하세요." : "");
  }
  const previewCurrentCave = replacement && assetReplacementCaves(replacement, cave).includes(cave);
  const located = locatedAssetCells(cave);
  const current = assetLocator?.caveId === cave.id ? assetLocator : null;
  if (current && !located.includes(current.index)) current.index = located[0];
  $("assetLocator").hidden = !current;
  if (current) {
    $("assetLocatorStatus").textContent = located.length
      ? `${current.name} · ${located.indexOf(current.index) + 1} / ${located.length}칸`
      : `${current.name} · 배치된 칸 없음`;
    $("assetLocatorPrev").disabled = located.length < 2;
    $("assetLocatorNext").disabled = located.length < 2;
  }
  const locatedSet = new Set(located);
  grid.style.setProperty("--board-columns", cave.width);
  grid.style.gridTemplateColumns = `repeat(${cave.width}, var(--cell-size))`;
  grid.innerHTML = "";
  for (let index = 0; index < cave.width * cave.height; index += 1) {
    const cell = document.createElement("div");
    cell.className = "map-cell";
    cell.dataset.index = index;
    cell.setAttribute("role", "button");
    cell.setAttribute("aria-label", [cellDescription(cave, index), cell.title].filter(Boolean).join(" · "));
    applyCellVisual(cell, cave, index);
    if (replacement && previewCurrentCave && cave.layers[replacement.layer][index] === replacement.id) cell.classList.add("asset-replace-preview");
    if (locatedSet.has(index)) {
      cell.classList.add("asset-located");
      if (current.index === index) cell.classList.add("asset-located-current");
    }
    let touchStart = null;
    cell.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") {
        if (event.isPrimary) touchStart = { id: event.pointerId, x: event.clientX, y: event.clientY };
        return;
      }
      if (event.button !== 0) return;
      if (activeTool === "inspect") { inspectCell(index); return; }
      event.preventDefault(); isPainting = true; strokeSnapshotTaken = false;
      editCell(index, activeTool === "fill");
    });
    cell.addEventListener("pointerup", (event) => {
      if (touchStart?.id !== event.pointerId) return;
      const distance = Math.max(Math.abs(event.clientX - touchStart.x), Math.abs(event.clientY - touchStart.y));
      touchStart = null;
      if (distance >= 10) return;
      if (activeTool === "inspect") inspectCell(index);
      else {
        strokeSnapshotTaken = false;
        editCell(index, activeTool === "fill");
      }
    });
    cell.addEventListener("pointercancel", () => { touchStart = null; });
    cell.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (event.pointerType !== "touch") inspectCell(index);
    });
    cell.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "touch") return;
      if ((event.buttons & 1) === 0) { isPainting = false; strokeSnapshotTaken = false; return; }
      if (isPainting && activeTool !== "fill" && activeTool !== "shape") editCell(index, false);
    });
    cell.addEventListener("mouseenter", () => {
      cell.title = describeCellProperties(cave, index);
      showCellStatus(index);
    });
    grid.appendChild(cell);
  }
}

const DDUNG_SPECIAL_ART_ROWS = Object.freeze({
  1: 0, horizontal: 0,
  2: 1, vertical: 1,
  3: 4, bomb: 4,
  5: 5, rainbow: 5,
  6: 2,
  8: 3, bee: 3,
});
const DDUNG_SPECIAL_ART_COLORS = ["red", "blue", "green", "purple", "orange", "yellow"];

function showDdungSpecialImage(element, piece, color, fallbackImage, badge) {
  if (!Object.hasOwn(DDUNG_SPECIAL_ART_ROWS, piece.type)) return false;
  const row = DDUNG_SPECIAL_ART_ROWS[piece.type];
  const column = row === 5 ? 0 : DDUNG_SPECIAL_ART_COLORS.indexOf(color);
  if (column < 0) return false;

  const frame = document.createElement("span");
  frame.className = "special-art-frame";
  const image = document.createElement("img");
  image.alt = "";
  image.draggable = false;
  image.style.left = `${-100 * column}%`;
  image.style.top = `${-100 * row}%`;
  image.onload = () => {
    element.classList.add("has-object-image");
    badge.hidden = true;
  };
  image.onerror = () => {
    frame.remove();
    showObjectImage(element, fallbackImage);
  };
  frame.append(image);
  element.append(frame);
  image.src = "./art/ddung/special-pieces.webp";
  if (image.complete && image.naturalWidth) {
    element.classList.add("has-object-image");
    badge.hidden = true;
  }
  return true;
}

function applyCellVisual(cell, cave, index, damage = null) {
  if (isExcluded(cave, index)) {
    cell.classList.add("excluded-cell");
    if (cell.tagName === "BUTTON") cell.disabled = true;
    return;
  }
  const solidGimmick = isDdungGimmickBarrier(cave, index) || ddungBoxDurability(cave, index);
  const frost = cave.layers.terrain[index] === "ddung-frost" && cave.terrainRules?.["ddung-frost"];
  const opaqueFrost = frost && terrainDurabilityAt(cave, index, frost) - (damage?.terrainHits[index] || 0) >= 3;
  for (const layer of ["terrain", "block", "gimmick", "item"]) {
    if (layer === "block" && (solidGimmick || opaqueFrost)) continue;
    const assetId = cave.layers[layer][index];
    if (!assetId) continue;
    const asset = getAsset(layer, assetId, cave);
    if (!asset) continue;
    const visual = document.createElement("span");
    visual.className = `cell-${layer} ${asset.className || ""}`;
    if (asset.panelMark) visual.dataset.panelMark = asset.panelMark;
    if (layer === "gimmick" && ddungGimmickGroup(cave, index).length === 4) {
      visual.dataset.gimmickPart = ddungGimmickGroup(cave, index).indexOf(index);
    }
    if (layer === "gimmick" && cave.layers.block[index] && !solidGimmick) {
      if (assetId === SPAWNER_ID) visual.classList.add("cell-spawner-badge");
      else if (asset.image?.endsWith(".webp") && asset.image.startsWith("./art/ddung/")) {
        visual.classList.add("cell-ddung-gimmick-badge");
      }
    }
    if (layer === "gimmick" && asset.image === "./art/ddung/warp.webp") {
      visual.dataset.warpEnd = assetId === "teleport-a" ? "A" : "B";
    }
    const artwork = puzzleArtwork?.layers[layer]?.[assetId] ||
      (isDdungTreasure(assetId) && puzzleArtwork?.layers.gimmick?.[assetId]);
    let usesSpecialImage = false;
    if (layer === "block") {
      visual.style.background = blockColor(assetId);
      if (assetId === "ddung-dust-piece") visual.textContent = asset.visual;
      const piece = cave.playtestPieces ? cave.playtestPieces[index] : initialPieceAt(cave, index);
      if (piece && !piece.unsealed && (!piece.color || piece.color === assetId)) {
        const badge = document.createElement("span");
        badge.className = "initial-piece-badge";
        badge.textContent = piece.symbol;
        badge.title = `특수 피스 · ${piece.name || piece.type}`;
        cell.classList.add("has-initial-piece");
        cell.appendChild(badge);
        const specials = puzzleArtwork?.specials;
        const specialArtwork = specials?.[piece.type] || specials?.[specialEffect(cave, piece)];
        if (specialArtwork) {
          showObjectImage(visual, specialArtwork);
          usesSpecialImage = true;
        } else {
          usesSpecialImage = showDdungSpecialImage(visual, piece, assetId, artwork || asset.image, badge);
        }
      }
    }
    if (layer === "gimmick" || layer === "item" || (layer === "terrain" && !asset.className)) visual.textContent = asset.visual;
    if (!usesSpecialImage) {
      const customImage = project.assetDefinitions?.[layer]?.find((definition) => definition.id === assetId)?.image;
      if (artwork) {
        showObjectImage(visual, artwork);
      } else if (layer === "gimmick" && assetId === "ddung-octo" && !customImage) {
        const hp = ddungGimmickDurability(cave, index) - (damage?.gimmickHits[index] || 0);
        if (hp <= 2) showObjectImage(visual, asset.image);
        if (hp > 0) showObjectImage(visual, `./art/ddung/frost-${hp}.webp`);
      } else if (layer === "terrain" && assetId === "ddung-frost" && !customImage) {
        const hp = terrainDurabilityAt(cave, index, frost || DEFAULT_TERRAIN_RULES[assetId]) - (damage?.terrainHits[index] || 0);
        showObjectImage(visual, `./art/ddung/frost-${Math.min(5, Math.max(1, hp))}.webp`);
      } else {
        showObjectImage(visual, asset.image);
      }
    }
    cell.appendChild(visual);
  }
  const markers = ddungMarkersAt(cave, index);
  const otherMarkers = markers.filter((id) => id !== "exit");
  if (markers.includes("exit")) {
    const exit = document.createElement("span");
    exit.className = "cell-gimmick cell-exit";
    exit.title = getAsset("gimmick", "exit", cave).name;
    exit.textContent = "⇥";
    showObjectImage(exit, puzzleArtwork?.layers.gimmick?.exit || getAsset("gimmick", "exit", cave).image);
    cell.appendChild(exit);
  }
  if (otherMarkers.length) {
    const badge = document.createElement("span");
    badge.className = "ddung-overlapping-markers";
    badge.textContent = otherMarkers.map((id) => ({ "teleport-a": "A", "teleport-b": "B" })[id] || getAsset("gimmick", id, cave)?.visual || "·").join(" ");
    badge.title = otherMarkers.map((id) => getAsset("gimmick", id, cave)?.name || id).join(" · ");
    cell.appendChild(badge);
  }
}

function editCell(index, fillMode) {
  const cave = activeCave();
  if (activeTool === "shape") {
    const excluded = isExcluded(cave, index);
    if (!excluded && (cave.excludedCells?.length || 0) >= cave.width * cave.height - 1) return toast("보드에는 최소 한 칸이 필요합니다.");
    snapshot();
    cave.excludedCells = excluded ? cave.excludedCells.filter((cell) => cell !== index) : [...(cave.excludedCells || []), index].sort((a, b) => a - b);
    if (!excluded) {
      for (const layer of Object.values(cave.layers)) layer[index] = null;
      clearInitialPiece(cave, index);
    }
    cave.testClearMoves = 0;
    renderAll(); persist(); showCellStatus(index);
    return;
  }
  if (isExcluded(cave, index)) return;
  if (activeTool !== "eraser" && !selectedAssets[activeLayer]) {
    isPainting = false; strokeSnapshotTaken = false;
    toast("팔레트에서 추가할 항목을 먼저 선택하세요.");
    return;
  }
  if (!strokeSnapshotTaken) { snapshot(); strokeSnapshotTaken = true; }
  const value = activeTool === "eraser" ? null : selectedAssets[activeLayer];
  if (fillMode && !(activeLayer === "gimmick" && ddungLargeGimmick(value))) floodFill(cave, activeLayer, index, value);
  else paintLayerCell(cave, activeLayer, index, value);
  renderGrid();
  if (cave.objectives.some((objective) => (objective.layer === activeLayer ||
      activeLayer === "gimmick" && isDdungTreasure(objective.targetId)) && objective.countMode === "auto-map")) renderObjectives();
  persist(); showCellStatus(index);
}

function clearInitialPiece(cave, index) {
  if (!initialPieceAt(cave, index)) return;
  cave.initialPieceTypes ??= {};
  // An explicit null also overrides a special type encoded in the imported DDUNG tile.
  cave.initialPieceTypes[index] = null;
}

function ddungLargeGimmick(id) {
  return ["ddung-mayor-large", "ddung-feng-large-row", "ddung-feng-large-column"].includes(id);
}

function paintLayerCell(cave, layer, index, value) {
  if (layer === "gimmick" && isDdungTreasure(value)) layer = "item";
  if (layer === "item" && isDdungTreasure(value)) {
    if (isBarrier(cave, index)) return;
    cave.layers.block[index] = null;
    clearInitialPiece(cave, index);
  }
  if (layer === "gimmick" && value === null && isDdungTreasure(cave.layers.item[index])) cave.layers.item[index] = null;
  if (layer === "block") {
    if (value && (isDdungGimmickBarrier(cave, index) || ddungBoxDurability(cave, index))) return;
    clearInitialPiece(cave, index);
  }
  if (layer === "gimmick") {
    const placedCells = ddungLargeGimmick(value) ? [index, index + 1, index + cave.width, index + cave.width + 1] : [index];
    if (placedCells.length > 1 && (index % cave.width === cave.width - 1 || placedCells.some((cell) =>
      isBarrier(cave, cell) || cave.layers.gimmick[cell]))) {
      toast("큰 기믹을 배치하려면 비어 있는 기믹 칸 2×2가 필요합니다.");
      return;
    }
    for (const cell of ddungGimmickGroup(cave, index)) cave.layers.gimmick[cell] = null;
    for (const [part, cell] of placedCells.entries()) {
      cave.layers.gimmick[cell] = placedCells.length > 1 ? `${value}:part${part}` : value;
      if (isDdungGimmickBarrier(cave, cell) || ddungBoxDurability(cave, cell)) {
        cave.layers.block[cell] = null;
        clearInitialPiece(cave, cell);
      }
    }
    return;
  }
  cave.layers[layer][index] = value;
}

function floodFill(cave, layer, start, replacement) {
  const cells = cave.layers[layer === "gimmick" && (isDdungTreasure(replacement) ||
    isDdungTreasure(cave.layers.item[start])) ? "item" : layer];
  const target = cells[start];
  if (target === replacement && layer !== "block") return;
  const queue = [start];
  const visited = new Set();
  while (queue.length) {
    const index = queue.shift();
    if (visited.has(index) || isExcluded(cave, index) || cells[index] !== target) continue;
    visited.add(index);
    paintLayerCell(cave, layer, index, replacement);
    const x = index % cave.width;
    const y = Math.floor(index / cave.width);
    if (x > 0) queue.push(index - 1);
    if (x < cave.width - 1) queue.push(index + 1);
    if (y > 0) queue.push(index - cave.width);
    if (y < cave.height - 1) queue.push(index + cave.width);
  }
}

function resizeMap() {
  const cave = activeCave();
  const width = Math.max(4, Math.min(20, Number($("mapWidth").value)));
  const height = Math.max(4, Math.min(20, Number($("mapHeight").value)));
  if (width === cave.width && height === cave.height) return;
  snapshot();
  resizeCaveBoard(cave, width, height);
  renderAll(); persist(); toast(`맵 크기를 ${width} × ${height}(으)로 변경했습니다.`);
}

function resizeCaveBoard(cave, width, height) {
  const next = emptyLayers(width * height);
  for (const layer of Object.keys(next)) {
    for (let y = 0; y < Math.min(height, cave.height); y += 1) {
      for (let x = 0; x < Math.min(width, cave.width); x += 1) next[layer][y * width + x] = cave.layers[layer][y * cave.width + x];
    }
  }
  cave.excludedCells = (cave.excludedCells || []).map((index) => [index % cave.width, Math.floor(index / cave.width)])
    .filter(([x, y]) => x < width && y < height).map(([x, y]) => y * width + x);
  if (cave.excludedCells.length === width * height) cave.excludedCells.pop();
  if (cave.initialPieceTypes) {
    cave.initialPieceTypes = Object.fromEntries(Object.entries(cave.initialPieceTypes).flatMap(([index, type]) => {
      const x = Number(index) % cave.width;
      const y = Math.floor(Number(index) / cave.width);
      return x < width && y < height ? [[y * width + x, type]] : [];
    }));
  }
  cave.width = width; cave.height = height; cave.layers = next;
}

function nextCaveNumber() {
  const used = new Set(project.caves.map((cave) => cave.number));
  let number = project.caves.length + 1;
  while (used.has(number)) number += 1;
  return number;
}

function parseCaveNumber(input) {
  const value = input.trim();
  const number = Number(value);
  return /^\d+$/.test(value) && Number.isSafeInteger(number) && number > 0 ? number : null;
}

function addCave() {
  let message = "만들 Cave 번호를 입력하세요.";
  const suggestedNumber = String(nextCaveNumber());
  while (true) {
    const input = window.prompt(message, suggestedNumber);
    if (input === null) return;
    const number = parseCaveNumber(input);
    if (number === null) {
      message = "Cave 번호는 1 이상의 정수로 입력하세요.";
      continue;
    }
    if (project.caves.some((cave) => cave.number === number)) {
      message = `Cave ${String(number).padStart(4, "0")}은 이미 있습니다. 다른 번호를 입력하세요.`;
      continue;
    }
    const cave = createCave(number);
    commitCaveSave([...project.caves, cave], cave.id, `${cave.name}을 만들었습니다.`);
    return;
  }
}

function duplicateCave() {
  snapshot();
  const copy = deepCopy(activeCave()); copy.id = crypto.randomUUID(); copy.number = nextCaveNumber(); copy.name = `${copy.name} Copy`;
  const index = project.caves.findIndex((c) => c.id === project.activeCaveId);
  project.caves.splice(index + 1, 0, copy); project.activeCaveId = copy.id; renderAll(); persist(); toast("Cave를 복제했습니다.");
}

function saveCaveAs() {
  const source = activeCave();
  const input = window.prompt("저장할 Cave 번호를 입력하세요.", String(nextCaveNumber()));
  if (input === null) return;
  const number = parseCaveNumber(input);
  if (number === null) {
    toast("Cave 번호는 1 이상의 정수로 입력하세요.");
    return;
  }
  const label = `Cave ${String(number).padStart(4, "0")}`;
  const destinationIndex = project.caves.findIndex((cave) => cave.number === number);
  const destination = project.caves[destinationIndex];
  if (destination && !window.confirm(`${label} (${destination.name})에 덮어쓸까요?`)) return;

  const copy = deepCopy(source);
  copy.id = destination?.id ?? crypto.randomUUID();
  copy.number = number;
  copy.name = label;
  const caves = [...project.caves];
  if (destination) caves[destinationIndex] = copy;
  else caves.push(copy);
  commitCaveSave(caves, copy.id, `${label}에 저장했습니다.`);
}

function commitCaveSave(caves, activeCaveId, message) {
  snapshot();
  project = { ...project, caves, activeCaveId };
  caveSearchQuery = "";
  $("caveSearch").value = "";
  renderAll();
  persist(true, message);
}

function clearCave() {
  const cave = activeCave();
  if (!window.confirm(`${cave.name}의 모든 배치, 막힌 칸, 클리어 목표를 지울까요?`)) return;
  snapshot();
  cave.initialPieceTypes = Object.fromEntries(cave.layers.block.flatMap((_, index) =>
    initialPieceAt(cave, index) ? [[index, null]] : []));
  cave.layers = emptyLayers(cave.width * cave.height);
  cave.excludedCells = [];
  delete cave.generatedSpawnerOverlaps;
  if (cave.externalSource?.overlappingMarkers) cave.externalSource.overlappingMarkers = {};
  cave.objectives = [];
  cave.testClearMoves = 0;
  syncLegacyTarget(cave);
  renderAll();
  persist(true, `${cave.name}을 비웠습니다.`);
}

function deleteCave() {
  if (project.caves.length === 1) return toast("마지막 Cave는 삭제할 수 없습니다.");
  if (!window.confirm(`${activeCave().name}을(를) 삭제할까요?`)) return;
  snapshot();
  const index = project.caves.findIndex((c) => c.id === project.activeCaveId);
  project.caves.splice(index, 1); project.activeCaveId = project.caves[Math.max(0, index - 1)].id; renderAll(); persist();
}

function jumpToCave() {
  const number = parseCaveNumber($("caveJump").value);
  const cave = project.caves.find((entry) => entry.number === number);
  if (!cave) {
    $("caveJumpStatus").textContent = number === null ? "유효한 Cave 번호를 입력하세요." : `Cave ${number}번이 없습니다.`;
    return;
  }
  if (project.activeCaveId !== cave.id) {
    project.activeCaveId = cave.id;
    undoStack = [];
    redoStack = [];
  }
  caveSearchQuery = "";
  $("caveSearch").value = "";
  renderAll();
  $("caveList").querySelector(".active")?.scrollIntoView({ block: "nearest" });
  $("caveJumpStatus").textContent = `Cave ${number}번으로 이동했습니다.`;
  persist();
  revealSelectedCave();
}

function switchCave(delta) {
  const index = project.caves.findIndex((c) => c.id === project.activeCaveId);
  const nextIndex = Math.max(0, Math.min(project.caves.length - 1, index + delta));
  project.activeCaveId = project.caves[nextIndex].id; undoStack = []; redoStack = []; renderAll(); persist();
}

function wouldCreateMatch(blocks, index, color, cave) {
  const x = index % cave.width;
  const y = Math.floor(index / cave.width);
  const countDirection = (dx, dy) => {
    let count = 0;
    let nextX = x + dx;
    let nextY = y + dy;
    while (nextX >= 0 && nextX < cave.width && nextY >= 0 && nextY < cave.height) {
      if (blocks[nextY * cave.width + nextX] !== color) break;
      count += 1; nextX += dx; nextY += dy;
    }
    return count;
  };
  if (1 + countDirection(-1, 0) + countDirection(1, 0) >= 3
    || 1 + countDirection(0, -1) + countDirection(0, 1) >= 3) return true;
  if (project?.specialPieceRules?.customShapes?.some(({ cells }) =>
    cells.some(([dx, dy]) => customMatchCells(blocks, cave, cells, x - dx, y - dy, color, index)))) return true;
  if (!allowsSquareMatches(cave)) return false;

  for (const dx of [-1, 1]) {
    for (const dy of [-1, 1]) {
      if (x + dx < 0 || x + dx >= cave.width || y + dy < 0 || y + dy >= cave.height) continue;
      if (blocks[index + dx] === color && blocks[index + dy * cave.width] === color
        && blocks[index + dx + dy * cave.width] === color) return true;
    }
  }
  return false;
}

function boardShapeCandidates(cave, symmetry, percent, keepBlocks = true) {
  const { width, height } = cave;
  const size = width * height;
  const target = Math.min(size - 1, Math.round(size * percent / 100));
  const { block, terrain, gimmick, item } = cave.layers;
  const protectedCells = Array.from({ length: size }, (_, index) =>
    (terrain[index] && terrain[index] !== "floor") || gimmick[index] || item[index] ||
    (keepBlocks && block[index]) || isDdungTreasure(block[index]) ||
    initialPieceAt(cave, index) || ddungMarkersAt(cave, index).length
  );
  const groups = [];
  for (let index = 0; index < size; index++) {
    const x = index % width;
    const y = Math.floor(index / width);
    const mirror = symmetry === "horizontal" ? y * width + width - 1 - x
      : symmetry === "vertical" ? (height - 1 - y) * width + x : index;
    if (mirror < index || protectedCells[index] || protectedCells[mirror]) continue;
    groups.push(mirror === index ? [index] : [index, mirror]);
  }
  const candidates = new Map();
  function sample(budget) {
    const shuffled = [...groups];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    const cells = [];
    for (const group of shuffled.sort((a, b) => b.length - a.length)) {
      if (cells.length + group.length <= budget) cells.push(...group);
    }
    cells.sort((a, b) => a - b);
    if (!target || cells.length) candidates.set(cells.join(","), cells);
  }
  for (let attempt = 0; attempt < 30 && candidates.size < 3; attempt++) sample(target);
  const closest = candidates.values().next().value?.length ?? 0;
  for (let budget = closest - 1; budget > 0 && candidates.size < 3; budget--) {
    for (let attempt = 0; attempt < 8 && candidates.size < 3; attempt++) sample(budget);
  }
  return { target, candidates: [...candidates.values()] };
}

function renderBoardShapeCandidates(cave, onSelect) {
  const options = $("boardShapeOptions");
  const status = $("boardShapeStatus");
  const keepBlocks = $("boardShapeKeepBlocks").checked;
  const percent = clampNumber($("boardShapePercent").value, 20, 0, 70);
  const { candidates, target } = boardShapeCandidates(cave, $("boardShapeSymmetry").value, percent, keepBlocks);
  options.replaceChildren();
  status.textContent = `${cave.width} × ${cave.height} · 목표 ${target}칸 · 후보 ${candidates.length}개`;
  if (target && candidates.length < 3) {
    status.textContent += keepBlocks
      ? " · 바꿀 수 있는 칸이 적어요. ‘일반 블록 배치 유지’를 끄거나 대칭과 비율을 바꿔 보세요."
      : " · 보호된 오브젝트와 대칭 조건 때문에 후보가 적어요. 대칭과 비율을 바꿔 보세요.";
  } else if (candidates.some((cells) => cells.length < target)) {
    status.textContent += " · 선택 폭을 넓히려고 목표보다 적게 막은 후보도 포함했어요.";
  }
  for (const [index, cells] of candidates.entries()) {
    const blocked = new Set(cells);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "button ghost";
    const removedBlocks = cells.filter((cell) => cave.layers.block[cell]).length;
    card.textContent = `후보 ${index + 1} · 막힌 칸 ${cells.length}개` +
      (removedBlocks ? ` · 일반 블록 ${removedBlocks}개 제거` : "");
    const grid = document.createElement("span");
    grid.className = "board-shape-grid";
    grid.style.gridTemplateColumns = "repeat(" + cave.width + ", 10px)";
    grid.setAttribute("aria-hidden", "true");
    for (let cell = 0; cell < cave.width * cave.height; cell++) {
      const tile = document.createElement("span");
      if (blocked.has(cell) || cave.layers.terrain[cell] === "pit") tile.className = "board-shape-blocked";
      grid.append(tile);
    }
    card.append(grid);
    card.setAttribute("aria-pressed", "false");
    card.addEventListener("click", () => {
      for (const button of options.children) button.setAttribute("aria-pressed", String(button === card));
      onSelect(cells);
    });
    options.append(card);
  }
}

function openBoardShapes() {
  const cave = activeCave();
  const dialog = $("boardShapeDialog");
  const refresh = () => renderBoardShapeCandidates(cave, (cells) => {
    snapshot();
    cave.excludedCells = cells;
    for (const cell of cells) {
      cave.layers.block[cell] = null;
      if (cave.layers.terrain[cell] === "floor") cave.layers.terrain[cell] = null;
    }
    cave.testClearMoves = 0;
    dialog.close();
    renderAll();
    persist();
    toast("보드 모양을 적용했습니다. 막힌 칸 " + cells.length + "개");
  });
  $("boardShapeRefresh").onclick = refresh;
  $("boardShapeSymmetry").onchange = refresh;
  $("boardShapePercent").onchange = refresh;
  $("boardShapeKeepBlocks").onchange = refresh;
  refresh();
  dialog.showModal();
}

function regionItemCells(cave, firstRow, lastRow, firstColumn, lastColumn) {
  const cells = [];
  for (let row = firstRow; row <= lastRow; row++) {
    for (let column = firstColumn; column <= lastColumn; column++) {
      const index = (row - 1) * cave.width + column - 1;
      if (isBarrier(cave, index) || initialPieceAt(cave, index)) continue;
      if (Object.values(cave.layers).some((layer) => layer[index])) continue;
      cells.push(index);
    }
  }
  return cells;
}

function openRegionItems() {
  const cave = activeCave();
  const dialog = $("regionItemDialog");
  const form = $("regionItemForm");
  const item = $("regionItemType");
  const status = $("regionItemStatus");
  const apply = $("regionItemApply");
  item.replaceChildren();
  for (const id of paletteIdsFor("item", cave)) {
    const asset = getAsset("item", id);
    if (asset) item.add(new Option(asset.name || id, id));
  }
  const bounds = [
    ["regionFirstRow", cave.height, 1],
    ["regionLastRow", cave.height, Math.min(3, cave.height)],
    ["regionFirstColumn", cave.width, 1],
    ["regionLastColumn", cave.width, Math.min(3, cave.width)],
  ];
  for (const [id, max, value] of bounds) {
    $(id).max = max;
    $(id).value = value;
  }
  $("regionItemCount").max = cave.width * cave.height;
  $("regionItemCount").value = 1;

  const readCells = () => {
    if (!form.checkValidity() || !item.value) return [];
    const [firstRow, lastRow, firstColumn, lastColumn] = bounds.map(([id]) => $(id).valueAsNumber);
    return regionItemCells(cave, firstRow, lastRow, firstColumn, lastColumn);
  };
  const refresh = () => {
    const available = readCells().length;
    const count = $("regionItemCount").valueAsNumber;
    apply.disabled = !item.value || !form.checkValidity() || available < count;
    status.textContent = item.value
      ? "배치 가능한 빈 칸 " + available + "개" + (available < count ? " · 요청한 수량을 배치할 수 없습니다." : "")
      : "먼저 오른쪽 Item 탭에서 오브젝트를 만들어 주세요.";
  };
  form.oninput = refresh;
  form.onsubmit = (event) => {
    event.preventDefault();
    const cells = readCells();
    const count = $("regionItemCount").valueAsNumber;
    if (!form.checkValidity() || !item.value || cells.length < count) return refresh();
    snapshot();
    for (let placed = 0; placed < count; placed++) {
      const randomIndex = Math.floor(Math.random() * cells.length);
      const [index] = cells.splice(randomIndex, 1);
      cave.layers.item[index] = item.value;
    }
    cave.testClearMoves = 0;
    dialog.close();
    renderAll();
    persist();
    toast("구역에 아이템 " + count + "개를 배치했습니다.");
  };
  refresh();
  dialog.showModal();
}

function randomizeBlocks() {
  const cave = activeCave();
  const seed = ($("randomSeed").value.trim() || `CAVE-${Date.now().toString(36).toUpperCase()}`).slice(0, 40);
  const density = clampNumber($("randomDensity").value, 100, 10, 100);
  const colors = cave.usableBlocks.length ? cave.usableBlocks : project.paletteAssets.block || [];
  if (!colors.some((id) => blockWeight(cave, id) > 0)) return toast("생성 가중치가 0보다 큰 블록 종류를 선택하세요.");
  const random = seededRandom(`${seed}|${cave.width}x${cave.height}|${colors.join(",")}|${density}`);
  const fixed = cave.layers.block.map((_, index) =>
    isBarrier(cave, index) || Boolean(cave.layers.item[index]) || Boolean(initialPieceAt(cave, index))
  );
  const blocks = cave.layers.block.map((block, index) => fixed[index] ? block : null);
  const eligible = [];
  for (let index = 0; index < blocks.length; index += 1) {
    if (fixed[index]) continue;
    eligible.push(index);
    if (random() * 100 >= density) continue;
    const candidates = colors.filter((color) => blockWeight(cave, color) > 0 && !wouldCreateMatch(blocks, index, color, cave));
    blocks[index] = candidates.length ? chooseBlockColor(cave, candidates, random) : null;
  }
  const shortfalls = [];
  for (const objective of cave.objectives.filter((item) => item.layer === "block")) {
    const targetNeeded = resolvedObjectiveCount(cave, objective);
    let targetPlaced = blocks.filter((value) => value === objective.targetId).length;
    const shuffled = [...eligible].sort(() => random() - 0.5);
    for (const index of shuffled) {
      if (targetPlaced >= targetNeeded) break;
      if (blockWeight(cave, objective.targetId) > 0 && blocks[index] !== objective.targetId && !wouldCreateMatch(blocks, index, objective.targetId, cave)) {
        blocks[index] = objective.targetId;
        targetPlaced += 1;
      }
    }
    if (targetPlaced < targetNeeded) shortfalls.push(`${objective.targetId} ${targetNeeded - targetPlaced}개`);
  }
  snapshot();
  cave.layers.block = blocks;
  placeGenerationSpawners(cave);
  cave.usableBlocks = [...colors];
  project.paletteAssets = collectPaletteAssets(project.caves, project.paletteAssets);
  cave.randomSeed = seed;
  cave.randomDensity = density;
  renderAll(); persist();
  toast(`시드 ${seed} · 고정 칸 ${fixed.filter(Boolean).length}개 보존 · 블록 ${blocks.filter(Boolean).length}개${shortfalls.length ? ` · 목표색 부족 ${shortfalls.join(", ")}` : ""}`);
}


function difficultyTerrainAssets(cave) {
  const palette = project.paletteAssets.terrain || [];
  return usesDdungGeneration(cave)
    ? [...new Set([...ASSETS.terrain.map(({ id }) => id), ...palette])]
    : palette;
}

function difficultyTerrainIds(cave) {
  return difficultyTerrainAssets(cave)
    .filter((id) => Object.hasOwn(DDUNG_JAM_COLORS, id) ||
      (cave.terrainRules[id]?.reaction && cave.terrainRules[id].reaction !== "none"));
}

function difficultyPatternSlots(cave, slots, pattern, attempt) {
  const { width, height } = cave;
  const active = (x, y) => x >= 0 && x < width && y >= 0 && y < height && !isExcluded(cave, y * width + x);
  return slots.filter((index) => {
    const x = index % width;
    const y = Math.floor(index / width);
    if (pattern === "border") return !active(x - 1, y) || !active(x + 1, y) || !active(x, y - 1) || !active(x, y + 1);
    if (pattern === "checker") return (x + y) % 2 === attempt % 2;
    if (pattern === "rows") return y % 2 === attempt % 2;
    if (pattern === "columns") return x % 2 === attempt % 2;
    if (pattern === "corners") {
      return (x < Math.floor(width / 3) || x >= Math.ceil(width * 2 / 3)) &&
        (y < Math.floor(height / 3) || y >= Math.ceil(height * 2 / 3));
    }
    if (pattern === "lanes") return x % 3 !== 1;
    if (pattern === "bands") return y % 3 === 2 || (x % 2 === 0 && y >= 2);
    return true;
  });
}

function difficultyGimmickIds(cave) {
  const palette = project.paletteAssets.gimmick || [];
  return usesDdungGeneration(cave)
    ? [...new Set([...ASSETS.gimmick.map(({ id }) => id), "ddung-iron-box", ...palette])]
    : palette;
}

function canGenerateGimmick(id) {
  return ![SPAWNER_ID, "teleport-a", "teleport-b", "exit"].includes(id);
}

function difficultyItemIds(cave) {
  // Generation still writes collection pieces to their compatible JSON slots.
  return usesDdungGeneration(cave) ? [...DDUNG_ITEM_IDS] :
    (project.paletteAssets.item || []);
}

function difficultyBlockIds(cave, automatic) {
  const ddung = usesDdungGeneration(cave);
  let colors = cave.usableBlocks.length ? cave.usableBlocks : project.paletteAssets.block || [];
  if (ddung) {
    colors = colors.filter((id) => DDUNG_COLOR_IDS.includes(id));
    if (automatic && !colors.length && !cave.usableBlocks.length) colors = DDUNG_COLOR_IDS;
  }
  return colors.filter((id) => blockWeight(cave, id) > 0);
}

function buildDifficultyCandidate(source, colors, target, attempt, keepPlacement, pattern = "random", gimmickIds = [], selectedTerrain = []) {
  const cave = deepCopy(source);
  const goals = cave.objectives;
  const requiredGoals = cave.scoreTarget == null ? goals : [];
  const preserveLayer = (layer) => requiredGoals.some((goal) => goal.layer === layer);
  const seed = source.randomSeed + "|difficulty-" + target + "-" + (attempt + 1);
  const random = seededRandom(seed);
  if (!keepPlacement) {
    cave.layers = emptyLayers(cave.width * cave.height);
    cave.layers.terrain = preserveLayer("terrain") ? [...source.layers.terrain]
      : source.layers.terrain.map((id) => id === "pit" ? id : null);
    if (preserveLayer("gimmick") || preserveLayer("item")) cave.layers.gimmick = [...source.layers.gimmick];
    else if (cave.externalSource?.overlappingMarkers) cave.externalSource.overlappingMarkers = {};
    if (preserveLayer("item")) {
      cave.layers.item = [...source.layers.item];
      cave.layers.block = source.layers.block.map((id) => isDdungTreasure(id) ? id : null);
    }
    cave.initialPieceTypes = Object.fromEntries(
      source.layers.block.flatMap((_, index) => initialPieceAt(source, index) ? [[index, null]] : [])
    );
  }
  cave.randomSeed = seed;
  if (colors.length < 2) return null;
  cave.usableBlocks = colors;
  cave.testClearMoves = 0;

  const terrain = cave.layers.terrain;
  const terrainSlots = difficultyPatternSlots(cave,
    terrain.flatMap((id, index) => (!id || id === "floor") && !isBarrier(cave, index) ? [index] : []), pattern, attempt);
  const terrainCounts = new Map();
  terrain.forEach((id, index) => {
    if (id && !isExcluded(cave, index)) terrainCounts.set(id, (terrainCounts.get(id) || 0) + 1);
  });
  for (const goal of requiredGoals.filter(({ layer }) => layer === "terrain")) {
    const minimum = goal.countMode === "manual" ? goal.count : 1;
    const needed = minimum - countObjectiveAssets(cave, goal);
    if (needed <= 0) continue;
    if (!difficultyTerrainIds(cave).includes(goal.targetId) || needed > terrainSlots.length) return null;
    for (let placed = 0; placed < needed; placed++) {
      const [index] = terrainSlots.splice(Math.floor(random() * terrainSlots.length), 1);
      terrain[index] = goal.targetId;
      terrainCounts.set(goal.targetId, (terrainCounts.get(goal.targetId) ?? 0) + 1);
    }
  }
  const targets = difficultyTerrainIds(cave).filter((id) =>
    selectedTerrain.includes(id) &&
    (terrainCounts.has(id) || terrainSlots.length));
  if (targets.length !== selectedTerrain.length) return null;
  const variation = 0.65 + random() * 0.7;
  const newTargets = targets.filter((id) => !terrainCounts.has(id));
  if (terrainSlots.length < newTargets.length) return null;
  const budget = Math.min(terrainSlots.length, Math.max(newTargets.length, Math.round(terrainSlots.length *
    (pattern === "random" ? (0.05 + target * 0.002) * variation : 0.2 + target * 0.003))));
  for (let placed = 0; placed < budget && newTargets.length; placed++) {
    const [index] = terrainSlots.splice(Math.floor(random() * terrainSlots.length), 1);
    const id = newTargets[placed % newTargets.length];
    terrain[index] = id;
    terrainCounts.set(id, (terrainCounts.get(id) ?? 0) + 1);
  }
  placeGenerationSpawners(cave);
  const gimmicks = cave.layers.gimmick;

  const free = cave.layers.block.flatMap((_, index) =>
    !isBarrier(cave, index) &&
    (!terrain[index] || terrain[index] === "floor") && !gimmicks[index] && !cave.layers.item[index] ? [index] : []
  );
  const eligibleAssets = {
    gimmick: gimmickIds,
    item: difficultyItemIds(cave),
  };
  for (const [layer, assets] of Object.entries(eligibleAssets)) {
    if (!assets.length) continue;
    if (!free.length && layer === "gimmick") return null;
    const slots = layer === "gimmick" ? difficultyPatternSlots(cave, free, pattern, attempt) : free.slice();
    if (!slots.length && layer === "gimmick") return null;
    if (layer === "gimmick" && slots.length < assets.length) return null;
    const offset = Math.floor(random() * assets.length);
    const count = Math.min(slots.length, Math.max(layer === "gimmick" ? assets.length : 1,
      Math.round(slots.length * (0.025 + target * 0.001) * (0.65 + random() * 0.7))));
    for (let placed = 0; placed < count; placed += 1) {
      const [index] = slots.splice(Math.floor(random() * slots.length), 1);
      free.splice(free.indexOf(index), 1);
      const id = assets[(offset + (layer === "gimmick" ? placed : 0)) % assets.length];
      if (layer === "gimmick" && ddungLargeGimmick(id)) {
        const fit = (cell) => cell % cave.width < cave.width - 1 &&
          [cell, cell + 1, cell + cave.width, cell + cave.width + 1].every((part) =>
            !isBarrier(cave, part) && !gimmicks[part] && !cave.layers.item[part] && (!terrain[part] || terrain[part] === "floor"));
        const anchor = [index, ...slots].find(fit);
        if (anchor === undefined) {
          if (placed < assets.length) return null;
          continue;
        }
        paintLayerCell(cave, layer, anchor, id);
        for (const part of ddungGimmickGroup(cave, anchor)) {
          if (slots.includes(part)) slots.splice(slots.indexOf(part), 1);
          if (free.includes(part)) free.splice(free.indexOf(part), 1);
        }
      } else if (layer === "gimmick") paintLayerCell(cave, layer, index, id);
      else cave.layers[layer][index] = id;
      if (!slots.length) {
        if (layer === "gimmick" && placed + 1 < assets.length) return null;
        break;
      }
    }
  }

  const blocks = cave.layers.block;
  for (let index = 0; index < blocks.length; index += 1) {
    if (blocks[index] || isBarrier(cave, index)) continue;
    const available = colors.filter((color) => !wouldCreateMatch(blocks, index, color, cave));
    if (!available.length) return null;
    blocks[index] = chooseBlockColor(cave, available, random);
  }
  if ((!keepPlacement && findMatches(cave).size) || !hasPossibleSwap(cave)) return null;

  if (usesDdungGeneration(source)) cave.generatedBlockArt = "ddung";
  else delete cave.generatedBlockArt;
  syncLegacyTarget(cave);
  const validation = validateCave(cave, collectPaletteAssets([cave], project.paletteAssets, project.assetDefinitions));
  return validation.errors.length || validation.unsupported.length ? null : cave;
}

function difficultyCandidateScore(cave, batch) {
  const failureRate = 1 - batch.wins / batch.runs;
  const movePressure = batch.average / (cave.moveLimitEnabled ? cave.moveLimit : cave.parMoves);
  return Math.max(1, Math.min(100, Math.round(70 * failureRate + 25 * movePressure + 5 * batch.stuck / batch.runs)));
}

function renderDifficultyCandidates(source, candidates) {
  const options = $("difficultyOptions");
  options.replaceChildren();
  for (const [index, { cave, batch, score }] of candidates.entries()) {
    const card = document.createElement("details");
    card.open = index === 0;
    const summary = document.createElement("summary");
    summary.textContent = "후보 " + (index + 1) + (batch.wins ? " · 추정 난이도 " + score : " · 자동 검증 미클리어") +
      " · 자동 플레이 " + batch.runs + "회 시도 · " + batch.wins + "회 클리어 (" + batch.clearRate + "%)";
    const info = document.createElement("p");
    info.textContent = cave.width + " × " + cave.height + " · " + moveLimitSummary(cave) +
      " · 성공 평균 " + batch.average + "회 · 막힘 " + batch.stuck + "/" + batch.runs +
      (batch.limited ? " · 자동 검증 상한 도달 " + batch.limited + "회" : "");
    const goals = document.createElement("p");
    goals.textContent = cave.scoreTarget != null ? "목표 점수 " + cave.scoreTarget
      : cave.objectives.map((goal) => objectiveLabel(goal) + " " + resolvedObjectiveCount(cave, goal) + "개").join(" · ");
    const viewport = document.createElement("div");
    viewport.className = "difficulty-preview-scroll";
    const grid = document.createElement("div");
    grid.className = "difficulty-preview-grid";
    grid.style.gridTemplateColumns = "repeat(" + cave.width + ", 24px)";
    for (let cellIndex = 0; cellIndex < cave.layers.block.length; cellIndex += 1) {
      const cell = document.createElement("div");
      cell.className = "map-cell";
      applyCellVisual(cell, cave, cellIndex);
      cell.title = describeCellProperties(cave, cellIndex);
      grid.append(cell);
    }
    viewport.append(grid);
    const apply = document.createElement("button");
    apply.type = "button";
    apply.className = "button primary";
    apply.textContent = "이 후보 적용";
    apply.onclick = () => {
      if (activeCave() !== source) return;
      snapshot();
      Object.assign(source, cave);
      project.paletteAssets = collectPaletteAssets(project.caves, project.paletteAssets, project.assetDefinitions);
      $("difficultyDialog").close();
      renderAll();
      persist();
      toast(batch.wins ? "추정 난이도 " + score + " 후보를 적용했습니다." : "자동 검증 미클리어 후보를 적용했습니다.");
    };
    card.append(summary, info, goals, viewport, apply);
    options.append(card);
  }
}

function renderDifficultyChoices(container, layer, ids, enabled) {
  $(container).replaceChildren(...ids.map((id) => {
    const label = document.createElement("label");
    const input = document.createElement("input");
    input.type = "checkbox";
    input.value = id;
    input.disabled = !enabled(id);
    const asset = getAsset(layer, id);
    const icon = document.createElement("span");
    icon.className = "asset-visual " + (asset.className || "");
    icon.textContent = asset.visual;
    icon.setAttribute("aria-hidden", "true");
    if (asset.panelMark) icon.dataset.panelMark = asset.panelMark;
    showObjectImage(icon, asset.image);
    label.append(input, icon, asset.name + (input.disabled ? (layer === "terrain" ? " · 제거 목표 불가" : " · 직접 배치") : ""));
    return label;
  }));
}

function openDifficultyGenerator() {
  const cave = activeCave();
  const closedCells = cave.layers.terrain.filter((id, index) => id === "pit" || isExcluded(cave, index)).length;
  $("difficultyBoardSummary").textContent = `현재 보드 ${cave.width} × ${cave.height} · 막힌 칸 ${closedCells}개 · ${moveLimitSummary(cave)}`;
  $("difficultyGoalSummary").textContent = cave.scoreTarget != null ? `현재 목표 · ${cave.scoreTarget}점`
    : cave.objectives.length ? "현재 목표 · " + cave.objectives.map((goal) =>
      `${objectiveLabel(goal)} ${goal.countMode === "auto-map" ? "(보드 개수 기준)" : goal.count + "개"}`).join(" · ")
      : "클리어 목표가 비어 있어요. 레벨 설정에서 미션이나 목표 점수를 먼저 정하세요.";
  const terrainIds = difficultyTerrainIds(cave);
  renderDifficultyChoices("difficultyTerrain", "terrain", difficultyTerrainAssets(cave), (id) => terrainIds.includes(id));
  const terrainCount = $("difficultyTerrainCount");
  terrainCount.max = Math.min(MAX_OBJECTIVES, terrainIds.length);
  terrainCount.value = Math.min(terrainCount.valueAsNumber || 0, Number(terrainCount.max));
  const gimmicks = difficultyGimmickIds(cave);
  renderDifficultyChoices("difficultyGimmick", "gimmick", gimmicks, canGenerateGimmick);
  const gimmickCount = $("difficultyGimmickCount");
  gimmickCount.max = Math.min(6, gimmicks.filter(canGenerateGimmick).length);
  gimmickCount.value = Math.min(gimmickCount.valueAsNumber || 0, Number(gimmickCount.max));
  $("difficultyOptions").replaceChildren();
  $("difficultyStatus").textContent = "";
  $("difficultyDialog").showModal();
}

function difficultyObjectOptions(random, pool, count) {
  const available = [...pool];
  return Array.from({ length: count }, () => available.splice(Math.floor(random() * available.length), 1)[0]);
}

async function generateDifficultyCandidates(event) {
  event.preventDefault();
  const source = activeCave();
  const dialog = $("difficultyDialog");
  const target = $("difficultyTarget").valueAsNumber;
  const automatic = $("difficultyAutomatic").checked;
  const keepPlacement = !automatic && $("difficultyKeepPlacement").checked;
  const pattern = $("difficultyPattern").value;
  const gimmickIds = Array.from($("difficultyGimmick").querySelectorAll("input:checked"), (input) => input.value);
  const selectedTerrain = Array.from($("difficultyTerrain").querySelectorAll("input:checked"), (input) => input.value);
  const terrainCount = $("difficultyTerrainCount").valueAsNumber;
  const gimmickCount = $("difficultyGimmickCount").valueAsNumber;
  const status = $("difficultyStatus");
  const submit = $("difficultyGenerate");
  const fields = $("difficultyFields");
  if (submit.disabled || !Number.isInteger(target) || target < 1 || target > 100) return;
  $("difficultyOptions").replaceChildren();
  if (source.scoreTarget == null && !source.objectives.length) {
    status.textContent = "레벨 설정에서 클리어 목표를 하나 이상 정한 뒤 후보를 생성하세요.";
    return;
  }
  const terrainPool = selectedTerrain.length ? selectedTerrain : difficultyTerrainIds(source);
  const gimmickPool = gimmickIds.length ? gimmickIds : difficultyGimmickIds(source).filter(canGenerateGimmick);
  if (!Number.isInteger(terrainCount) || terrainCount < 0 || terrainCount > MAX_OBJECTIVES ||
      !Number.isInteger(gimmickCount) || gimmickCount < 0 || gimmickCount > 6) return;
  if (terrainCount > terrainPool.length || gimmickCount > gimmickPool.length) {
    status.textContent = "사용할 종류 수만큼 체크하거나 종류 수를 줄여 주세요.";
    return;
  }
  const colors = difficultyBlockIds(source, automatic);
  const generationSeed = source.randomSeed + "|recommend|" + crypto.randomUUID();
  const generationSource = deepCopy(source);
  generationSource.randomSeed = generationSeed;
  if (colors.length < 2) {
    status.textContent = "사용 색상에서 생성 가중치가 0보다 큰 블록 색상을 2종 이상 선택하세요.";
    return;
  }
  const candidates = [];
  const signatures = new Set();
  const attempts = 12;
  const runs = 6;
  let canceled = false;
  const cancel = () => { canceled = true; };
  dialog.addEventListener("close", cancel, { once: true });
  fields.disabled = true;
  submit.disabled = true;
  try {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      status.textContent = "목표 " + target + " · 후보 생성 및 검증 " + (attempt + 1) + "/" + attempts;
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (canceled || !dialog.open || activeCave() !== source) return;
      const random = seededRandom(generationSeed + "|" + attempt);
      const patterns = ["random", "border", "checker", "rows", "columns", "corners", "lanes", "bands"];
      const options = {
        pattern: automatic ? patterns[Math.floor(random() * patterns.length)] : pattern,
        gimmicks: difficultyObjectOptions(random, gimmickPool, gimmickCount),
        terrain: difficultyObjectOptions(random, terrainPool, terrainCount),
      };
      const cave = buildDifficultyCandidate(generationSource, colors, target, attempt, keepPlacement,
        options.pattern, options.gimmicks, options.terrain);
      if (!cave) continue;
      const signature = JSON.stringify([cave.layers, cave.objectives, cave.moveLimit, cave.scoreTarget, cave.pointsPerBlock]);
      if (signatures.has(signature)) continue;
      signatures.add(signature);
      const results = [];
      for (let run = 0; run < runs; run += 1) {
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (canceled || !dialog.open || activeCave() !== source) return;
        results.push(runAutoGame(cave, run));
      }
      const batch = summarizeBatch(results);
      candidates.push({ cave, batch, score: difficultyCandidateScore(cave, batch) });
    }
    candidates.sort((a, b) => Math.abs(a.score - target) - Math.abs(b.score - target) || b.batch.wins - a.batch.wins);
    const best = candidates.slice(0, 3);
    renderDifficultyCandidates(source, best);
    status.textContent = best.length
      ? "목표 " + target + " · 가까운 후보 " + best.length + "개 · 후보당 자동 플레이 " + runs + "회"
      : "현재 목표에 필요한 오브젝트를 배치할 공간이 부족하거나 시작 상태에서 교환할 수 없어요. 보드와 목표 설정을 확인해 주세요.";
  } catch (error) {
    console.error(error);
    status.textContent = "후보를 만드는 중 오류가 발생했습니다.";
  } finally {
    dialog.removeEventListener("close", cancel);
    fields.disabled = false;
    submit.disabled = false;
  }
}

function analyzeDifficulty(cave, scoreTarget = cave.scoreTarget) {
  const totalBlocks = cave.layers.block.filter(Boolean).length;
  const usedColors = new Set(cave.layers.block.filter(Boolean));
  const gimmickCount = cave.layers.gimmick.filter(Boolean).length;
  const itemCount = cave.layers.item.filter(Boolean).length;
  const area = cave.width * cave.height;
  const referenceMoves = cave.testClearMoves > 0 ? cave.testClearMoves : cave.parMoves;
  const slack = cave.moveLimitEnabled === false ? null : cave.moveLimit - referenceMoves;
  const budgetRatio = slack === null ? Infinity : cave.moveLimit / Math.max(1, referenceMoves);
  const objectiveWork = scoreTarget != null ? Math.ceil(scoreTarget / cave.pointsPerBlock) : cave.objectives.reduce((sum, objective) => {
    const count = resolvedObjectiveCount(cave, objective);
    if (objective.layer !== "terrain") return sum + count;
    const durability = cave.terrainRules?.[objective.targetId]?.durability || 1;
    return sum + count * durability;
  }, 0);
  const targetPressure = objectiveWork / Math.max(1, totalBlocks);
  let score = 0;
  if (area >= 144) score += 2; else if (area >= 100) score += 1;
  if (usedColors.size >= 5) score += 2; else if (usedColors.size >= 3) score += 1;
  if (gimmickCount >= 6) score += 2; else if (gimmickCount >= 2) score += 1;
  if (itemCount >= 4) score += 1;
  if (targetPressure >= 0.7) score += 2; else if (targetPressure >= 0.4) score += 1;
  if (budgetRatio <= 1) score += 3; else if (budgetRatio <= 1.15) score += 2; else if (budgetRatio <= 1.35) score += 1;
  const levels = score <= 2
    ? { key: "easy", label: "Easy" }
    : score <= 5
      ? { key: "normal", label: "Normal" }
      : score <= 8
        ? { key: "hard", label: "Hard" }
        : { key: "expert", label: "Expert" };
  return { ...levels, score, slack, budgetRatio, totalBlocks, usedColors: usedColors.size, gimmickCount, itemCount, referenceMoves, objectiveWork };
}

function moveBudgetSummary({ slack }) {
  return slack === null ? "이동 횟수 제한 없음" : `여유 ${slack >= 0 ? "+" : ""}${slack}회`;
}

function moveLimitSummary(cave) {
  return cave.moveLimitEnabled === false ? "이동 횟수 제한 없음" : `이동 횟수 제한 ${cave.moveLimit}회`;
}

function validateCave(cave, palette = project.paletteAssets, scoreTarget = cave.scoreTarget ?? null) {
  const errors = [];
  const warnings = [];
  const unsupported = [];
  const analysis = analyzeDifficulty(cave, scoreTarget);
  const teleportA = cave.layers.gimmick.filter((value, index) => value === "teleport-a" || ddungMarkersAt(cave, index).includes("teleport-a")).length;
  const teleportB = cave.layers.gimmick.filter((value, index) => value === "teleport-b" || ddungMarkersAt(cave, index).includes("teleport-b")).length;
  const initialMatches = findMatches(cave).size;
  if (!analysis.totalBlocks) errors.push("퍼즐 블록이 하나도 없습니다.");
  const objectives = scoreTarget === null ? cave.objectives : [];
  if (scoreTarget === null && !objectives.length) errors.push("목표를 하나 이상 설정해야 합니다.");
  if (objectives.length > MAX_OBJECTIVES) errors.push(`목표는 최대 ${MAX_OBJECTIVES}개까지 설정할 수 있습니다.`);
  const objectiveKeys = new Set();
  objectives.forEach((objective) => {
    const label = objectiveLabel(objective);
    const key = `${objective.layer}:${objective.targetId}:${objective.action}`;
    const placed = countObjectiveAssets(cave, objective);
    const target = resolvedObjectiveCount(cave, objective);
    if (objectiveKeys.has(key)) errors.push(`${label} 목표가 중복되어 있습니다.`);
    objectiveKeys.add(key);
    if (!palette[objective.layer]?.includes(objective.targetId)) errors.push(`${label} 대상이 현재 팔레트에 없습니다.`);
    const limitation = ddungGoalLimitation(cave, objective);
    if (limitation) unsupported.push(`${label} · ${limitation}`);
    if (!limitation && !isDdungBoardObjective(cave, objective)) {
      if (target < 1) errors.push(`${label} 목표 수량은 1 이상이어야 합니다.`);
      if (objective.countMode === "auto-map" && placed < 1) errors.push(`${label} 자동 수량 목표지만 맵에 배치된 대상이 없습니다.`);
    }
    if (!limitation && objective.layer === "block" && !cave.usableBlocks.includes(objective.targetId) && (!isDdungSource(cave.externalSource) || placed < target)) errors.push(`${label} 색상이 사용 가능 블록에서 제외되어 있습니다.`);
    if (objective.layer === "terrain" && !Object.hasOwn(DDUNG_JAM_COLORS, objective.targetId) &&
        cave.terrainRules?.[objective.targetId]?.reaction === "none") errors.push(`${label} 목표는 제거 불가 규칙입니다. Terrain 반응을 같은 칸 또는 인접 매치로 바꾸세요.`);
    if (objective.countMode === "manual" && objective.layer !== "block" && target > placed &&
        !(isDdungSource(cave.externalSource) && objective.layer === "item" && isDdungTreasure(objective.targetId))) warnings.push(`${label} 목표 ${target}개보다 맵 배치 ${placed}개가 적습니다.`);
    if (objective.layer === "block" && placed < target) warnings.push(`${label}은 현재 ${placed}개입니다. 리필에서 생성될 수 있지만 목표 달성 편차가 커질 수 있습니다.`);
  });
  if (cave.moveLimit < 1) errors.push("Moves는 1 이상이어야 합니다.");
  if (cave.parMoves < 1) errors.push("권장 클리어 Moves는 1 이상이어야 합니다.");
  if (!cave.usableBlocks.length) errors.push("사용 가능한 블록 색상을 하나 이상 선택해야 합니다.");
  else if (!cave.usableBlocks.some((id) => blockWeight(cave, id) > 0)) errors.push("사용 색상 중 하나 이상의 생성 가중치를 0보다 높게 설정하세요.");
  if (teleportA !== teleportB) errors.push(`Teleport A/B 개수가 다릅니다. (${teleportA}/${teleportB})`);
  if (cave.layers.block.some((block) => block && !cave.usableBlocks.includes(block))) {
    if (isDdungSource(cave.externalSource) || cave.generatedBlockArt === "ddung") warnings.push("리필 색상에 없는 고정 배치 블록이 있습니다.");
    else errors.push("사용 색상에서 제외된 블록이 맵에 배치되어 있습니다.");
  }
  if (cave.moveLimitEnabled !== false && cave.moveLimit < cave.parMoves) errors.push(`Moves ${cave.moveLimit}회가 권장 클리어 ${cave.parMoves}회보다 적습니다.`);
  if (cave.moveLimitEnabled !== false && cave.testClearMoves > cave.moveLimit) errors.push(`테스트 클리어 ${cave.testClearMoves}회가 제한 ${cave.moveLimit}회를 초과합니다.`);
  if (!cave.testClearMoves) warnings.push("테스트 클리어 Moves가 없습니다. 실제 플레이 기록을 입력하면 난이도 판정이 더 정확해집니다.");
  if (cave.moveLimitEnabled !== false && cave.moveLimit >= cave.parMoves * 2) warnings.push("허용 Moves가 권장 클리어 횟수의 2배 이상이라 난이도가 크게 낮아질 수 있습니다.");
  if (initialMatches) warnings.push(`시작 상태에 이미 3-Match 블록이 ${initialMatches}개 있습니다. 랜덤 재배치를 권장합니다.`);
  if (analysis.totalBlocks && !initialMatches && !hasPossibleSwap(cave) &&
      !cave.layers.block.some((block, index) => block && !isBarrier(cave, index) && specialEffect(cave, initialPieceAt(cave, index)))) {
    warnings.push("시작 상태에서 가능한 교환이나 특수 피스 발동을 찾지 못했습니다.");
  }
  return { errors, warnings, unsupported, analysis };
}

function issueHtml(validation) {
  const errorHtml = validation.errors.length ? `<div><b>오류</b><br>${validation.errors.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  const warningHtml = validation.warnings.length ? `<div><b>경고</b><br>${validation.warnings.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  const unsupportedHtml = validation.unsupported.length ? `<div><b>원본 동작 판정 미지원</b><br>${validation.unsupported.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  return errorHtml + warningHtml + unsupportedHtml;
}

function renderSimulationGrid(cave, interactive = false, remainingTargets = [], damage = playtestState?.cave === cave ? playtestState : null, available = null) {
  const grid = $("simulationGrid");
  const live = damage?.liveSession;
  if (live) {
    const view = live.presentation();
    cave = view.cave;
    damage = { ...damage, ...view };
  }
  grid.style.setProperty("--board-columns", cave.width);
  grid.style.setProperty("--board-rows", cave.height);
  grid.style.gridTemplateColumns = `repeat(${cave.width}, var(--cell-size))`;
  const cells = document.createDocumentFragment();
  for (let index = 0; index < cave.width * cave.height; index += 1) {
    const cell = document.createElement(interactive ? "button" : "div");
    const readyBomb = interactive && !available && bombPanelReady(playtestState, index) && (!live || live.canSwap(index, true));
    const canActivate = readyBomb || (interactive &&
      (!available || available.has(index)) &&
      (!live || live.canTap(index)) && playtestSpecialAt(cave, index));
    const canSwap = interactive && (!available || available.has(index)) &&
      playtestState.paused && (live ? live.canSwap(index, true) : cave.layers.block[index] && !isSwapBlocked(cave, index));
    const selected = canSwap && playtestState.selectedIndex === index;
    cell.className = `map-cell${canActivate || canSwap ? " playable" : ""}${selected ? " selected" : ""}`;
    cell.type = interactive ? "button" : undefined;
    applyCellVisual(cell, cave, index, damage);
    if (live) {
      const motion = live.motions.get(cave.livePieceIds[index]);
      if (motion) cell.classList.add("live-piece-moving");
      cell.dataset.pieceId = cave.livePieceIds[index] ?? "";
      cell.dataset.pieceState = motion ? "falling" : live.blockedCells().has(index) ? "resolving" : "steady";
    }
    if (isDdungSource(cave.externalSource) && cave.layers.terrain[index] === "pit") cell.classList.add("ddung-board-gap");
    if (interactive && [playtestState.hint?.first, playtestState.hint?.second].includes(index)) cell.classList.add("hinted");
    const targets = remainingTargets.filter(({ objective }) => Object.entries(cave.layers).some(([layer, values]) =>
      matchesObjectiveOnLayer(cave, objective, layer, values[index]) &&
      (layer !== "gimmick" || !playtestState.activatedGimmicks.has(index))));
    if (targets.length) {
      cell.classList.add("remaining-target");
      cell.title = targets.map(({ objective }) => objectiveLabel(objective)).join(", ");
      cell.setAttribute("aria-label", `남은 목표 · ${cell.title}`);
    }
    if (damage && !isExcluded(cave, index)) {
      const details = [];
      if (isSwapBlocked(cave, index)) {
        cell.classList.add("locked-cell");
        const lock = document.createElement("span");
        lock.className = "cell-lock";
        lock.textContent = "🔒";
        lock.setAttribute("aria-hidden", "true");
        cell.appendChild(lock);
        details.push(isBarrier(cave, index) ? "잠긴 칸" : "교환만 잠김 · 매치 가능");
      }
      const terrainId = cave.layers.terrain[index];
      const rule = terrainId ? cave.terrainRules?.[terrainId] : null;
      const boxDurability = ddungBoxDurability(cave, index) ||
        ddungGimmickDurability(cave, index) ||
        cave.gimmickRules?.[cave.layers.gimmick[index]]?.durability;
      const hpIndex = terrainGroup(cave, index)[0];
      const durability = boxDurability || (rule && (rule.reaction !== "none" || Object.hasOwn(DDUNG_JAM_COLORS, terrainId)) ? terrainDurabilityAt(cave, hpIndex, rule) : 0);
      if (durability) {
        const hits = boxDurability ? damage.gimmickHits[ddungGimmickGroup(cave, index)[0]] : damage.terrainHits[hpIndex];
        const remaining = Math.max(0, durability - (hits || 0));
        const badge = document.createElement("span");
        badge.className = `terrain-hp${remaining < durability ? " damaged" : ""}`;
        badge.textContent = terrainId === "ddung-bomb-panel" && remaining === 1 ? "PUSH" : remaining - Number(terrainId === "ddung-bomb-panel");
        badge.setAttribute("aria-hidden", "true");
        cell.appendChild(badge);
        const layer = boxDurability ? "gimmick" : "terrain";
        const assetId = cave.layers[layer][index];
        if (terrainId === "ddung-bomb-panel" && !boxDurability) {
          details.push(remaining === 1 ? "폭탄 충전 완료 · 눌러서 발동" : "폭탄 충전까지 " + (remaining - 1) + "회");
        } else details.push(`${getAsset(layer, assetId).name} 내구도 ${remaining}/${durability}`);
      }
      if (details.length) {
        cell.title = [cell.title, ...details].filter(Boolean).join(" · ");
        cell.setAttribute("aria-label", cell.title);
      }
    }
    if (interactive) {
      cell.disabled ||= !(canActivate || canSwap);
      const piece = cave.playtestPieces[index];
      if (piece && !specialEffect(cave, piece) && !isBarrier(cave, index)) {
        cell.title = [cell.title, "발동 효과가 연결되지 않은 특수 피스"].filter(Boolean).join(" · ");
      }
      if (canActivate) {
        cell.setAttribute("aria-label", [readyBomb ? "폭탄 패널 발동" : `특수 피스 발동 · ${specialEffectLabel(canActivate)}`, cell.title].filter(Boolean).join(" · "));
      } else if (canSwap) {
        cell.setAttribute("aria-label", cellDescription(cave, index));
        cell.setAttribute("aria-pressed", String(selected));
      }
      if (live && !cell.hasAttribute("aria-label")) cell.setAttribute("aria-label", cellDescription(cave, index));
      if (!live && !cell.disabled) bindPlaytestCellInput(cell, index, canSwap);
    }
    // Image load handlers mutate classes/badges after rendering. Compare the
    // requested visual, not that asynchronously mutated DOM, so unchanged
    // blocks retain their decoded images across every live-board update.
    cell.simulationVisualMarkup = cell.innerHTML;
    cells.appendChild(cell);
  }
  if (live && grid.dataset.liveBoard === String(liveBoardSerial)) {
    const existing = [...grid.querySelectorAll(":scope > .map-cell:not(.live-piece-actor)")];
    [...cells.children].forEach((fresh, index) => {
      const cell = existing[index];
      if (!cell) return;
      for (const attribute of [...cell.attributes]) if (!fresh.hasAttribute(attribute.name)) cell.removeAttribute(attribute.name);
      for (const attribute of fresh.attributes) cell.setAttribute(attribute.name, attribute.value);
      if (cell.simulationVisualMarkup !== fresh.simulationVisualMarkup) {
        cell.replaceChildren(...fresh.childNodes);
        cell.simulationVisualMarkup = fresh.simulationVisualMarkup;
      }
      cell.disabled = interactive ? fresh.disabled : true;
    });
  } else if (live) {
    grid.replaceChildren(cells);
    grid.dataset.liveBoard = String(liveBoardSerial);
    if (interactive) [...grid.children].forEach((cell, index) => bindPlaytestCellInput(cell, index, true));
  } else {
    delete grid.dataset.liveBoard;
    grid.replaceChildren(cells);
  }
}

function validationBaselineKey(cave) {
  return `${STORAGE_KEY}:validation-v1:${cave.id}`;
}

function readValidationBaseline(cave) {
  try {
    return JSON.parse(localStorage.getItem(validationBaselineKey(cave)));
  } catch {
    return null;
  }
}

function showSimulation(playMode, dialogAlreadyOpen = false) {
  const cave = activeCave();
  const validation = validateCave(cave);
  const blocked = validation.errors.length > 0 || validation.unsupported.length > 0;
  $("simulationTitle").textContent = cave.name;
  const canPractice = playMode && !validation.errors.length;
  $("playtestGuide").hidden = !canPractice;
  $("playtestResetButton").hidden = !canPractice;
  $("playtestSpeedControl").hidden = !canPractice;
  $("usePlaytestResultButton").hidden = true;
  if (canPractice) {
    playtestState = createPlayState(cave, `playtest-${crypto.randomUUID()}`, true);
    playtestState.validation = validation;
    renderPlaytest();
  } else {
    playtestState = null;
    $("playtestPauseButton").hidden = true;
    $("playtestHintButton").hidden = true;
    $("playtestComboButton").hidden = true;
    const baseline = blocked ? null : readValidationBaseline(cave);
    const simulationCave = baseline ? { ...cave, randomSeed: baseline.seed } : cave;
    const batch = blocked ? null : runBatchSimulation(simulationCave, baseline?.runs ?? cave.simulationRuns);
    const objectiveSummary = cave.scoreTarget != null
      ? `${cave.scoreTarget}점 · 블록당 ${cave.pointsPerBlock}점`
      : cave.objectives.map((objective) => `${escapeHtml(objectiveLabel(objective))} × ${resolvedObjectiveCount(cave, objective)}`).join(" · ");
    const result = $("simulationResult");
    result.className = `simulation-result ${blocked ? "error" : validation.warnings.length ? "warning" : "success"}`;
    result.innerHTML = `
      <strong>${validation.unsupported.length ? "원본 동작 판정 미지원" : blocked ? "검증 실패" : "검증 통과"}</strong><br>
      ${batch ? `자동 플레이 난이도 <b>${batch.label}</b> · 휴리스틱 ${validation.analysis.label} (${validation.analysis.score}점)<br>` : `휴리스틱 난이도 ${validation.analysis.label} (${validation.analysis.score}점)<br>`}
      목표 ${objectiveSummary} · ${moveLimitSummary(cave)} · 권장 ${cave.parMoves}${cave.testClearMoves ? ` · 테스트 ${cave.testClearMoves}` : ""}<br>
      ${moveBudgetSummary(validation.analysis)} · Gravity ${cave.gravity}
      ${batch ? `<div class="batch-summary"><span><b>${batch.clearRate}%</b>클리어율 (${batch.wins}/${batch.runs})</span><span><b>${batch.average || "-"}</b>평균 Moves</span><span><b>${batch.median || "-"} / ${batch.p90 || "-"}</b>중앙 / 90%</span></div><div>${batch.runs}회 중 성공 ${batch.wins}회 · 이동 횟수 소진 ${batch.lost}회 · 가능한 매치 없음 ${batch.stuck}회 · 셔플 총 ${batch.shuffles}회</div><div>목표 우선 휴리스틱 자동 플레이 결과이며 실제 유저 난이도와는 차이가 날 수 있습니다.</div>` : ""}
      ${batch?.limited ? `<div>자동 검증 ${AUTO_UNLIMITED_TURN_LIMIT}턴 상한에 도달한 판 ${batch.limited}회</div>` : ""}
      ${issueHtml(validation)}
    `;
    if (batch) {
      if (baseline) {
        const comparison = document.createElement("p");
        comparison.textContent = `기준 → 현재 · 같은 시드 ${batch.runs}회 · 클리어율 ${baseline.clearRate}% → ${batch.clearRate}% · 이동 횟수 소진 ${baseline.lost} → ${batch.lost}회 · 가능한 매치 없음 ${baseline.stuck} → ${batch.stuck}회`;
        result.appendChild(comparison);
      }
      const baselineButton = document.createElement("button");
      baselineButton.type = "button";
      baselineButton.className = "button ghost";
      baselineButton.textContent = baseline ? "비교 기준 지우기" : "비교 기준으로 저장";
      baselineButton.addEventListener("click", () => {
        try {
          const key = validationBaselineKey(cave);
          if (baseline) localStorage.removeItem(key);
          else {
            const { runs, clearRate, lost, stuck } = batch;
            localStorage.setItem(key, JSON.stringify({ seed: simulationCave.randomSeed, runs, clearRate, lost, stuck }));
          }
        } catch {
          toast("비교 기준을 변경할 수 없습니다.");
          return;
        }
        showSimulation(false, true);
      });
      result.appendChild(baselineButton);
    }
    for (const example of batch?.examples || []) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button ghost";
      button.textContent = example.status === "lost" ? "이동 횟수 소진 판 다시 플레이" : "매치 없음 판 다시 플레이";
      button.addEventListener("click", () => startBatchReplay(simulationCave, validation, example));
      result.appendChild(button);
    }
    renderSimulationGrid(cave, false);
  }
  if (!dialogAlreadyOpen) $("simulationDialog").showModal();
}

function objectiveProgressHtml(state) {
  if (state.scoreTarget !== null) {
    return `<div>점수 <b>${state.blocksRemoved * state.pointsPerBlock}</b> / ${state.scoreTarget}</div>`;
  }
  return `<div class="objective-progress">${state.cave.objectives.map((objective, index) => {
    const progress = state.objectiveProgress[index];
    const image = editorGoalArt(objective);
    const label = (image ? `<img class="editor-goal-art" alt="" src="${escapeHtml(image)}">` : "") + escapeHtml(objectiveLabel(objective));
    if (state.goalLimitations[index]) return `<div class="objective-progress-row"><span>${label}</span><span></span><b>판정 미지원</b></div>`;
    const percent = progress.target === 0 ? 100 : Math.min(100, Math.round(progress.current / progress.target * 100));
    return `<div class="objective-progress-row"><span>${label}</span><i style="--progress:${percent}%"></i><b>${Math.min(progress.current, progress.target)} / ${progress.target}</b></div>`;
  }).join("")}</div>`;
}

function showPlaytestHint() {
  const state = playtestState;
  if (!state?.paused || state.status !== "playing" || state.animating) return;
  const action = findPlayableAction(state);
  if (!action) return;
  state.selectedIndex = null;
  state.comboMode = false;
  state.hint = action;
  state.message = action.second === undefined ? "강조된 특수 피스를 눌러 발동하세요." : "강조된 두 블록을 교환하세요.";
  renderPlaytest();
}

function cavesInRange(input) {
  const match = /^(\d+)(?:\s*[-~–]\s*(\d+))?$/.exec(input.trim());
  if (!match) return null;
  const first = parseCaveNumber(match[1]);
  const last = parseCaveNumber(match[2] ?? match[1]);
  if (!first || !last || first > last) return null;
  return project.caves.filter(({ number }) => number >= first && number <= last)
    .sort((a, b) => a.number - b.number);
}

function sortRangeRows(key) {
  const rows = $("rangeRows");
  const headers = $("rangeDialog").querySelectorAll("[data-range-sort]");
  for (const button of headers) {
    const header = button.closest("th");
    if (button.dataset.rangeSort === key) header.setAttribute("aria-sort", key === "stuck" ? "descending" : "ascending");
    else header.removeAttribute("aria-sort");
  }
  rows.dataset.sort = key;
  const ordered = Array.from(rows.rows).sort((a, b) => {
    if (key !== "number") {
      const first = a.dataset[key];
      const second = b.dataset[key];
      if (first === undefined && second !== undefined) return 1;
      if (second === undefined && first !== undefined) return -1;
      if (first !== undefined && second !== undefined && first !== second) {
        return key === "stuck" ? Number(second) - Number(first) : Number(first) - Number(second);
      }
    }
    return Number(a.dataset.number) - Number(b.dataset.number);
  });
  rows.append(...ordered);
}

function csvField(value) {
  return '"' + String(value ?? "").replace(/"/g, '""') + '"';
}

function matchesRangeFilter(row, filter) {
  switch (filter) {
    case "blocked": return row.dataset.clear === undefined;
    case "warnings": return Number(row.dataset.warnings) > 0;
    case "low": return row.dataset.clear !== undefined && Number(row.dataset.clear) < 0.3;
    default: return true;
  }
}

function applyRangeFilter() {
  const filter = $("rangeFilter").value;
  const rows = $("rangeRows").rows;
  let visible = 0;
  for (const row of rows) {
    row.hidden = !matchesRangeFilter(row, filter);
    if (!row.hidden) visible++;
  }
  $("rangeFilterCount").textContent = rows.length ? `${visible} / ${rows.length}개 표시` : "";
  $("rangeCsv").disabled = $("rangeStart").disabled || visible === 0;
}

function exportRangeCsv() {
  if ($("rangeCsv").disabled) return;
  const headers = ["Cave 번호", "이름", "실행 횟수", "성공", "클리어율", "이동 횟수 소진", "가능한 매치 없음", "검증 상태"];
  const rows = Array.from($("rangeRows").rows).filter((row) => !row.hidden).map((row) => JSON.parse(row.dataset.csv));
  const csv = [headers, ...rows].map((row) => row.map(csvField).join(",")).join("\r\n");
  downloadBlob(new Blob(["\uFEFF", csv, "\r\n"], { type: "text/csv;charset=utf-8" }), "cave-validation.csv");
}

async function validateCaveRange() {
  const start = $("rangeStart");
  if (start.disabled) return;
  const status = $("rangeStatus");
  const caves = cavesInRange($("rangeInput").value);
  if (!caves?.length) {
    status.textContent = caves ? "범위에 해당하는 Cave가 없습니다." : "Cave 번호를 1~20 형식으로 입력하세요.";
    return;
  }

  const dialog = $("rangeDialog");
  const rows = $("rangeRows");
  $("rangeCsv").disabled = true;
  rows.replaceChildren();
  sortRangeRows("number");
  start.disabled = true;
  applyRangeFilter();
  let canceled = false;
  dialog.addEventListener("close", () => { canceled = true; }, { once: true });
  try {
    for (const [index, cave] of caves.entries()) {
      status.textContent = `${index + 1} / ${caves.length} · Cave ${cave.number} 검증 중`;
      const validation = validateCave(cave);
      const blocked = validation.errors.length || validation.unsupported.length;
      const results = [];
      if (!blocked) {
        for (let run = 0; run < cave.simulationRuns; run += 1) {
          await new Promise((resolve) => setTimeout(resolve, 0));
          if (canceled || !dialog.open) return;
          results.push(runAutoGame(cave, run));
        }
      }
      const batch = blocked ? null : summarizeBatch(results);
      const row = rows.insertRow();
      row.dataset.number = cave.number;
      row.dataset.warnings = validation.warnings.length;
      // Protect spreadsheet users from formulas in imported Cave names.
      const csvName = /^[\s\uFEFF]*[=+@-]|^[\t\r\n]/.test(cave.name) ? "'" + cave.name : cave.name;
      const metrics = batch ? [batch.runs, batch.wins, batch.clearRate + "%", batch.lost, batch.stuck] : ["", "", "", "", ""];
      const resultStatus = batch ? "완료" : validation.errors.length ? "검증 오류" : "판정 미지원";
      row.dataset.csv = JSON.stringify([cave.number, csvName, ...metrics, resultStatus]);
      if (batch) {
        row.dataset.clear = batch.wins / batch.runs;
        row.dataset.stuck = batch.stuck;
      }
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button ghost";
      button.textContent = cave.number;
      button.setAttribute("aria-label", `Cave ${cave.number} 열기`);
      button.addEventListener("click", () => {
        dialog.close();
        $("caveJump").value = String(cave.number);
        jumpToCave();
      });
      row.insertCell().appendChild(button);
      row.insertCell().textContent = cave.name;
      const clearCell = row.insertCell();
      const outcome = batch ? `${batch.clearRate}% (${batch.wins}/${batch.runs})` : resultStatus;
      const issues = issueHtml(validation);
      if (issues) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = batch ? `${outcome} · 경고 ${validation.warnings.length}건` : outcome;
        const messages = document.createElement("div");
        messages.innerHTML = issues;
        details.append(summary, messages);
        clearCell.appendChild(details);
      } else {
        clearCell.textContent = outcome;
      }
      row.insertCell().textContent = batch?.lost ?? "—";
      row.insertCell().textContent = batch?.stuck ?? "—";
      if (rows.dataset.sort !== "number") sortRangeRows(rows.dataset.sort);
      applyRangeFilter();
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (canceled || !dialog.open) return;
    }
    status.textContent = `${caves.length}개 Cave 검증 완료`;
  } catch (error) {
    console.error(error);
    status.textContent = "검증 중 오류가 발생했습니다.";
  } finally {
    start.disabled = false;
    if (status.textContent.endsWith("검증 완료")) applyRangeFilter();
  }
}

function runBatchSimulation(cave, runs) {
  const results = [];
  for (let index = 0; index < runs; index += 1) results.push(runAutoGame(cave, index));
  return summarizeBatch(results);
}

function summarizeBatch(results) {
  const runs = results.length;
  const wins = results.filter((result) => result.status === "won");
  const moves = wins.map((result) => result.moves).sort((a, b) => a - b);
  const average = moves.length ? moves.reduce((sum, value) => sum + value, 0) / moves.length : 0;
  const percentile = (ratio) => moves.length ? moves[Math.min(moves.length - 1, Math.floor((moves.length - 1) * ratio))] : 0;
  const clearRate = Math.round(wins.length / runs * 100);
  const label = clearRate >= 80 ? "Easy" : clearRate >= 55 ? "Normal" : clearRate >= 30 ? "Hard" : clearRate > 0 ? "Expert" : "미클리어";
  return {
    runs,
    examples: ["lost", "stuck"].map((status) => results.find((result) => result.status === status)).filter(Boolean),
    wins: wins.length,
    lost: results.filter((result) => result.status === "lost").length,
    stuck: results.filter((result) => result.status === "stuck").length,
    limited: results.filter((result) => result.status === "limit").length,
    shuffles: results.reduce((total, result) => total + (result.shuffles || 0), 0),
    clearRate,
    average: Number(average.toFixed(1)),
    median: percentile(0.5),
    p90: percentile(0.9),
    label,
  };
}

function startBatchReplay(cave, validation, example) {
  playtestState = createPlayState(cave, `batch-${example.runIndex}`);
  playtestState.validation = validation;
  playtestState.replay = { cave, example };
  $("playtestGuide").hidden = false;
  $("playtestResetButton").hidden = false;
  $("playtestSpeedControl").hidden = false;
  renderPlaytest();
  runAnimatedPlaytest(playtestState);
}

function animateBeeFlights(grid, cave, flights, duration) {
  const board = grid.getBoundingClientRect();
  const stagger = Math.min(32, duration * 0.1 / Math.max(1, flights.length - 1));
  for (const [order, { from, to, color, pieceType }] of flights.entries()) {
    const start = grid.children[from].getBoundingClientRect();
    const end = grid.children[to].getBoundingClientRect();
    const size = start.width * 0.86;
    const x = end.left + end.width / 2 - start.left - start.width / 2;
    const y = end.top + end.height / 2 - start.top - start.height / 2;
    const lift = Math.min(start.height, Math.hypot(x, y) * 0.28);
    const sprite = document.createElement("span");
    const fallback = document.createElement("span");
    sprite.className = "playtest-turn-actor playtest-bee-flight";
    sprite.dataset.beeFrom = from;
    sprite.dataset.beeTo = to;
    sprite.setAttribute("aria-hidden", "true");
    sprite.style.left = `${start.left - board.left - grid.clientLeft + (start.width - size) / 2}px`;
    sprite.style.top = `${start.top - board.top - grid.clientTop + (start.height - size) / 2}px`;
    sprite.style.width = sprite.style.height = `${size}px`;
    sprite.style.fontSize = `${size * 0.8}px`;
    sprite.style.lineHeight = "1";
    sprite.style.opacity = "0";
    fallback.textContent = "🐝";
    sprite.append(fallback);
    const specials = puzzleArtwork?.specials;
    const source = specials?.[pieceType] || specials?.fish;
    const showDefault = () => {
      fallback.hidden = false;
      showDdungSpecialImage(sprite, { type: "bee" }, color ?? cave.layers.block[from], null, fallback);
    };
    if (source) {
      fallback.hidden = true;
      showObjectImage(sprite, source).addEventListener("error", showDefault, { once: true });
    } else showDefault();
    grid.append(sprite);
    const animation = sprite.animate([
      { transform: "translate(0, 0) scale(0.8)", opacity: 1 },
      { transform: `translate(${x * 0.5}px, ${y * 0.5 - lift}px) scale(1.14)`, offset: 0.5 },
      { transform: `translate(${x}px, ${y}px) scale(0.8)`, opacity: 1 },
    ], { delay: order * stagger, duration: duration - order * stagger, fill: "forwards", easing: "ease-in-out" });
    // Live rendering retains the board nodes between waves. The flight owns its
    // lifetime; waiting for the next board replacement leaves a bee on its target.
    animation.finished.then(() => sprite.remove(), () => sprite.remove());
  }
}

function animateDdungTurnActor(grid, { type, index }, duration) {
  const cell = grid.children[index];
  if (!cell) return;
  const board = grid.getBoundingClientRect();
  const target = cell.getBoundingClientRect();
  const sprite = document.createElement("img");
  sprite.className = "playtest-turn-actor";
  sprite.alt = "";
  sprite.src = `./art/ddung/turn-${type}.webp`;
  const options = { duration, fill: "both" };
  const width = target.width * (type === "mouse" ? 1.2 : 1.05);
  sprite.style.width = `${width}px`;
  const y = target.top - board.top - grid.clientTop;
  if (type === "mouse") {
    sprite.style.left = `${board.width - width}px`;
    sprite.style.top = `${y - target.height * 0.45}px`;
    grid.appendChild(sprite);
    const animation = sprite.animate([
      { transform: "translateX(0)", opacity: 0, offset: 0 },
      { opacity: 1, offset: 0.12 },
      { opacity: 1, offset: 0.84 },
      { transform: `translateX(${width - board.width}px)`, opacity: 0, offset: 1 },
    ], options);
    animation.finished.then(() => sprite.remove(), () => sprite.remove());
    return;
  }

  const lift = y + target.height * 0.6;
  const center = target.left - board.left - grid.clientLeft + target.width / 2;
  const thread = document.createElement("span");
  thread.className = "playtest-spider-thread";
  thread.style.left = `${center}px`;
  thread.style.height = `${lift}px`;
  sprite.style.left = `${center - width / 2}px`;
  sprite.style.top = `${y - target.height * 0.48}px`;
  grid.append(thread, sprite);
  const raised = `translateY(-${lift}px)`;
  const animation = sprite.animate([
    { transform: raised, opacity: 0, offset: 0 },
    { transform: "translateY(0)", opacity: 1, offset: 0.48 },
    { transform: "translateY(0)", opacity: 1, offset: 0.62 },
    { transform: raised, opacity: 0, offset: 1 },
  ], options);
  const removeActor = () => { sprite.remove(); thread.remove(); };
  animation.finished.then(removeActor, removeActor);
  thread.animate([
    { transform: "scaleY(0)", offset: 0 },
    { transform: "scaleY(1)", offset: 0.48 },
    { transform: "scaleY(1)", offset: 0.62 },
    { transform: "scaleY(0)", offset: 1 },
  ], options);
  const blockAnimation = cell.querySelector(".cell-block")?.animate([
    { transform: "translateY(0)", opacity: 1, offset: 0 },
    { transform: "translateY(0)", opacity: 1, offset: 0.62 },
    { transform: raised, opacity: 0, offset: 1 },
  ], options);
  // The web-animation fill must not hide a replacement block after the spider leaves.
  blockAnimation?.finished.then(() => blockAnimation.cancel(), () => {});
}

function playtestIsVisible() {
  return document.body.dataset.puzzlePlayer !== undefined || $("simulationDialog").open;
}

function animateFrameMotions(grid, cave, motions, duration, revealDelay = 0) {
  const gravityOffset = { down: [0, -18], up: [0, 18], left: [18, 0], right: [-18, 0] };
  const directions = motions.some(({ spawned }) => spawned) ? ddungCellGravities(cave) : null;
  for (const { from, to, spawned } of motions) {
    const cell = grid.children[to];
    if (!cell || !grid.children[from]) continue;
    const start = grid.children[from].getBoundingClientRect();
    const end = cell.getBoundingClientRect();
    const [spawnX, spawnY] = spawned ? gravityOffset[directions?.[from] || cave.gravity] : [0, 0];
    cell.querySelectorAll(".cell-block, .initial-piece-badge").forEach((visual) => visual.animate([
      { transform: `translate(${start.left - end.left + spawnX}px, ${start.top - end.top + spawnY}px)`, opacity: spawned || revealDelay ? 0 : 1 },
      { transform: "translate(0, 0)", opacity: 1 },
    ], { duration, delay: revealDelay, fill: "backwards", easing: "ease-out" }));
  }
}

function playtestFrameDuration(kind, delay, speed) {
  return (kind === "fall" || kind === "refill" ? delay * (4 / 3) : delay) / speed;
}

async function showPlaytestFrames(state, turn, frames) {
  for (const frame of frames) {
    if (state.animationTurn !== turn || playtestState !== state || !playtestIsVisible()) return;
    renderSimulationGrid(frame.cave, false, [], frame);
    const grid = $("simulationGrid");
    $("playtestFrameStatus").textContent = frame.label;
    refreshPlaytestMoves({ ...state, clearBonus: frame.clearBonus });
    const speed = Number($("playtestSpeed").value) || 1;
    const delay = playtestFrameDuration(frame.kind, frame.delay, speed);
    for (const index of frame.cells) grid.children[index]?.classList.add("playtest-frame-" + frame.kind);
    if (frame.kind === "bonus") animateBonusCells(grid, frame.cells, delay);
    animateFrameMotions(grid, frame.cave, frame.motions, delay);
    if (frame.turnActor?.type === "bee") animateBeeFlights(grid, frame.cave, frame.turnActor.flights, delay);
    else if (frame.turnActor) animateDdungTurnActor(grid, frame.turnActor, delay);
    if (frame.burst?.length) puzzleBurst?.(grid, frame.burst.map(({ index, block }) => ({ index, color: blockColor(block) })));
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
}

let liveBoardSerial = 0;

function livePieceSprite(cave, index) {
  const sprite = document.createElement("span");
  sprite.className = "map-cell live-piece-actor";
  applyCellVisual(sprite, cave, index);
  sprite.replaceChildren(...sprite.querySelectorAll(".cell-block, .initial-piece-badge"));
  return sprite;
}

function positionLiveSprite(sprite, cell, left = cell.offsetLeft, top = cell.offsetTop) {
  Object.assign(sprite.style, { left: `${left}px`, top: `${top}px`,
    width: `${cell.offsetWidth}px`, height: `${cell.offsetHeight}px` });
}

function drawLiveMotions(state) {
  const grid = $("simulationGrid");
  const live = state.liveSession;
  const cells = [...grid.querySelectorAll(":scope > .map-cell:not(.live-piece-actor)")];
  const existing = new Map([...grid.querySelectorAll("[data-live-piece]")].map((sprite) => [Number(sprite.dataset.livePiece), sprite]));
  for (const [id, motion] of live.motions) {
    const to = cells[motion.to];
    const from = cells[motion.from];
    if (!to || !from) continue;
    let sprite = existing.get(id);
    if (!sprite) {
      sprite = livePieceSprite(state.cave, motion.to);
      sprite.dataset.livePiece = id;
      sprite.addEventListener("click", (event) => {
        event.stopPropagation();
        const current = live.motions.get(id);
        if (current && live.canTap(current.to)) playtestCell(current.to);
      });
      grid.append(sprite);
    }
    existing.delete(id);
    sprite.dataset.liveMotion = motion.warp ? "portal" : motion.kind || (motion.spawned ? "spawn" : "straight");
    sprite.dataset.fromCell = motion.from;
    sprite.dataset.toCell = motion.to;
    sprite.dataset.targetCell = motion.target ?? motion.to;
    const gravity = ddungCellGravities(state.cave)?.[motion.to] || state.cave.gravity;
    const offset = { down: [0, -1], up: [0, 1], left: [1, 0], right: [-1, 0] }[gravity];
    const left = from.offsetLeft + (motion.spawned ? offset[0] * from.offsetWidth : 0);
    const top = from.offsetTop + (motion.spawned ? offset[1] * from.offsetHeight : 0);
    positionLiveSprite(sprite, to, left + (to.offsetLeft - left) * motion.progress,
      top + (to.offsetTop - top) * motion.progress);
    sprite.classList.toggle("live-special-actor", live.canTap(motion.to));
    sprite.style.opacity = motion.warp ? String(Math.abs(motion.progress - 0.5) * 2) : "1";
  }
  for (const sprite of existing.values()) sprite.remove();
  syncLiveSwapVisibility(grid);
}

function syncLiveSwapVisibility(grid) {
  const covered = new Set([...grid.querySelectorAll(":scope > .live-swap-actor")]
    .map((sprite) => Number(sprite.dataset.swapCell)));
  [...grid.querySelectorAll(":scope > .map-cell:not(.live-piece-actor)")]
    .forEach((cell, index) => cell.classList.toggle("live-swap-covered", covered.has(index)));
}

function showLiveEffects(state, frames) {
  const grid = $("simulationGrid");
  const speed = Number($("playtestSpeed").value) || 1;
  for (const frame of frames) {
    if (frame.kind === "bonus") {
      setTimeout(() => {
        if (playtestState === state && playtestIsVisible()) animateBonusCells(grid, frame.cells, frame.delay / speed);
      }, frame.at / speed);
    }
    if (frame.turnActor?.type === "bee") {
      setTimeout(() => {
        if (playtestState === state && playtestIsVisible()) animateBeeFlights(grid, frame.cave, frame.turnActor.flights, frame.delay / speed);
      }, frame.at / speed);
    } else if (frame.turnActor) {
      setTimeout(() => {
        if (playtestState === state && playtestIsVisible()) animateDdungTurnActor(grid, frame.turnActor, frame.delay / speed);
      }, frame.at / speed);
    }
    if (frame.burst?.length) {
      for (const { index } of frame.burst) {
        const cell = grid.children[index];
        if (!cell) continue;
        const sprite = livePieceSprite(frame.cave, index);
        sprite.classList.add("live-burst-actor");
        if (frame.at) {
          sprite.style.visibility = "hidden";
          setTimeout(() => { sprite.style.visibility = "visible"; }, frame.at / speed);
        }
        positionLiveSprite(sprite, cell);
        grid.append(sprite);
        const animation = sprite.animate([
          { opacity: 1, transform: "scale(1)" }, { opacity: 0, transform: "scale(0.55)" },
        ], { duration: frame.delay / speed, delay: frame.at / speed, fill: "both", easing: "ease-in" });
        animation.finished.then(() => sprite.remove(), () => sprite.remove());
      }
      setTimeout(() => {
        if (playtestState === state && playtestIsVisible()) puzzleBurst?.(grid,
          frame.burst.map(({ index, block }) => ({ index, color: blockColor(block) })));
      }, frame.at / speed);
    }
    if (frame.kind === "swap" && frame.motions.length) {
      for (const { from, to } of frame.motions) {
        if (!frame.cave.layers.block[to]) continue;
        const source = grid.children[from];
        const target = grid.children[to];
        if (!source || !target) continue;
        const sprite = livePieceSprite(frame.cave, to);
        sprite.classList.add("live-swap-actor");
        sprite.dataset.swapCell = to;
        // A delayed return must not paint its first frame over the outgoing
        // swap. Only the actor for the currently running leg is visible.
        sprite.style.visibility = "hidden";
        positionLiveSprite(sprite, target);
        grid.append(sprite);
        const animation = sprite.animate([
          { visibility: "visible", transform: `translate(${source.offsetLeft - target.offsetLeft}px, ${source.offsetTop - target.offsetTop}px)` },
          { visibility: "visible", transform: "translate(0, 0)" },
        ], { duration: frame.delay / speed, delay: frame.at / speed, fill: "none", easing: "ease-in-out" });
        const cleanup = () => { sprite.remove(); syncLiveSwapVisibility(grid); };
        animation.finished.then(cleanup, cleanup);
      }
    }
  }
  syncLiveSwapVisibility(grid);
}

function animateBonusCells(grid, cells, duration) {
  for (const index of cells) {
    grid.children[index]?.querySelector(".cell-block")?.animate([
      { transform: "scale(0.65)", filter: "brightness(1.8)" },
      { transform: "scale(1.18)", filter: "brightness(1.3)", offset: 0.65 },
      { transform: "scale(1)", filter: "brightness(1)" },
    ], { duration: Math.max(150, duration), easing: "ease-out" });
  }
}

function startLivePlaytest(state, action) {
  if (!state.liveSession) {
    liveBoardSerial++;
    state.liveSession = createLiveGame(state, gameEngine, {
      effects: (frames) => showLiveEffects(state, frames),
      changed: () => {
        if (playtestState !== state || !playtestIsVisible()) return;
        renderPlaytest();
        drawLiveMotions(state);
      },
    });
    renderPlaytest();
  }
  if (!state.liveSession.submit(action)) return;
  if (state.liveAnimationFrame) return;
  let previous = performance.now();
  const tick = (now) => {
    if (playtestState !== state || !playtestIsVisible()) {
      state.liveSession.stop();
      state.liveAnimationFrame = null;
      return;
    }
    const seconds = Math.min((now - previous) / 1000, 0.05);
    previous = now;
    if (!document.hidden) state.liveSession.tick(seconds * (Number($("playtestSpeed").value) || 1));
    drawLiveMotions(state);
    state.liveAnimationFrame = state.liveSession.active ? requestAnimationFrame(tick) : null;
  };
  state.liveAnimationFrame = requestAnimationFrame(tick);
}

async function animatePlaytestTurn(state, action) {
  if ((project.swapDuringEffects || state.liveSession) && !state.replay) {
    startLivePlaytest(state, action);
    return;
  }
  const turn = Symbol();
  state.animationTurn = turn;
  state.animating = true;
  const frames = [];
  const capture = (label, cells, kind, delay = 360, motions = [], turnActor = null, burst = null, cleared = []) => {
    const layers = Object.fromEntries(Object.entries(state.cave.layers).map(([layer, values]) => [layer, [...values]]));
    const playtestPieces = [...state.cave.playtestPieces];
    for (const index of cleared) { layers.block[index] = null; playtestPieces[index] = null; }
    frames.push({ cave: { ...state.cave, layers, playtestPieces }, clearBonus: state.clearBonus && { remaining: state.clearBonus.remaining },
      terrainHits: [...state.terrainHits], gimmickHits: [...state.gimmickHits], label, cells, kind, delay, motions, turnActor, burst });
  };
  try {
    playSimulationTurn(state, action, capture);
    gameEngine.playClearBonus(state, capture);
    refreshPlaytestMoves(state);
    await showPlaytestFrames(state, turn, frames);
  } finally {
    if (state.animationTurn === turn) {
      state.animating = false;
      if (playtestState === state && playtestIsVisible()) renderPlaytest();
    }
  }
}

function refreshPlaytestMoves(state) {
  const moves = $("movesLeft") || $("playtestMovesRemaining");
  if (moves) {
    const remaining = state.clearBonus?.remaining ?? state.movesLeft;
    moves.textContent = remaining === null ? "무제한"
      : moves.id === "movesLeft" ? remaining : `${remaining} / ${state.cave.moveLimit}`;
  }
  const used = $("playtestMovesUsed");
  if (used) used.textContent = state.movesUsed;
}



async function runAnimatedPlaytest(state) {
  if (state.running) return;
  state.running = true;
  try {
    while (playtestState === state && $("simulationDialog").open && !state.paused && state.status === "playing") {
      // Keep the settled board available for clicks before the next automatic turn.
      await new Promise((resolve) => setTimeout(resolve, 900 / (Number($("playtestSpeed").value) || 1)));
      if (playtestState !== state || !$("simulationDialog").open || state.paused || state.status !== "playing") break;
      if (!state.animating) await animatePlaytestTurn(state, chooseAutoAction(state));
    }
  } finally {
    state.running = false;
  }
}

function togglePlaytestPause() {
  const state = playtestState;
  if (!state || state.status !== "playing") return;
  state.paused = !state.paused;
  state.comboMode = false;
  state.hint = null;
  state.selectedIndex = null;
  state.message = state.paused ? "교환할 인접 블록 두 개를 클릭하세요." : "자동 플레이 중입니다.";
  $("playtestPauseButton").textContent = state.paused ? "자동 플레이 시작" : "직접 플레이로 전환";
  if (!state.animating) renderPlaytest();
  if (!state.paused) runAnimatedPlaytest(state);
}

function togglePlaytestCombo() {
  const state = playtestState;
  if (!state?.paused || state.status !== "playing" || state.animating) return;
  state.comboMode = !state.comboMode;
  state.selectedIndex = null;
  state.hint = null;
  state.message = state.comboMode ? "서로 붙어 있는 특수 피스 두 개를 차례로 클릭하세요." : "교환할 인접 블록 두 개를 클릭하세요.";
  renderPlaytest();
}

function bindPlaytestCellInput(cell, index, canSwap) {
  let pointer = null;
  let dragged = false;
  let handledTouch = false;
  let pointerPieceId;
  const dragThreshold = 10;
  if (canSwap) cell.classList.add("playtest-draggable");
  cell.addEventListener("pointerdown", (event) => {
    if (!event.isPrimary || (event.pointerType !== "touch" && event.button !== 0)) return;
    handledTouch = false;
    dragged = false;
    if (!canSwap && event.pointerType !== "touch") return;
    pointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    const state = playtestState;
    if (state?.liveSession) {
      if (!state.liveSession.canSwap(index) && !state.liveSession.canTap(index)) { pointer = null; return; }
      pointerPieceId = state.cave.livePieceIds[index];
    }
    cell.setPointerCapture(event.pointerId);
  });
  cell.addEventListener("pointermove", (event) => {
    if (pointer?.id !== event.pointerId) return;
    dragged ||= Math.max(Math.abs(event.clientX - pointer.x), Math.abs(event.clientY - pointer.y)) >= dragThreshold;
  });
  cell.addEventListener("pointerup", (event) => {
    if (pointer?.id !== event.pointerId) return;
    const dx = event.clientX - pointer.x;
    const dy = event.clientY - pointer.y;
    pointer = null;
    const distance = Math.max(Math.abs(dx), Math.abs(dy));
    dragged ||= distance >= dragThreshold;
    handledTouch = event.pointerType === "touch";
    if (playtestState?.liveSession && playtestState.cave.livePieceIds[index] !== pointerPieceId) return;
    if (!dragged) {
      if (handledTouch) playtestCell(index);
      return;
    }
    if (!canSwap || distance < dragThreshold) return;
    const state = playtestState;
    if (!state?.paused || state.status !== "playing" || (state.animating && !state.liveSession)) return;
    if (state.liveSession && state.cave.livePieceIds[index] !== pointerPieceId) return;
    const { width, height } = state.cave;
    const horizontal = Math.abs(dx) >= Math.abs(dy);
    const x = index % width + (horizontal ? Math.sign(dx) : 0);
    const y = Math.floor(index / width) + (horizontal ? 0 : Math.sign(dy));
    if (x >= 0 && x < width && y >= 0 && y < height) playtestSwap(state, index, y * width + x);
  });
  const cancelPointer = () => { pointer = null; };
  cell.addEventListener("pointercancel", cancelPointer);
  cell.addEventListener("lostpointercapture", cancelPointer);
  cell.addEventListener("click", (event) => {
    if (event.pointerType === "touch" || ((handledTouch || dragged) && event.detail !== 0)) return;
    if (event.detail !== 0 && playtestState?.liveSession && pointerPieceId !== undefined &&
        playtestState.cave.livePieceIds[index] !== pointerPieceId) return;
    playtestCell(index);
  });
}

function playtestSwap(state, first, second) {
  if (state.liveSession) { startLivePlaytest(state, { first, second }); return; }
  if (state.animating) return;
  const action = getPlaytestSwapAction(state.cave, first, second);
  if (!action) return;
  state.selectedIndex = null;
  state.hint = null;
  state.comboMode = false;
  animatePlaytestTurn(state, action);
}

function getPlaytestSwapAction(cave, first, second) {
  if (!neighborsOf(cave, first).includes(second) ||
      [first, second].some((index) => !cave.layers.block[index] || isSwapBlocked(cave, index))) return;
  if (canCombineSpecials(cave, first, second)) return { first, second, combo: true };
  swapPlaytestBlocks(cave, first, second);
  const matches = findMatches(cave);
  swapPlaytestBlocks(cave, first, second);
  return { first, second, invalid: !matches.has(first) && !matches.has(second) };
}

function playtestSpecialAt(cave, index) {
  return cave.layers.block[index] && !isBarrier(cave, index) && specialEffect(cave, cave.playtestPieces[index]);
}

function playtestCell(index) {
  const state = playtestState;
  if (!state || state.status !== "playing") return;
  if (state.liveSession) {
    const live = state.liveSession;
    if (bombPanelReady(state, index) && live.canSwap(index, true)) startLivePlaytest(state, { first: index, bombPanel: true });
    else if (live.canTap(index) && !state.comboMode) startLivePlaytest(state, { first: index });
    else {
      const first = state.selectedIndex;
      if (first !== null && neighborsOf(state.cave, first).includes(index) && live.canSwap(index, true)) {
        playtestSwap(state, first, index);
      } else if (live.canSwap(index)) {
        state.selectedIndex = first === index ? null : index;
        renderPlaytest();
        drawLiveMotions(state);
      }
    }
    return;
  }
  if (state.animating) return;
  const cave = state.cave;
  if (bombPanelReady(state, index)) {
    state.selectedIndex = null;
    state.hint = null;
    state.comboMode = false;
    animatePlaytestTurn(state, { first: index, bombPanel: true });
    return;
  }
  if (isBarrier(cave, index) || !cave.layers.block[index]) return;
  state.hint = null;

  if (state.comboMode) {
    if (isSwapBlocked(cave, index)) {
      state.message = "교환할 수 있는 칸을 선택하세요.";
    } else if (state.selectedIndex === index) {
      state.selectedIndex = null;
      state.message = "선택을 취소했습니다.";
    } else if (state.selectedIndex === null) {
      const effect = specialEffect(cave, cave.playtestPieces[index]);
      if (effect) state.selectedIndex = index;
      state.message = effect === "color" ? "오색 피스에 붙어 있는 일반 블록이나 특수 피스를 클릭하세요."
        : effect ? "선택한 피스에 붙어 있는 특수 피스를 클릭하세요." : "먼저 특수 피스를 선택하세요.";
    } else if (canCombineSpecials(cave, state.selectedIndex, index)) {
      const action = { first: state.selectedIndex, second: index, combo: true };
      state.selectedIndex = null;
      state.comboMode = false;
      animatePlaytestTurn(state, action);
      return;
    } else {
      state.message = "가로·세로로 붙은 특수 피스끼리 또는 오색 피스와 일반 블록을 조합하세요.";
    }
    renderPlaytest();
    return;
  }

  if (playtestSpecialAt(cave, index)) {
    state.selectedIndex = null;
    const action = { first: index };
    animatePlaytestTurn(state, action);
    return;
  }
  if (!state.paused || isSwapBlocked(cave, index)) return;

  const first = state.selectedIndex;
  state.selectedIndex = null;
  if (first === index) {
    state.message = "선택을 취소했습니다.";
  } else if (first === null || !neighborsOf(cave, first).includes(index)) {
    state.selectedIndex = index;
    state.message = "교환할 인접 블록을 클릭하세요.";
  } else {
    playtestSwap(state, first, index);
    return;
  }
  renderPlaytest();
}

function playtestRemainingTargets(state) {
  return state.cave.objectives.map((objective, index) => {
    const { current, target } = state.objectiveProgress[index];
    return { objective, remaining: Math.max(0, target - current), unsupported: state.goalLimitations[index] };
  }).filter(({ remaining, unsupported }) => remaining > 0 && !unsupported);
}

function renderPlaytest() {
  if (puzzleView) return puzzleView();
  $("playtestFrameStatus").textContent = "";
  const state = playtestState;
  if (!state) return;
  const failed = state.status === "lost" || state.status === "stuck";
  const remainingTargets = failed && state.scoreTarget === null ? playtestRemainingTargets(state) : [];
  const displayRemaining = state.clearBonus?.remaining ?? state.movesLeft;
  const movesRemaining = displayRemaining === null ? "무제한" : `${displayRemaining} / ${state.cave.moveLimit}`;
  const practice = state.scoreTarget === null && state.goalLimitations.some(Boolean);
  const flowLabels = { royal: "원작 방식 · 직선 우선/후보 탐색", none: "우회 없음" };
  const result = $("simulationResult");
  result.className = `simulation-result ${state.status === "won" ? "success" : ["lost", "stuck"].includes(state.status) ? "error" : "warning"}`;
  result.innerHTML = `
    <strong>${practice ? "PLAYTEST 연습 · 클리어 판정 미지원" : state.status === "won" ? "PLAYTEST 성공" : ["lost", "stuck"].includes(state.status) ? "PLAYTEST 실패" : "PLAYTEST 진행 중"}</strong><br>
    남은 이동 <b id="playtestMovesRemaining">${movesRemaining}</b> · 사용 <span id="playtestMovesUsed">${state.movesUsed}</span>회 · 셔플 ${state.shuffleCount}회<br>
    ${objectiveProgressHtml(state)}
    Gravity ${state.cave.gravity} · 막힘 우회 ${flowLabels[state.cave.flowRule]}<br>
    ${failed ? `<strong>${state.status === "lost" && state.movesLeft === 0 ? "이동 횟수 소진" : escapeHtml(state.message)}</strong>` : escapeHtml(state.message)}
    ${remainingTargets.length ? `<ul aria-label="남은 목표">${remainingTargets.map(({ objective, remaining }) =>
      `<li>${escapeHtml(objectiveLabel(objective))} · ${remaining}개 남음</li>`).join("")}</ul>` : ""}
    ${practice ? issueHtml({ errors: [], warnings: [], unsupported: state.validation.unsupported }) : ""}
  `;
  $("usePlaytestResultButton").hidden = state.status !== "won";
  const pause = $("playtestPauseButton");
  pause.hidden = state.status !== "playing";
  $("playtestHintButton").hidden = !state.paused || state.status !== "playing";
  const comboButton = $("playtestComboButton");
  comboButton.hidden = !state.paused || state.status !== "playing" || Boolean(state.replay);
  comboButton.setAttribute("aria-pressed", Boolean(state.comboMode));
  comboButton.textContent = state.comboMode ? "조합 취소" : "특수 피스 조합";
  pause.textContent = state.paused ? "자동 플레이 시작" : "직접 플레이로 전환";
  renderSimulationGrid(state.cave, state.status === "playing", remainingTargets);
}

function resetPlaytest() {
  if (!playtestState) return;
  if (playtestState.replay) {
    const { cave, example } = playtestState.replay;
    startBatchReplay(cave, playtestState.validation, example);
    return;
  }
  const cave = activeCave();
  playtestState = createPlayState(cave, `playtest-${crypto.randomUUID()}`, true);
  playtestState.validation = validateCave(cave);
  $("usePlaytestResultButton").hidden = true;
  renderPlaytest();
}

function usePlaytestResult() {
  if (!playtestState || playtestState.status !== "won") return;
  const usedMoves = playtestState.movesUsed;
  snapshot();
  activeCave().testClearMoves = usedMoves;
  renderRules(); persist();
  toast(`${usedMoves} Moves 기록을 난이도 계산에 반영했습니다.`);
  $("simulationDialog").close();
}

function setContentVersion(value) {
  const version = value.trim() || "V0001";
  if (version !== project.version) {
    snapshot();
    project.version = version;
    persist();
  }
  $("versionInput").value = project.version;
}

function stepContentVersion(delta) {
  const match = /^(.*?)(\d+)$/.exec(project.version);
  if (!match) return toast("버전 끝에 숫자를 입력하세요.");
  const [, prefix, digits] = match;
  const number = BigInt(digits) + BigInt(delta);
  if (number < 0n) return;
  const version = prefix + String(number).padStart(digits.length, "0");
  if (version.length <= $("versionInput").maxLength) setContentVersion(version);
}

function downloadJson(payload, filename) {
  downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function isGridTilesProfile(source) {
  return Array.isArray(source?.grid?.tiles) && source.grid.tiles.length > 0 &&
    source.grid.tiles.every((row) => Array.isArray(row) && row.every((tile) => tile == null || typeof tile === "string")) &&
    (source.specialTiles === undefined || Array.isArray(source.specialTiles));
}

function buildGridTilesExport(cave) {
  const source = deepCopy(cave.externalSource.gridTilesTemplate);
  if (cave.excludedCells?.length || ["terrain", "item", "gimmick"].some((layer) => cave.layers[layer].some(Boolean))) {
    throw new Error("이 형식에는 비활성 칸, 지형, 아이템 및 기믹을 저장할 수 없습니다.");
  }
  if (cave.objectives.some((goal) => goal.layer !== "block")) {
    throw new Error("이 형식에는 블록 수집 목표만 저장할 수 있습니다.");
  }
  source.grid.rows = cave.height;
  source.grid.columns = cave.width;
  const originalRows = source.grid.tiles;
  source.grid.tiles = Array.from({ length: cave.height }, (_, row) =>
    Array.from({ length: cave.width }, (_, col) => {
      const tile = originalRows[row]?.[col];
      const block = cave.layers.block[row * cave.width + col];
      return block && normalizeAssetId("block", tile) === block ? tile : block ?? null;
    })
  );
  const originalSpecials = new Map((source.specialTiles || []).map((tile) => [tile.row + ":" + tile.col, tile]));
  source.specialTiles = [];
  for (let index = 0; index < cave.width * cave.height; index++) {
    const piece = initialPieceAt(cave, index);
    if (!piece || !cave.layers.block[index]) continue;
    const row = Math.floor(index / cave.width);
    const col = index % cave.width;
    source.specialTiles.push({ ...originalSpecials.get(row + ":" + col), row, col, type: piece.type });
  }
  const collect = {};
  for (const goal of cave.objectives) collect[goal.targetId] = (collect[goal.targetId] || 0) + resolvedObjectiveCount(cave, goal);
  source.goals = { ...source.goals, moves: cave.moveLimit, collect };
  if (cave.initialPieceDefinitions?.some((entry) => entry.effect)) source.initialPieceDefinitions = cave.initialPieceDefinitions;
  if (cave.specialMatches === false || Object.hasOwn(source, "specialMatches")) source.specialMatches = cave.specialMatches;
  return source;
}

function buildDdungLevelExport(cave) {
  const source = deepCopy(cave.externalSource.rawMap);
  const baseline = adaptDdungMapInfo(source, 0, cave.externalSource.format, new Set(), () => new Set());
  const fields = ["width", "height", "layers", "excludedCells", "objectives", "usableBlocks", "blockWeights", "gravity", "initialPieceTypes"];
  if (fields.some((key) => JSON.stringify(cave[key]) !== JSON.stringify(baseline[key]))) {
    throw new Error("이 레벨의 보드나 목표 편집은 DDUNG 형식으로 변환할 수 없습니다. 프로젝트 내보내기로 저장하세요.");
  }
  if (cave.initialPieceDefinitions?.some((entry) => entry.effect && entry.effect !== "none")) {
    throw new Error("특수 피스 동작 설정은 전체 레벨 JSON으로 저장하세요.");
  }
  const settings = cave.levelSettings;
  const before = baseline.levelSettings;
  if (cave.moveLimit !== baseline.moveLimit) source.count = cave.moveLimit;
  if (settings.difficulty !== before.difficulty) source.levelclass = settings.difficulty;
  if (settings.spawnMode !== before.spawnMode) {
    if (settings.spawnMode !== 0 && !/^\d{12}$/.test(String(source.objectpercent || ""))) {
      throw new Error("DDUNG 확률방식에는 원본 색별 확률 데이터가 필요합니다.");
    }
    source.objectcreate = settings.spawnMode;
  }
  if (JSON.stringify(settings.starScores) !== JSON.stringify(before.starScores)) {
    if (settings.starScores.some((score) => !Number.isInteger(score) || score < 0 || score > 999999)) {
      throw new Error("DDUNG 별 점수는 세 기준 모두 0~999999 사이로 입력하세요.");
    }
    source.starscores = settings.starScores.map((score, index) =>
      String(index + 1).padStart(2, "0") + String(score).padStart(6, "0")
    ).join("");
  }
  return { version: cave.externalSource.ddungVersion ?? project.version, mapinfos: [source] };
}

function exportGridTilesProfile() {
  const cave = activeCave();
  try {
    const goalIds = cave.objectives.map(({ targetId }) => targetId);
    const needsWindyGoals = cave.objectives.some(({ countMode }) => countMode === "auto-map") ||
      new Set(goalIds).size !== goalIds.length;
    if (cave.scoreTarget != null || cave.moveLimitEnabled === false || project.swapDuringEffects ||
        (cave.externalSource?.gridTilesTemplate && needsWindyGoals) ||
        Object.entries(project.terrainRules).some(([id, rule]) => isCustomTerrainRule(id, rule)) ||
        Object.keys(project.gimmickRules).length) {
      const payload = buildProjectExport({ ...project, caves: [cave], activeCaveId: cave.id });
      downloadJson(payload, `windy-cave-${cave.number}.json`);
      return;
    }
    if (isDdungSource(cave.externalSource) && cave.externalSource.rawMap) {
      downloadJson(buildDdungLevelExport(cave), "DDUNG-level-" + cave.externalSource.sourceId + ".json");
      return;
    }
    if (!cave.externalSource?.gridTilesTemplate) return toast("이 레벨의 원본 형식 내보내기는 지원하지 않습니다. 프로젝트 내보내기로 저장하세요.");
    const source = buildGridTilesExport(cave);
    downloadJson(source, "grid-tiles-" + (cave.number ?? 1) + ".json");
  } catch (error) {
    toast(error.message);
  }
}

function buildProjectExport(projectData) {
  return {
    ...projectData,
    schema: `windy-cave-map-tool/v${SCHEMA_VERSION}`,
    schemaVersion: SCHEMA_VERSION,
    contentVersion: projectData.version,
    minimumClientVersion: CLIENT_VERSION,
    exportedAt: new Date().toISOString(),
  };
}

function exportProject() {
  persist();
  downloadJson(buildProjectExport(project), `windy-caves-${project.version.toLowerCase()}.json`);
  toast("프로젝트 JSON을 내보냈습니다.");
}

function openLevelDemo() {
  const cave = activeCave();
  const { errors, unsupported } = validateCave(cave);
  const issue = errors[0] ?? unsupported[0];
  if (issue) {
    toast(issue);
    return;
  }
  const preview = crypto.randomUUID();
  const payload = structuredClone(buildProjectExport({ ...project, caves: [cave], activeCaveId: cave.id }));
  const url = new URL("./host-demo.html", location.href);
  url.searchParams.set("preview", preview);
  const tab = window.open(url, "_blank");
  if (!tab) {
    toast("브라우저에서 팝업을 허용한 뒤 다시 시도하세요.");
    return;
  }

  const timeout = setTimeout(() => window.removeEventListener("message", passLevel), 15000);
  function passLevel(event) {
    if (event.origin !== location.origin || event.source !== tab ||
        event.data?.type !== "windy-cave:preview-ready" || event.data.preview !== preview) return;
    clearTimeout(timeout);
    window.removeEventListener("message", passLevel);
    tab.postMessage({ type: "windy-cave:preview-map", preview, project: payload }, location.origin);
  }
  window.addEventListener("message", passLevel);
}

function describePatchChanges(previous, cave) {
  const groups = [
    ["보드 배치", ["layers", "excludedCells", "width", "height", "initialPieceTypes", "initialPieceDefinitions", "specialMatches"]],
    ["클리어 목표", ["objectives", "targetType", "targetCount", "scoreTarget", "pointsPerBlock"]],
    ["이동 횟수", ["moveLimit", "moveLimitEnabled", "parMoves", "testClearMoves"]],
  ];
  const changed = (key) => JSON.stringify(previous[key]) !== JSON.stringify(cave[key]);
  const labels = groups.filter(([, keys]) => keys.some(changed)).map(([label]) => label);
  const grouped = new Set(groups.flatMap(([, keys]) => keys));
  const keys = new Set([...Object.keys(previous), ...Object.keys(cave)]);
  if ([...keys].some((key) => !grouped.has(key) && changed(key))) labels.push("기타 설정");
  return labels.join(", ") || "기타 변경";
}

function buildPatch(baseData) {
  if (!baseData?.caves?.length || baseData.type === "patch" || baseData.patch) {
    throw new Error("기준으로 사용할 전체 Windy Cave JSON을 선택하세요.");
  }
  assertImportCompatibility(baseData);
  const baseVersion = String(baseData.contentVersion || baseData.version || "").trim();
  if (!baseVersion || baseVersion === project.version) {
    throw new Error("기준 JSON과 현재 콘텐츠 버전은 서로 달라야 합니다.");
  }
  if (baseData.caves.some((cave) => !cave?.id) ||
      new Set(baseData.caves.map((cave) => String(cave.id))).size !== baseData.caves.length) {
    throw new Error("기준 JSON의 Cave마다 고유 ID가 필요합니다.");
  }
  const base = normalizeProject(baseData);
  const baseCaves = new Map(base.caves.map((cave) => [String(cave.id), cave]));
  const currentCaves = project.caves.map(normalizeCave);
  const currentIds = new Set(currentCaves.map((cave) => String(cave.id)));
  const payload = {
    schema: `windy-cave-map-tool/v${SCHEMA_VERSION}`,
    schemaVersion: SCHEMA_VERSION,
    type: "patch",
    baseContentVersion: baseVersion,
    contentVersion: project.version,
    minimumClientVersion: CLIENT_VERSION,
    paletteAssets: project.paletteAssets,
    assetDefinitions: project.assetDefinitions,
    terrainRules: project.terrainRules,
    gimmickRules: project.gimmickRules,
    swapDuringEffects: project.swapDuringEffects,
    patch: {
      upsertCaves: currentCaves.filter((cave) => JSON.stringify(baseCaves.get(String(cave.id))) !== JSON.stringify(cave)),
      removeCaveIds: [...baseCaves.keys()].filter((id) => !currentIds.has(id)),
    },
  };
  return { payload, baseCaves, base };
}

function patchCellChanges(previous, cave, x, y) {
  const read = (board, layer) => board.layers[layer][y * board.width + x] ?? null;
  const exists = (board) => x < board.width && y < board.height;
  const state = (board) => !exists(board) ? "보드 밖" : isExcluded(board, y * board.width + x) ? "비활성" : "활성";
  const changes = [];
  if (state(previous) !== state(cave)) changes.push(["칸 상태", state(previous), state(cave)]);
  for (const layer of Object.keys(cave.layers)) {
    const before = exists(previous) ? read(previous, layer) : null;
    const after = exists(cave) ? read(cave, layer) : null;
    if (before !== after) changes.push([layer, before ?? "비어 있음", after ?? "비어 있음"]);
  }
  return changes;
}

function patchSettingChanges(previous, cave) {
  const changes = [];
  const formatGoal = (board, goal) => goal
    ? `${goal.layer} · ${goal.targetId} × ${resolvedObjectiveCount(board, goal)} (${goal.countMode === "auto-map" ? "보드에서 계산" : "직접 입력"})`
    : "없음";
  const goalCount = Math.max(previous.objectives.length, cave.objectives.length);
  for (let index = 0; index < goalCount; index++) {
    const before = formatGoal(previous, previous.objectives[index]);
    const after = formatGoal(cave, cave.objectives[index]);
    if (before !== after) changes.push([`클리어 목표 ${index + 1}`, before, after]);
  }
  for (const [key, label] of [
    ["moveLimit", "이동 횟수 제한"],
    ["moveLimitEnabled", "이동 횟수 제한 사용"],
    ["parMoves", "권장 이동 횟수"],
    ["testClearMoves", "테스트 클리어 이동 횟수"],
  ]) {
    const before = previous[key] || "미설정";
    const after = cave[key] || "미설정";
    if (before !== after) changes.push([label, before, after]);
  }
  return changes;
}

function renderPatchBoard(previous, cave) {
  const settings = $("patchSettings");
  const settingRows = $("patchSettingsRows");
  settingRows.replaceChildren();
  const settingChanges = patchSettingChanges(previous, cave);
  settings.hidden = !settingChanges.length;
  for (const change of settingChanges) {
    const row = settingRows.insertRow();
    for (const value of change) row.insertCell().textContent = value;
  }
  const panel = $("patchBoardPanel");
  const grid = $("patchBoardGrid");
  const detail = $("patchCellDetail");
  const width = Math.max(previous.width, cave.width);
  const height = Math.max(previous.height, cave.height);
  grid.style.gridTemplateColumns = `repeat(${width}, 28px)`;
  grid.replaceChildren();
  panel.hidden = false;
  let count = 0;
  let firstChanged = null;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const changes = patchCellChanges(previous, cave, x, y);
      const cell = document.createElement(changes.length ? "button" : "span");
      cell.className = "patch-board-cell";
      if (changes.length) {
        count++;
        firstChanged ??= cell;
        cell.type = "button";
        cell.textContent = "•";
        cell.setAttribute("aria-label", `열 ${x + 1}, 행 ${y + 1} 변경 내용`);
        cell.addEventListener("click", () => {
          grid.querySelector('[aria-pressed="true"]')?.setAttribute("aria-pressed", "false");
          cell.setAttribute("aria-pressed", "true");
          detail.textContent = `열 ${x + 1}, 행 ${y + 1}\n` +
            changes.map(([layer, before, after]) => `${layer}  ${before} → ${after}`).join("\n");
        });
        cell.setAttribute("aria-pressed", "false");
      } else cell.setAttribute("aria-hidden", "true");
      grid.appendChild(cell);
    }
  }
  $("patchBoardTitle").textContent = `Cave ${cave.number} · ${cave.name} · 변경 ${count}칸`;
  detail.textContent = "바뀐 칸이 없습니다.";
  firstChanged?.click();
}

async function validatePatchCaves(dialog, entries) {
  const button = $("patchPreviewValidate");
  const status = $("patchValidationStatus");
  if (button.disabled) return;
  button.disabled = true;
  $("patchValidateSelected").disabled = true;
  const controller = new AbortController();
  const cancel = () => controller.abort();
  dialog.addEventListener("close", cancel);
  try {
    for (const [index, { cave, cell }] of entries.entries()) {
      status.textContent = `${index + 1} / ${entries.length} · Cave ${cave.number} 검증 중`;
      await new Promise((resolve) => setTimeout(resolve, 0));
      if (controller.signal.aborted || !dialog.open) return;
      const validation = validateCave(cave);
      const results = [];
      if (!validation.errors.length && !validation.unsupported.length) {
        for (let run = 0; run < cave.simulationRuns; run++) {
          await new Promise((resolve) => setTimeout(resolve, 0));
          if (controller.signal.aborted || !dialog.open) return;
          results.push(runAutoGame(cave, run));
        }
      }
      const batch = results.length ? summarizeBatch(results) : null;
      cell.textContent = batch ? `클리어율 ${batch.clearRate}% (${batch.wins}/${batch.runs})`
        : validation.errors.length ? "검증 오류" : "판정 미지원";
      if (validation.errors.length) {
        const edit = document.createElement("button");
        edit.type = "button";
        edit.className = "button ghost";
        edit.textContent = "Cave 편집 열기";
        edit.setAttribute("aria-label", `Cave ${cave.number} 편집 열기`);
        edit.addEventListener("click", () => {
          lastPatchCaveId = cave.id;
          controller.abort();
          dialog.close();
          $("caveJump").value = String(cave.number);
          jumpToCave();
          selectEditorTab("board");
          $("mapGrid").scrollIntoView({ block: "nearest" });
        });
        cell.appendChild(edit);
      }
      const issues = issueHtml(validation);
      if (issues) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "검증 메시지";
        const messages = document.createElement("div");
        messages.innerHTML = issues;
        details.append(summary, messages);
        cell.appendChild(details);
      }
    }
    status.textContent = `${entries.length}개 Cave 검증 완료`;
  } catch (error) {
    console.error(error);
    status.textContent = "검증 중 오류가 발생했습니다.";
  } finally {
    dialog.removeEventListener("close", cancel);
    if (!controller.signal.aborted && dialog.open) {
      button.disabled = false;
      $("patchValidateSelected").disabled = false;
    }
  }
}

let patchBaseData = null;
let lastPatchCaveId = null;

async function exportPatch(file) {
  try {
    const candidate = file ? JSON.parse(await file.text()) : patchBaseData;
    if (!candidate) return;
    const { payload, baseCaves, base } = buildPatch(candidate);
    if (file) lastPatchCaveId = null;
    patchBaseData = candidate;
    $("reopenPatchPreview").hidden = false;
    const dialog = $("patchPreview");
    const rows = $("patchPreviewRows");
    rows.replaceChildren();
    $("patchBoardPanel").hidden = true;
    const entries = [];
    let restoreDetails = null;
    const counts = { "추가": 0, "수정": 0, "삭제": 0 };
    const append = (status, cave, details, previous) => {
      counts[status]++;
      const row = rows.insertRow();
      row.insertCell().textContent = status;
      row.insertCell().textContent = cave.number;
      const name = row.insertCell();
      if (status !== "삭제") {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "button ghost";
        button.textContent = cave.name;
        const openDetails = () => {
          lastPatchCaveId = cave.id;
          $("patchValidateSelected").disabled = $("patchPreviewValidate").disabled;
          $("patchValidateSelected").onclick = () => validatePatchCaves(dialog, [{ cave, cell }]);
          renderPatchBoard(previous ?? { width: 0, height: 0, objectives: [], layers: {} }, cave);
          $("patchBoardPanel").scrollIntoView({ block: "nearest" });
        };
        button.addEventListener("click", openDetails);
        if (lastPatchCaveId === cave.id) restoreDetails = openDetails;
        name.appendChild(button);
      } else name.textContent = cave.name;
      row.insertCell().textContent = details;
      const cell = row.insertCell();
      cell.textContent = status === "삭제" ? "—" : "미검증";
      if (status !== "삭제") entries.push({ cave, cell });
    };
    for (const cave of payload.patch.upsertCaves) {
      const previous = baseCaves.get(String(cave.id));
      append(previous ? "수정" : "추가", cave, previous ? describePatchChanges(previous, cave) : "새 Cave", previous);
    }
    for (const id of payload.patch.removeCaveIds) append("삭제", baseCaves.get(id), "Cave 삭제");
    const assetsChanged = ["paletteAssets", "assetDefinitions"].some((key) => JSON.stringify(base[key]) !== JSON.stringify(payload[key]));
    const controlsChanged = base.swapDuringEffects !== payload.swapDuringEffects;
    $("patchPreviewSummary").textContent = `${payload.baseContentVersion} → ${payload.contentVersion} · 추가 ${counts["추가"]} · 수정 ${counts["수정"]} · 삭제 ${counts["삭제"]}${assetsChanged ? " · 팔레트 변경" : ""}${controlsChanged ? " · 플레이 조작 변경" : ""}`;
    $("patchValidationStatus").textContent = "";
    $("patchPreviewValidate").disabled = !entries.length;
    $("patchPreviewValidate").onclick = () => validatePatchCaves(dialog, entries);
    $("patchPreviewDownload").onclick = () => {
      downloadJson(payload, `windy-patch-${payload.baseContentVersion}-to-${payload.contentVersion}.json`);
      dialog.close();
      toast("패치 JSON을 내보냈습니다.");
    };
    dialog.showModal();
    restoreDetails?.();
  } catch (error) {
    toast(error.message || "패치 JSON을 만들 수 없습니다.");
  }
}

function parseSchemaVersion(data) {
  const isWindy = /windy-cave-map-tool\//i.test(String(data?.schema || "")) || data?.type === "patch" || Boolean(data?.patch) || Array.isArray(data?.caves);
  if (!isWindy) return null;
  if (Number.isFinite(Number(data?.schemaVersion))) return Number(data.schemaVersion);
  const match = String(data?.schema || "").match(/windy-cave-map-tool\/v(\d+)/i);
  return match ? Number(match[1]) : null;
}

function compareVersions(a, b) {
  const left = String(a || "0").split(".").map((part) => Number(part.replace(/\D.*$/, "")) || 0);
  const right = String(b || "0").split(".").map((part) => Number(part.replace(/\D.*$/, "")) || 0);
  for (let i = 0; i < Math.max(left.length, right.length); i += 1) {
    if ((left[i] || 0) !== (right[i] || 0)) return (left[i] || 0) > (right[i] || 0) ? 1 : -1;
  }
  return 0;
}

function assertImportCompatibility(data) {
  const isWindy = /windy-cave-map-tool\//i.test(String(data?.schema || "")) || data?.type === "patch" || Boolean(data?.patch) || Array.isArray(data?.caves);
  const requiredClient = data?.minimumClientVersion;
  if (isWindy && requiredClient && compareVersions(requiredClient, CLIENT_VERSION) > 0) {
    throw new Error(`이 JSON은 Client ${requiredClient} 이상이 필요합니다. 현재는 ${CLIENT_VERSION}입니다.`);
  }
  const schemaVersion = parseSchemaVersion(data);
  if (schemaVersion && schemaVersion > SCHEMA_VERSION) {
    throw new Error(`Schema ${schemaVersion}은 현재 지원 범위(${MIN_SCHEMA_VERSION}~${SCHEMA_VERSION})보다 새 버전입니다.`);
  }
  if (schemaVersion && schemaVersion < MIN_SCHEMA_VERSION) {
    throw new Error(`Schema ${schemaVersion}은 더 이상 지원하지 않습니다.`);
  }
}

function applyPatchPayload(data) {
  const patch = data?.patch || data;
  const baseVersion = String(data?.baseContentVersion || patch?.baseContentVersion || "");
  if (!baseVersion) throw new Error("패치 JSON에 baseContentVersion이 없습니다.");
  if (baseVersion !== project.version) {
    throw new Error(`패치 기준 버전 ${baseVersion}과 현재 콘텐츠 버전 ${project.version}이 다릅니다.`);
  }
  const removeIds = Array.isArray(patch.removeCaveIds) ? new Set(patch.removeCaveIds.map(String)) : new Set();
  const upserts = Array.isArray(patch.upsertCaves) ? patch.upsertCaves : [];
  const next = deepCopy(project);
  next.caves = next.caves.filter((cave) => !removeIds.has(String(cave.id)));
  upserts.forEach((rawCave, index) => {
    const cave = normalizeCave(rawCave, index);
    const existingIndex = next.caves.findIndex((item) => String(item.id) === String(cave.id));
    if (existingIndex >= 0) {
      cave.number ??= next.caves[existingIndex].number;
      next.caves[existingIndex] = cave;
    }
    else next.caves.push(cave);
  });
  if (!next.caves.length) throw new Error("패치 적용 결과 Cave가 하나도 남지 않습니다.");
  next.version = String(data?.contentVersion || patch?.contentVersion || baseVersion);
  next.contentVersion = next.version;
  if (data.paletteAssets) next.paletteAssets = data.paletteAssets;
  if (data.assetDefinitions) next.assetDefinitions = data.assetDefinitions;
  if (data.terrainRules) next.terrainRules = data.terrainRules;
  if (data.gimmickRules) next.gimmickRules = data.gimmickRules;
  if (typeof data.swapDuringEffects === "boolean") next.swapDuringEffects = data.swapDuringEffects;
  if (!next.caves.some((cave) => cave.id === next.activeCaveId)) next.activeCaveId = next.caves[0].id;
  return { project: normalizeProject(next), format: `패치 ${baseVersion} → ${next.version}`, unknownTokens: [] };
}

function valueAt(source, paths, fallback = undefined) {
  for (const path of paths) {
    const value = String(path).split(".").reduce((current, key) => current?.[key], source);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
}

function flatArray(value) {
  if (!Array.isArray(value)) return [];
  return Array.isArray(value[0]) ? value.flat() : value;
}

function normalizeAssetId(layer, value, allowCustom = false) {
  const id = assetId(typeof value === "object" && value !== null ? value.id ?? value.type ?? value.name : value);
  if (!id) return null;
  if (layer === "block") return normalizeColor(id) || (allowCustom ? id : null);
  const raw = id.toLowerCase();
  const key = raw.replace(/[ _]/g, "-");
  if (["0", "empty", "none", "null", "air", "void"].includes(key)) return null;
  const aliases = {
    ground: "floor", tile: "floor", solid: "wall", blockwall: "wall",
    hole: "pit", conveyorright: "conveyor", "conveyor-right": "conveyor",
    teleporta: "teleport-a", portala: "teleport-a", "portal-a": "teleport-a",
    teleportb: "teleport-b", portalb: "teleport-b", "portal-b": "teleport-b",
    gate: "door", goal: "exit", finish: "exit", spawn: "spawner",
    collectible: "coin", reward: "bonus",
  };
  const normalized = aliases[key] || key;
  if (ASSETS[layer].some((asset) => asset.id === normalized)) return normalized;
  return allowCustom ? id : null;
}

function applyCellToken(layers, index, token, unknownTokens, declaredLayers) {
  if (token == null) return;
  if (Array.isArray(token)) {
    token.forEach((entry) => applyCellToken(layers, index, entry, unknownTokens, declaredLayers));
    return;
  }
  const declaredId = assetId(token);
  const declaredLayer = declaredLayers.get(declaredId);
  if (declaredLayer) { layers[declaredLayer][index] = declaredId; return; }
  if (typeof token === "number" || /^\d+$/.test(String(token).trim())) {
    const numericMap = {
      0: null, 1: "wall", 2: "floor", 3: "red", 4: "yellow", 5: "blue", 6: "green", 7: "orange", 8: "purple",
      9: "pit", 10: "ice", 11: "teleport-a", 12: "teleport-b", 13: "switch", 14: "door", 15: "exit", 16: "coin", 17: "key",
    };
    if (!Object.hasOwn(numericMap, Number(token))) unknownTokens.add(String(token));
    else applyCellToken(layers, index, numericMap[Number(token)], unknownTokens, declaredLayers);
    return;
  }
  if (typeof token === "object") {
    const entries = [
      ["terrain", valueAt(token, ["terrain", "ground", "tile"])],
      ["block", valueAt(token, ["block", "color", "piece"])],
      ["gimmick", valueAt(token, ["gimmick", "mechanic", "object"])],
      ["item", valueAt(token, ["item", "collectible", "reward"])],
    ];
    let applied = false;
    entries.forEach(([layer, value]) => {
      if (value == null) return;
      const normalized = normalizeAssetId(layer, value, true);
      if (normalized) layers[layer][index] = normalized;
      applied = true;
    });
    if (!applied) {
      const layer = valueAt(token, ["layer", "category"]);
      const id = valueAt(token, ["id", "type", "value", "name"]);
      if (Object.hasOwn(ASSETS, layer)) layers[layer][index] = normalizeAssetId(layer, id, true);
      else applyCellToken(layers, index, id, unknownTokens, declaredLayers);
    }
    return;
  }
  const parts = String(token).split(/[|,+]/).map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1) {
    parts.forEach((part) => applyCellToken(layers, index, part, unknownTokens, declaredLayers));
    return;
  }
  const value = parts[0] || String(token);
  const color = normalizeColor(value);
  if (color) { layers.block[index] = color; return; }
  for (const layer of ["terrain", "gimmick", "item"]) {
    const normalized = normalizeAssetId(layer, value, null);
    if (normalized) { layers[layer][index] = normalized; return; }
  }
  if (assetId(value)) unknownTokens.add(String(value));
}

function adaptExternalObjective(raw, fallbackTarget = "purple", fallbackCount = 1) {
  const source = raw && typeof raw === "object" ? raw : { target: raw };
  const rawTarget = valueAt(source, ["targetId", "objectId", "type", "target", "color", "id", "name"], fallbackTarget);
  let layer = String(valueAt(source, ["layer", "category", "kind"], "")).toLowerCase();
  if (!Object.hasOwn(ASSETS, layer)) {
    if (normalizeColor(rawTarget)) layer = "block";
    else layer = Object.keys(ASSETS).find((candidate) => normalizeAssetId(candidate, rawTarget, null)) || "block";
  }
  const targetId = normalizeAssetId(layer, rawTarget, true) || ASSETS[layer][0].id;
  const countModeValue = valueAt(source, ["countMode", "count_mode", "quantityMode"], "manual");
  return normalizeObjective({
    id: source.id,
    layer,
    targetId,
    action: valueAt(source, ["action", "condition", "operation"], OBJECTIVE_ACTIONS[layer].action),
    countMode: String(countModeValue).toLowerCase().includes("auto") ? "auto-map" : "manual",
    count: valueAt(source, ["count", "amount", "quantity", "required"], fallbackCount),
  });
}

const DDUNG_ITEM_TILES = { "⑺": "ddung-treasure-1", "⑻": "ddung-treasure-2" };

const DDUNG_ITEM_IDS = new Set(Object.values(DDUNG_ITEM_TILES));

const DDUNG_TARGETS = {
  1: ["block", "yellow"], 2: ["block", "blue"], 3: ["block", "orange"],
  4: ["block", "green"], 5: ["block", "red"], 6: ["block", "purple"],
  7: ["gimmick", "ddung-box"], 8: ["terrain", "ddung-web"], 9: ["block", "ddung-dust-piece"],
  10: ["terrain", "ddung-oak"], 11: ["item", "ddung-treasure-1"], 12: ["item", "ddung-treasure-2"],
  13: ["terrain", "ddung-stone"], 14: ["terrain", "ddung-water"], 15: ["terrain", "ddung-bomb-panel"],
  16: ["gimmick", "ddung-mouse-panel"], 17: ["gimmick", "ddung-dungs"], 18: ["gimmick", "ddung-bulldozer"],
  20: ["terrain", "ddung-chocolate"], 21: ["gimmick", "ddung-spider-cave"], 22: ["gimmick", "ddung-bee"],
  23: ["gimmick", "ddung-feng"], 24: ["terrain", "ddung-ice"],
  25: ["gimmick", "ddung-mayor-small"], 26: ["gimmick", "ddung-mayor-large"],
  27: ["terrain", "ddung-jam-blue"], 28: ["terrain", "ddung-jam-green"], 29: ["terrain", "ddung-jam-orange"],
  30: ["terrain", "ddung-jam-pink"], 31: ["terrain", "ddung-jam-purple"], 32: ["terrain", "ddung-jam-yellow"],
  33: ["gimmick", "ddung-bee-up"], 34: ["terrain", "ddung-heather-small"],
  35: ["terrain", "ddung-heather-large"], 36: ["terrain", "ddung-jelly"], 37: ["gimmick", "ddung-octo"],
};

function ddungObjective(raw, index, unknownTokens) {
  const rawType = Number(raw?.type);
  const type = Number.isInteger(rawType) && rawType > 0 ? rawType : 999;
  const count = Number(raw?.count);
  const mapping = DDUNG_TARGETS[type];
  if (!mapping) {
    unknownTokens?.add(`ddung-target:${type}`);
    return normalizeObjective({ id: `ddung-target-${index}-${type}`, layer: "gimmick", targetId: `ddung-target-type-${type}`, count: raw?.count || 1 });
  }
  const [layer, targetId] = mapping;
  return normalizeObjective({
    id: `ddung-target-${index}-${type}`,
    layer,
    targetId,
    action: OBJECTIVE_ACTIONS[layer].action,
    countMode: ddungUsesBoardCount(type) ? "auto-map" : "manual",
    count: count > 0 ? count : 1,
  });
}

function applyDdungTile(layers, index, character, unknownTokens) {
  layers.terrain[index] = character === "y" ? "pit" : "floor";
  for (const [color, characters] of Object.entries(DDUNG_BLOCK_CHARACTERS)) {
    if (characters.includes(character)) { layers.block[index] = color; return; }
  }
  if (character === "ㄴ") { layers.block[index] = "yellow"; return; }
  if (".ㄱㄲㄳ⑴y".includes(character)) return;
  if ("⒜⒝⒞⒟⒠⒡⒢⒣⒤⒥".includes(character)) {
    layers.terrain[index] = "ddung-frost";
    if ("⒡⒢⒣⒤⒥".includes(character)) layers.block[index] = "ddung-dust-piece";
    return;
  }
  const dustTerrain = { D: "floor", C: "ddung-frost", V: "ddung-web", E: "ddung-ice", 6: "ddung-water", "⒫": "ddung-water", "⒬": "ddung-water", "⒭": "ddung-water", "⒮": "ddung-water", "⒯": "ddung-water", 7: "ddung-stone", 8: "ddung-stone-thick" };
  if (Object.hasOwn(dustTerrain, character)) {
    layers.terrain[index] = dustTerrain[character];
    layers.block[index] = "ddung-dust-piece";
    return;
  }
  const terrainCharacters = [
    ["ddung-web", "W"], ["ddung-frost", "I"], ["ddung-oak", "!@#$"],
    ["ddung-stone", "F"], ["ddung-stone-thick", "G"], ["ddung-water", "U⒦⒧⒨⒩⒪"],
    ["ddung-ice", "N"], ["ddung-heather-small", "s"], ["ddung-heather-large", "tuvw"],
    ["ddung-jelly", "①②③④⑤⑥⑦⑧⑨⑩ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ"],
  ];
  const terrain = terrainCharacters.find(([, characters]) => characters.includes(character));
  if (terrain) { layers.terrain[index] = terrain[0]; return; }
  if (Object.hasOwn(DDUNG_PANEL_TILES, character)) { layers.terrain[index] = DDUNG_PANEL_TILES[character]; return; }
  if (Object.hasOwn(DDUNG_ITEM_TILES, character)) { layers.item[index] = DDUNG_ITEM_TILES[character]; return; }
  const gimmickMap = {
    B: "ddung-box", H: "ddung-mouse-panel", L: "ddung-dungs", 5: "ddung-bulldozer",
    "%": "ddung-spider-cave", "^": "ddung-bee", q: "ddung-bee-up", z: "exit",
    R: "switch", Y: "switch", K: "door", A: "arrow-up", Q: "arrow-down", Z: "switch",
    "1": "switch", "2": "switch", "3": "switch", "4": "switch", r: "switch",
    "?": "ddung-feng", "(": "ddung-feng", ")": "ddung-feng", "[": "ddung-feng", "]": "ddung-feng",
    a: "ddung-feng", b: "ddung-feng", c: "ddung-feng", d: "ddung-feng", e: "ddung-feng",
    f: "ddung-mayor-small", g: "ddung-mayor-large", h: "ddung-mayor-large", i: "ddung-mayor-large", j: "ddung-mayor-large",
    "⑵": "ddung-octo", "⑶": "ddung-octo", "⑷": "ddung-octo", "⑸": "ddung-octo", "⑹": "ddung-octo",
  };
  const panel = "AQZY1234ra".includes(character) ? ddungPanelId(character) : null;
  if (panel || gimmickMap[character]) { layers.gimmick[index] = panel || gimmickMap[character]; return; }
  if (character === "P") { layers.gimmick[index] = "ddung-iron-box"; return; }
  if (character === "X") { layers.terrain[index] = "wall"; return; }
  unknownTokens?.add(`ddung-tile:${character}`);
  layers.gimmick[index] = "switch";
}

function normalizeBlockWeights(weights) {
  return Object.fromEntries(Object.entries(weights || {})
    .filter(([id, value]) => assetId(id) && typeof value === "number" && Number.isFinite(value))
    .map(([id, value]) => [id, Math.min(100, Math.max(0, value))]));
}

function chooseBlockColor(cave, colors, random) {
  const weights = colors.map((color) => blockWeight(cave, color));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (!total) return null;
  let cursor = random() * total;
  for (let index = 0; index < colors.length; index += 1) {
    cursor -= weights[index];
    if (cursor < 0) return colors[index];
  }
  return colors[colors.length - 1];
}

function adaptDdungMapInfo(source, index, format, unknownTokens, tileReporter) {
  const size = clampNumber(source.size, 9, 4, 20);
  const layers = emptyLayers(size * size);
  const tiles = Array.from(String(source.tiles || "").padEnd(size * size, "y"));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sourceIndex = (size - y - 1) * size + x;
      applyDdungTile(layers, y * size + x, tiles[sourceIndex], tileReporter(y * size + x, size));
    }
  }
  const applySixDigitPositions = (value, callback) => ddungPositionGroups(value, 6).forEach((group) => {
    const key = Number(group.slice(0, 2));
    const cellIndex = ddungGridIndex(size, Number(group.slice(2, 4)), Number(group.slice(4, 6)));
    if (cellIndex >= 0) callback(cellIndex, key);
  });
  const overlappingMarkers = {};
  const addMarker = (index, id) => {
    const existing = layers.gimmick[index];
    if (!existing) layers.gimmick[index] = id;
    else if (existing !== id) {
      const markers = overlappingMarkers[index] ??= [];
      if (!markers.includes(id)) markers.push(id);
    }
  };
  applySixDigitPositions(source.starts, (index) => addMarker(index, SPAWNER_ID));
  applySixDigitPositions(source.goals, (index) => addMarker(index, "exit"));
  applySixDigitPositions(source.roads, (cellIndex) => { layers.terrain[cellIndex] = "conveyor"; });
  ddungPositionGroups(source.warps, 4).forEach((group) => {
    const first = ddungGridIndex(size, Number(group[0]), Number(group[1]));
    const second = ddungGridIndex(size, Number(group[2]), Number(group[3]));
    if (first >= 0) addMarker(first, "teleport-a");
    if (second >= 0) addMarker(second, "teleport-b");
  });
  ddungPositionGroups(source.gears, 4).forEach((group) => {
    const cellIndex = ddungGridIndex(size, Number(group[2]), Number(group[3]));
    if (cellIndex >= 0) addMarker(cellIndex, "switch");
  });
  const frozenRolls = new Set();
  ddungPositionGroups(source.watercolors, 4).forEach((group) => {
    const cellIndex = ddungGridIndex(size, Number(group[0]), Number(group[1]));
    if (cellIndex < 0 || layers.block[cellIndex] === "ddung-dust-piece") return;
    const tile = tiles[(size - 1 - Math.floor(cellIndex / size)) * size + cellIndex % size];
    const piece = ddungInitialPiece(tile, Number(group[2]), Number(group[3]));
    if (piece?.color) layers.block[cellIndex] = piece.color;
    else if (piece?.type && ["ddung-ice", "ddung-frost"].includes(layers.terrain[cellIndex])) {
      // The original board keeps the rolled piece under the frozen panel.
      frozenRolls.add(cellIndex);
    }
  });
  const usableBlocks = [...new Set(String(source.colors || "").split(",")
    .map((value) => value.trim())
    .filter((value) => /^\d+$/.test(value))
    .map((value) => DDUNG_COLOR_IDS[Number(value)]).filter(Boolean))];
  const blockWeights = Number(source.objectcreate) !== 0 && /^\d{12}$/.test(String(source.objectpercent || ""))
    ? Object.fromEntries(usableBlocks.map((color, position) => [color, Number(String(source.objectpercent).slice(position * 2, position * 2 + 2))]))
    : undefined;
  const objectives = (Array.isArray(source.targets) ? source.targets : []).slice(0, MAX_OBJECTIVES)
    .flatMap((target, targetIndex) => Number(target?.type) === 0 ? [] : [ddungObjective(target, targetIndex, unknownTokens)]);
  const gravity = ({ 0: "up", 1: "down", 2: "left", 3: "right" })[Number(source.GravityType)] || "down";
  const cave = normalizeCave({
    id: `ddung-level-${source.level ?? index + 1}`,
    number: Number(source.level ?? index + 1),
    name: `DDUNG Level ${String(source.level ?? index + 1).padStart(4, "0")}`,
    width: size, height: size, gravity, layers,
    usableBlocks: usableBlocks.length ? usableBlocks : Object.keys(COLORS),
    blockWeights,
    objectives: objectives.length ? objectives : undefined,
    moveLimit: clampNumber(source.count, 20, 1, 999),
    parMoves: Math.max(1, Math.ceil(clampNumber(source.count, 20, 1, 999) * 0.7)),
    simulationRuns: 10,
    randomSeed: `DDUNG-${source.level ?? index + 1}`,
    randomDensity: 100,
    flowRule: "royal",
    failureBonus: false,
    note: `${format} · 원본 레벨 ${source.level ?? index + 1} · 특수 타일과 목표를 웹 맵툴 자산으로 변환`,
    externalSource: {
      format,
      sourceId: source.level ?? index + 1,
      ddungVersion: format.match(/v(\d+)/i)?.[1] || null,
      goalRulesVersion: 2,
      waterReactionNormalized: true,
      specialColors: String(source.special || "").split(",").map((value) => value.trim())
        .filter((value) => /^\d+$/.test(value)).map((value) => DDUNG_COLOR_IDS[Number(value)]).filter(Boolean),
      boxLayoutParsed: true,
      overlappingMarkers,
      rawMap: deepCopy(source),
    },
  }, index);
  const random = seededRandom(`${cave.randomSeed}|import`);
  for (let cellIndex = 0; cellIndex < cave.layers.block.length; cellIndex += 1) {
    const needsRoll = frozenRolls.has(cellIndex);
    if (!needsRoll && (cave.layers.block[cellIndex] || isBarrier(cave, cellIndex))) continue;
    const colors = cave.usableBlocks.filter((color) => blockWeight(cave, color) > 0);
    const candidates = colors.filter((color) => !wouldCreateMatch(cave.layers.block, cellIndex, color, cave));
    cave.layers.block[cellIndex] = chooseBlockColor(cave, candidates.length ? candidates : colors, random);
  }
  syncLegacyTarget(cave);
  return cave;
}

function externalInitialPieces(source, grid, width, height) {
  const size = width * height;
  const types = {};
  const explicit = source.initialPieceTypes || {};
  for (let index = 0; index < size; index++) {
    const token = grid[index];
    const raw = explicit[index] ?? token?.specialType ?? token?.pieceType ??
      token?.block?.specialType ?? token?.block?.pieceType ??
      token?.piece?.specialType ?? token?.piece?.pieceType;
    if (typeof raw !== "string" && typeof raw !== "number") continue;
    const type = String(raw).trim();
    if (type && !/^(0|normal|none)$/i.test(type)) types[index] = type;
  }
  const specialTiles = Array.isArray(source.specialTiles) ? source.specialTiles : [];
  for (const tile of specialTiles) {
    const { row, col, type } = tile || {};
    if (!Number.isInteger(row) || !Number.isInteger(col) || row < 0 || row >= height || col < 0 || col >= width) continue;
    if (typeof type === "string" && type.trim() && !/^(0|normal|none)$/i.test(type.trim())) {
      types[row * width + col] ??= type.trim();
    }
  }
  const definitions = Array.isArray(source.initialPieceDefinitions) ? source.initialPieceDefinitions : [];
  const symbols = ["◆", "▲", "■", "✚", "✦", "●", "◇", "★"];
  return {
    initialPieceTypes: types,
    initialPieceDefinitions: [...new Set([...Object.values(types), ...definitions.filter((entry) => entry?.id).map((entry) => String(entry.id))])].map((id, index) => {
      const declared = definitions.find((entry) => entry && String(entry.id) === id);
      return { id, name: String(declared?.name || id), symbol: String(declared?.symbol || symbols[index] || index + 1), effect: declared?.effect, ...(typeof declared?.effectScript === "string" ? { effectScript: declared.effectScript } : {}) };
    }),
  };
}

function adaptExternalLevel(level, index, format, unknownTokens, declaredLayers, tileReporter) {
  if (/^DDUNG MapInfo/i.test(format)) return adaptDdungMapInfo(level, index, format, unknownTokens, tileReporter);
  const source = level && typeof level === "object" ? level : {};
  const gridPaths = ["grid.tiles", "grid.cells", "grid", "board", "cells", "tiles", "map.grid", "map.cells", "map.tiles"];
  const grid = gridPaths.map((path) => valueAt(source, [path])).find((value) => flatArray(value).length) || [];
  const tiles = flatArray(grid);
  const gridRows = Array.isArray(grid) && Array.isArray(grid[0]) ? grid : null;
  const width = clampNumber(valueAt(source, ["width", "cols", "columns", "boardWidth", "grid.columns", "size.width", "map.width"], gridRows?.[0]?.length || 10), 10, 4, 20);
  const height = clampNumber(valueAt(source, ["height", "rows", "boardHeight", "grid.rows", "size.height", "map.height"], gridRows?.length || 12), 12, 4, 20);
  const size = width * height;
  const layers = emptyLayers(size);
  const layerAliases = {
    terrain: ["terrain", "ground", "floor"],
    block: ["block", "blocks", "colors", "pieces"],
    gimmick: ["gimmick", "gimmicks", "mechanics", "objects"],
    item: ["item", "items", "collectibles", "rewards"],
  };
  let hasLayerTiles = false;
  Object.entries(layerAliases).forEach(([layer, aliases]) => {
    const rawLayer = valueAt(source.layers || {}, aliases, valueAt(source, aliases.map((alias) => `${alias}Layer`), []));
    const layerTiles = flatArray(rawLayer);
    hasLayerTiles ||= layerTiles.length > 0;
    layerTiles.slice(0, size).forEach((value, cellIndex) => {
      const normalized = normalizeAssetId(layer, value, true);
      if (normalized) layers[layer][cellIndex] = normalized;
    });
  });
  if (!tiles.length && !hasLayerTiles) throw new Error("타일 배열을 찾지 못했습니다.");
  tiles.slice(0, size).forEach((token, cellIndex) => applyCellToken(layers, cellIndex, token, tileReporter(cellIndex, width), declaredLayers));
  const target = valueAt(source, ["target", "goal", "objective"], null);
  const rawUsable = valueAt(source, ["usableBlocks", "availableColors", "colors", "palette"]);
  const targetType = valueAt(source, ["targetType", "targetColor", "goalColor"], "purple");
  const targetCount = valueAt(source, ["targetCount", "goalCount", "collectCount", "target.count", "goal.count", "objective.count", "objectives.0.count"], 1);
  const rawObjectives = [source.objectives, source.targets, source.goals].find(Array.isArray);
  const collectObjectives = Object.entries(source.goals?.collect || {})
    .flatMap(([color, count]) => {
      const targetId = normalizeAssetId("block", color, true);
      return targetId && Number(count) > 0 ? [{ layer: "block", targetId, count: Number(count) }] : [];
    }).slice(0, MAX_OBJECTIVES);
  const objectives = rawObjectives
    ? rawObjectives.slice(0, MAX_OBJECTIVES).map((objective) => adaptExternalObjective(objective, targetType, targetCount))
    : collectObjectives.length ? collectObjectives
      : target != null || source.targetType || source.targetColor || source.goalColor
        ? [adaptExternalObjective(target, targetType, targetCount)] : [];
  const usableBlocks = rawUsable === undefined
    ? [...new Set([...layers.block.filter(Boolean), ...objectives.filter(({ layer }) => layer === "block").map(({ targetId }) => targetId)])]
    : (Array.isArray(rawUsable) ? rawUsable : String(rawUsable).split(","))
      .map((value) => normalizeAssetId("block", value, true)).filter(Boolean);
  const moveLimit = valueAt(source, ["moveLimit", "maxMoves", "moves", "turnLimit", "maxTurns", "goals.moves"], 20);
  const objectiveCount = objectives.reduce((sum, objective) => sum + objective.count, 0);
  const parMoves = valueAt(source, ["parMoves", "par", "recommendedMoves", "solutionMoves", "minMoves"], Math.max(1, Math.ceil(objectiveCount * 0.8)));
  const testClearMoves = valueAt(source, ["testClearMoves", "clearMoves", "bestMoves", "playtestMoves"], 0);
  return normalizeCave({
    id: valueAt(source, ["id", "uuid", "levelId", "stageId"], crypto.randomUUID()),
    name: valueAt(source, ["name", "title", "levelName", "stageName"], `Imported Cave ${String(index + 1).padStart(4, "0")}`),
    ...externalInitialPieces(source, tiles, width, height),
    specialMatches: source.specialMatches,
    excludedCells: source.excludedCells,
    width, height, gravity: valueAt(source, ["gravity", "gravityDirection", "direction"], "down"), layers,
    flowRule: valueAt(source, ["flowRule", "gravityFlowRule", "fallbackFlow"], "royal"),
    terrainRules: valueAt(source, ["terrainRules", "terrainBehavior", "terrainBehaviors"], undefined),
    gimmickRules: source.gimmickRules,
    blockWeights: source.blockWeights,
    levelSettings: source.levelSettings,
    usableBlocks, objectives, targetType, targetCount, moveLimit, moveLimitEnabled: source.moveLimitEnabled, parMoves, testClearMoves,
    scoreTarget: Number(source.scoreTarget), pointsPerBlock: Number(source.pointsPerBlock),
    failureBonus: Boolean(valueAt(source, ["failureBonus", "useFailureBonus"], false)),
    note: valueAt(source, ["note", "description", "memo"], ""),
    externalSource: { format, sourceId: valueAt(source, ["id", "levelId", "stageId", "level"], null), goals: source.goals, gridTilesTemplate: isGridTilesProfile(source) ? deepCopy(source) : undefined },
  }, index);
}

function adaptImportedJson(data) {
  assertImportCompatibility(data);
  if (data?.type === "patch" || data?.patch) return applyPatchPayload(data);
  if (data?.caves?.length) return { project: normalizeProject(data), format: data.schema || "Windy Cave", unknownTokens: [] };
  let levels = [];
  let format = "외부 단일 레벨";
  if (Array.isArray(data)) { levels = data; format = "외부 레벨 배열"; }
  else if (Array.isArray(data?.mapinfos)) { levels = data.mapinfos; format = `DDUNG MapInfo v${data.version ?? "unknown"}`; }
  else {
    const containers = ["levels", "stages", "maps", "puzzles"];
    const key = containers.find((name) => Array.isArray(data?.[name]));
    if (key) { levels = data[key]; format = `외부 ${key}`; }
    else if (data && typeof data === "object") levels = [data];
  }
  if (!levels.length) throw new Error("편집할 레벨 데이터를 찾지 못했습니다.");
  const unknownTokens = new Set();
  const definitions = normalizeAssetDefinitions(data?.assetDefinitions);
  const declaredLayers = new Map();
  for (const [layer, assets] of Object.entries(definitions)) {
    for (const { id } of assets) declaredLayers.set(id, declaredLayers.has(id) ? null : layer);
  }
  const unknownTiles = new Map();
  const caves = levels.map((level, index) => {
    const tileReporter = (cellIndex, width) => ({
      add(value) {
        const cells = unknownTiles.get(value) || new Map();
        cells.set(`${index}:${cellIndex}`, {
          levelIndex: index,
          row: Math.floor(cellIndex / width) + 1,
          column: cellIndex % width + 1,
        });
        unknownTiles.set(value, cells);
      },
    });
    return adaptExternalLevel(level, index, format, unknownTokens, declaredLayers, tileReporter);
  });
  const next = normalizeProject({ version: String(data?.version || data?.gameVersion || "IMPORTED"), caves, activeCaveId: caves[0].id, assetDefinitions: data?.assetDefinitions, specialPieceRules: data?.specialPieceRules, terrainRules: data?.terrainRules, gimmickRules: data?.gimmickRules, swapDuringEffects: data?.swapDuringEffects });
  return { project: next, format, unknownTokens: [...unknownTokens], unknownTiles };
}

function showImportTile(cave, levelNumber, row, column, value) {
  const panel = $("importTileBoard");
  const grid = $("importTileGrid");
  const selectedIndex = (row - 1) * cave.width + column - 1;
  $("importTileTitle").textContent = `레벨 ${levelNumber} · ${cave.name} · ${row}행 ${column}열`;
  $("importTileValue").textContent = `읽지 못한 값: ${value}`;
  grid.style.gridTemplateColumns = `repeat(${cave.width}, 28px)`;
  grid.replaceChildren();
  for (let index = 0; index < cave.width * cave.height; index++) {
    const cell = document.createElement("span");
    cell.className = "import-tile-cell";
    const block = cave.layers.block[index];
    if (block) cell.style.backgroundColor = blockColor(block);
    const piece = block ? initialPieceAt(cave, index) : null;
    if (piece) cell.textContent = piece.symbol;
    if (index === selectedIndex) {
      cell.classList.add("import-tile-selected");
      cell.textContent = "!";
    }
    cell.title = Object.entries(cave.layers).map(([layer, values]) => values[index] && `${layer}: ${values[index]}`).filter(Boolean).join(" · ");
    grid.append(cell);
  }
  panel.hidden = false;
  $("importTileTitle").focus({ preventScroll: true });
  panel.scrollIntoView({ block: "nearest" });
}

function previewImport(imported, filename) {
  const dialog = $("importPreview");
  const caves = imported.project.caves;
  const sizes = new Map();
  const pieces = new Set();
  for (const cave of caves) {
    const size = `${cave.width} × ${cave.height}`;
    sizes.set(size, (sizes.get(size) || 0) + 1);
    for (let index = 0; index < cave.width * cave.height; index++) {
      if (!cave.layers.block[index]) continue;
      const piece = initialPieceAt(cave, index);
      if (piece && (!piece.color || piece.color === cave.layers.block[index])) {
        pieces.add(piece.name || String(piece.type));
      }
    }
  }
  $("importPreviewFile").textContent = filename;
  $("importPreviewLevels").textContent = `${caves.length}개`;
  $("importPreviewSizes").textContent = [...sizes].map(([size, count]) => sizes.size === 1 ? size : `${size} (${count}개)`).join(", ");
  $("importPreviewPieces").textContent = pieces.size ? `${pieces.size}종 · ${[...pieces].join(", ")}` : "없음";
  const unknown = imported.unknownTokens;
  const warnings = $("importPreviewUnknown");
  warnings.replaceChildren();
  $("importTileBoard").hidden = true;
  $("importTileGrid").replaceChildren();
  for (const [value, cells] of imported.unknownTiles || []) {
    const group = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = `${value} · 총 ${cells.size}칸`;
    group.append(summary);
    const list = document.createElement("ul");
    for (const { levelIndex, row, column } of cells.values()) {
      const location = document.createElement("li");
      const cave = caves[levelIndex];
      const levelNumber = cave.number ?? levelIndex + 1;
      const button = document.createElement("button");
      button.type = "button";
      button.className = "button ghost";
      button.textContent = `레벨 ${levelNumber} · ${row}행 ${column}열`;
      button.addEventListener("click", () => showImportTile(cave, levelNumber, row, column, value));
      location.append(button);
      list.append(location);
    }
    group.append(list);
    warnings.append(group);
  }
  if (!warnings.childElementCount) warnings.textContent = "없음";
  const copyButton = $("importPreviewCopy");
  const copyStatus = $("importPreviewCopyStatus");
  copyButton.hidden = !warnings.childElementCount;
  copyStatus.textContent = "";
  copyButton.onclick = async () => {
    const report = [...warnings.querySelectorAll("details")].map((group) => {
      const summary = group.querySelector("summary").textContent;
      const locations = [...group.querySelectorAll("li button")].map((button) => `  - ${button.textContent}`);
      return [summary, ...locations].join("\n");
    }).join("\n\n");
    try {
      await navigator.clipboard.writeText(report);
      copyStatus.textContent = "타일 목록을 복사했습니다.";
    } catch {
      copyStatus.textContent = "복사하지 못했습니다. 브라우저의 클립보드 권한을 확인해 주세요.";
    }
  };
  $("importPreviewOtherWarnings").textContent = unknown.length ? `읽지 못한 기타 값 · ${unknown.join(", ")}` : "";
  dialog.returnValue = "";
  dialog.addEventListener("close", () => {
    if (dialog.returnValue !== "import") return;
    snapshot();
    project = imported.project;
    renderAll();
    persist();
    toast(`${imported.format}에서 Cave ${caves.length}개를 가져왔습니다.`);
  }, { once: true });
  dialog.showModal();
}

function parseImportedText(value) {
  let data;
  try { data = JSON.parse(value.replace(/^\uFEFF/, "")); }
  catch { throw new Error("올바른 JSON이 아닙니다. 파일 내용을 처음부터 끝까지 복사했는지 확인하세요."); }
  return adaptImportedJson(data);
}

function importProject(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try { previewImport(parseImportedText(reader.result), file.name); }
    catch (error) { toast(error.message || "지원되는 퍼즐 JSON이 아닙니다."); }
  };
  reader.onerror = () => toast("파일을 열 수 없습니다. 파일 앱에 저장된 JSON을 다시 선택하세요.");
  reader.readAsText(file);
}

function revealSelectedCave() {
  // Guided level selection stays on its step until the user presses Next.
  if (!$("editorGuide").hidden) return;
  selectEditorTab("board");
  $("editorTab-board").focus({ preventScroll: true });
  $("boardEditor").scrollIntoView({ block: "start", inline: "nearest" });
}

function selectEditorTab(id, guideGroups) {
  const workspace = $("editorWorkspace");
  workspace.dataset.activeTab = id;
  workspace.setAttribute("aria-labelledby", "editorTab-" + id);
  const guidedSettings = id === "settings" && Boolean(guideGroups);
  workspace.toggleAttribute("data-guided-settings", guidedSettings);
  $("boardEditor").inert = guidedSettings;
  for (const group of workspace.querySelectorAll("[data-setting-group]")) {
    group.hidden = Boolean(guideGroups && !guideGroups.includes(group.dataset.settingGroup));
  }
  for (const tab of $("editorTabs").querySelectorAll('[role="tab"]')) {
    const selected = tab.dataset.editorTab === id;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  }
}

function bindEditorTabs() {
  const bar = $("editorTabs");
  const tabs = [...bar.querySelectorAll('[role="tab"]')];

  bar.addEventListener("click", (event) => {
    const tab = event.target.closest('[role="tab"]');
    if (tab) selectEditorTab(tab.dataset.editorTab);
  });
  bar.addEventListener("keydown", (event) => {
    const index = tabs.indexOf(event.target);
    if (index < 0) return;
    const target = {
      ArrowLeft: (index - 1 + tabs.length) % tabs.length,
      ArrowRight: (index + 1) % tabs.length,
      Home: 0,
      End: tabs.length - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    tabs[target].focus();
    selectEditorTab(tabs[target].dataset.editorTab);
  });
}

const EDITOR_GUIDE_STEPS = [
  ["levels", "caveList", "레벨 선택", "목록에서 작업할 레벨을 고르세요. 새 레벨이 필요하면 + 버튼을 누르세요."],
  ["settings", "mapWidth", "보드 크기 선택", "보드의 너비와 높이를 정한 뒤 ‘맵 크기 적용’을 누르세요. 지금 크기로 진행하려면 다음을 누르세요.", ["size"]],
  ["objects", "assetGrid", "배치할 오브젝트 편집", "블록·지형·기믹·아이템 중 편집할 종류를 고르세요. ‘오브젝트 만들기’로 목록에 추가하거나, 항목을 선택한 뒤 ‘선택 오브젝트 삭제’로 제거할 수 있어요."],
  ["settings", "boardShapeButton", "보드 모양 생성", "대칭과 막힌 칸 비율을 정해 원하는 모양을 적용하세요. 지금 모양을 쓰려면 바로 다음으로 진행할 수 있어요.", ["shape"]],
  ["settings", "clearMode", "클리어 목표 설정", "미션 또는 목표 점수를 정하세요. 이동 횟수를 제한하려면 체크하고 최대 이동 횟수를 입력하세요.", ["goals"]],
  ["settings", "difficultyButton", "난이도로 보드 생성", "현재 보드 모양, 클리어 목표, 이동 횟수 설정으로 후보를 만들고 자동 플레이로 비교해요.", ["difficulty"]],
  ["settings", "randomizeButton", "자동 배치", "시드와 밀도를 정한 뒤 ‘랜덤 채우기’를 누르면 미리보기 보드가 바로 바뀌어요. 적용한 난이도 후보를 쓰려면 그대로 다음으로 넘어가세요.", ["auto"]],
  ["board", "previewLevelButton", "플레이 미리보기", "현재 레벨을 새 탭에서 플레이해 보드, 목표, 이동 횟수를 확인하세요."],
];

function bindEditorGuide() {
  const guide = $("editorGuide");
  const start = $("startEditorGuide");
  const selector = $("editorGuideStep");
  const previous = $("editorGuidePrevious");
  const next = $("editorGuideNext");
  const skip = $("editorGuideSkip");
  const goalsStep = EDITOR_GUIDE_STEPS.findIndex(([, target]) => target === "clearMode");
  const difficultyStep = EDITOR_GUIDE_STEPS.findIndex(([, target]) => target === "difficultyButton");
  const autoStep = EDITOR_GUIDE_STEPS.findIndex(([, target]) => target === "randomizeButton");
  let skipDifficulty = false;
  let displayedTarget;

  selector.replaceChildren(...EDITOR_GUIDE_STEPS.map(([, , title], index) => new Option((index + 1) + ". " + title, index)));

  function showStep(index) {
    const [tab, target, , instruction, groups] = EDITOR_GUIDE_STEPS[index];
    guide.hidden = false;
    start.setAttribute("aria-expanded", "true");
    selector.value = index;
    previous.disabled = index === 0;
    next.textContent = index === EDITOR_GUIDE_STEPS.length - 1 ? "플레이 미리보기" : "다음";
    skip.hidden = target !== "boardShapeButton" && target !== "difficultyButton";
    skip.textContent = target === "boardShapeButton" ? "두 단계 건너뛰기" : "난이도 생성 건너뛰기";
    $("editorGuideText").textContent = instruction;
    selectEditorTab(tab, groups);
    displayedTarget?.classList.remove("editor-guide-target");
    displayedTarget = $(target);
    displayedTarget.classList.add("editor-guide-target");
    $("editorTabs").scrollIntoView({ block: "start", inline: "nearest" });
  }

  start.addEventListener("click", () => {
    skipDifficulty = false;
    showStep(0);
  });
  selector.addEventListener("change", () => showStep(Number(selector.value)));
  previous.addEventListener("click", () => showStep(Number(selector.value) - 1));
  skip.addEventListener("click", () => {
    if (Number(selector.value) === difficultyStep) showStep(autoStep);
    else {
      skipDifficulty = true;
      showStep(goalsStep);
    }
    next.focus({ preventScroll: true });
  });
  next.addEventListener("click", () => {
    const index = Number(selector.value);
    if (index === EDITOR_GUIDE_STEPS.length - 1) openLevelDemo();
    else if (index === goalsStep && skipDifficulty) showStep(autoStep);
    else showStep(index + 1);
  });
  $("editorGuideClose").addEventListener("click", () => {
    guide.hidden = true;
    displayedTarget?.classList.remove("editor-guide-target");
    selectEditorTab($("editorWorkspace").dataset.activeTab);
    start.setAttribute("aria-expanded", "false");
    start.focus();
  });
}

function bindInputs() {
  bindEditorTabs();
  bindEditorGuide();
  $("addDdungGimmick").addEventListener("change", ({ target }) => {
    const id = target.value;
    if (!id || activeLayer !== "gimmick") return;
    snapshot();
    const ids = project.paletteAssets.gimmick ??= [];
    if (!ids.includes(id)) ids.push(id);
    selectedAssets.gimmick = id;
    activeTool = "brush";
    syncToolButtons();
    renderPalette();
    persist();
  });
  $("projectRulesButton").addEventListener("click", openProjectSpecialRules);
  $("levelSettingsForm").addEventListener("submit", saveLevelSettings);
  const stopPainting = () => { isPainting = false; strokeSnapshotTaken = false; };
  window.addEventListener("pointerup", stopPainting);
  window.addEventListener("pointercancel", stopPainting);
  window.addEventListener("blur", stopPainting);
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopPainting(); });
  $("newProjectButton").addEventListener("click", () => {
    if (!window.confirm("현재 작업을 비우고 새 프로젝트를 시작할까요?")) return;
    snapshot();
    project = normalizeProject(defaultProject());
    renderAll();
    persist();
  });
  $("assetLocatorPrev").addEventListener("click", () => stepLocatedAsset(-1));
  $("assetLocatorNext").addEventListener("click", () => stepLocatedAsset(1));
  $("assetLocatorClose").addEventListener("click", () => { assetLocator = null; renderGrid(); });
  $("openAssetReplace").addEventListener("click", openAssetReplacement);
  $("assetReplaceForm").addEventListener("submit", applyAssetReplacement);
  $("assetReplaceRange").addEventListener("input", updateAssetReplaceRange);
  $("assetReplaceCaves").addEventListener("change", renderGrid);
  $("assetReplaceCancel").addEventListener("click", () => { assetReplacement = null; renderGrid(); });
  $("viewAssetUsage").addEventListener("click", viewSelectedAssetUsage);
  $("deleteSelectedAsset").addEventListener("click", deleteSelectedAsset);
  $("manageSpecialTypes").addEventListener("click", () => openSpecialTypeManager());
  $("showAssetDefinition").addEventListener("click", () => {
    $("assetDefinitionForm").reset();
    $("assetDefinitionForm").hidden = false;
    $("assetDefinitionForm").scrollIntoView({ block: "nearest" });
    $("assetDefinitionName").focus({ preventScroll: true });
  });
  $("assetDefinitionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("assetDefinitionName").value.trim();
    const id = assetId($("assetDefinitionId").value || name);
    const layer = activeLayer;
    const ids = project.paletteAssets[layer] || [];
    if (!name || !id) return toast("오브젝트 이름과 유효한 ID를 입력하세요.");
    if (ids.includes(id)) return toast("이 레이어에 같은 ID가 이미 있습니다.");
    snapshot();
    project.assetDefinitions[layer] = [...(project.assetDefinitions[layer] || []), { id, name }];
    project.paletteAssets[layer] = [...ids, id];
    selectedAssets[layer] = id;
    activeTool = "brush";
    if (layer === "terrain") selectedTerrainRule = id;
    if (layer === "block" && !activeCave().usableBlocks.includes(id)) activeCave().usableBlocks.push(id);
    renderAll();
    persist();
  });
  $("toolGroup").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tool]"); if (!button) return;
    activeTool = button.dataset.tool; syncToolButtons(); renderPalette();
  });
  $("layerTabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-layer]"); if (!button) return;
    activeLayer = button.dataset.layer; renderPalette();
  });
  $("gravityControl").addEventListener("click", (event) => {
    const button = event.target.closest("[data-gravity]"); if (!button) return;
    snapshot(); activeCave().gravity = button.dataset.gravity; renderRules(); persist();
  });
  $("newCaveButton").addEventListener("click", addCave);
  $("duplicateCaveButton").addEventListener("click", duplicateCave);
  $("saveCaveAsButton").addEventListener("click", saveCaveAs);
  $("clearCaveButton").addEventListener("click", clearCave);
  $("deleteCaveButton").addEventListener("click", deleteCave);
  $("resizeButton").addEventListener("click", resizeMap);
  $("randomizeButton").addEventListener("click", randomizeBlocks);
  $("boardShapeButton").addEventListener("click", openBoardShapes);
  $("difficultyButton").addEventListener("click", openDifficultyGenerator);
  $("boardDifficultyButton").addEventListener("click", openDifficultyGenerator);
  $("difficultyForm").addEventListener("submit", generateDifficultyCandidates);
  $("difficultyAutomatic").addEventListener("change", ({ target }) => {
    $("difficultyManualOptions").hidden = target.checked;
  });
  $("regionItemButton").addEventListener("click", openRegionItems);
  $("regionItemCancel").addEventListener("click", () => $("regionItemDialog").close());
  $("undoButton").addEventListener("click", undo);
  $("redoButton").addEventListener("click", redo);
  $("prevCaveButton").addEventListener("click", () => switchCave(-1));
  $("nextCaveButton").addEventListener("click", () => switchCave(1));
  $("rangeButton").addEventListener("click", () => {
    $("rangeInput").value ||= String(activeCave().number);
    $("rangeDialog").showModal();
  });
  $("rangeDialog").querySelectorAll("[data-range-sort]").forEach((button) => {
    button.addEventListener("click", () => sortRangeRows(button.dataset.rangeSort));
  });
  $("rangeFilter").addEventListener("change", applyRangeFilter);
  $("rangeCsv").addEventListener("click", exportRangeCsv);
  $("rangeForm").addEventListener("submit", (event) => {
    event.preventDefault();
    validateCaveRange();
  });
  $("validateButton").addEventListener("click", () => showSimulation(false));
  $("playButton").addEventListener("click", () => showSimulation(true));
  $("previewLevelButton").addEventListener("click", openLevelDemo);
  $("themeEditorButton").addEventListener("click", () => {
    $("themePackStatus").textContent = "";
    renderThemeEditor();
    $("themeEditorDialog").showModal();
  });
  $("previewThemeButton").addEventListener("click", openLevelDemo);
  $("saveThemePack").addEventListener("click", saveThemePack);
  $("openThemePack").addEventListener("click", () => $("themePackFile").click());
  $("themePackFile").addEventListener("change", loadThemePack);
  $("applyEditorTheme").addEventListener("click", () => applyEditorTheme(true));
  $("clearEditorTheme").addEventListener("click", () => applyEditorTheme(false));
  $("closeSimulationButton").addEventListener("click", () => $("simulationDialog").close());
  $("closeSimulationFooterButton").addEventListener("click", () => $("simulationDialog").close());
  $("playtestResetButton").addEventListener("click", resetPlaytest);
  $("playtestPauseButton").addEventListener("click", togglePlaytestPause);
  $("playtestHintButton").addEventListener("click", showPlaytestHint);
  $("playtestComboButton").addEventListener("click", togglePlaytestCombo);
  $("usePlaytestResultButton").addEventListener("click", usePlaytestResult);
  $("saveButton").addEventListener("click", () => persist(true));
  $("exportButton").addEventListener("click", exportProject);
  $("exportGridTiles").addEventListener("click", exportGridTilesProfile);
  $("importFile").addEventListener("change", (event) => {
    const input = event.currentTarget;
    const file = input.files[0];
    input.value = "";
    importProject(file);
  });
  $("caveJumpForm").addEventListener("submit", (event) => {
    event.preventDefault();
    jumpToCave();
  });
  $("caveJump").addEventListener("input", () => { $("caveJumpStatus").textContent = ""; });
  $("caveSearch").addEventListener("input", (event) => { caveSearchQuery = event.target.value; renderCaveList(); });
  $("versionInput").addEventListener("change", (event) => setContentVersion(event.target.value));
  $("versionDown").addEventListener("click", () => stepContentVersion(-1));
  $("versionUp").addEventListener("click", () => stepContentVersion(1));
  $("reopenPatchPreview").addEventListener("click", () => exportPatch());
  $("exportPatchButton").addEventListener("click", () => $("patchBaseFile").click());
  $("patchBaseFile").addEventListener("change", (event) => {
    const file = event.target.files[0];
    event.target.value = "";
    exportPatch(file);
  });
  $("caveName").addEventListener("change", (event) => { snapshot(); activeCave().name = event.target.value.trim() || "Untitled Cave"; renderAll(); persist(); });
  $("addObjectiveButton").addEventListener("click", () => addObjective());
  for (const id of ["clearMode", "caveScoreTarget", "cavePointsPerBlock"]) {
    $(id).addEventListener("change", updateClearMode);
  }
  $("moveLimit").addEventListener("change", updateRule);
  $("moveLimitEnabled").addEventListener("change", updateRule);
  $("parMoves").addEventListener("change", updateRule);
  $("testClearMoves").addEventListener("change", updateRule);
  $("simulationRuns").addEventListener("change", updateRule);
  $("flowRule").addEventListener("change", updateRule);
  $("randomSeed").addEventListener("change", updateRandomSettings);
  $("randomDensity").addEventListener("change", updateRandomSettings);
  $("failureBonus").addEventListener("change", updateRule);
  $("specialMatches").addEventListener("change", (event) => {
    snapshot();
    const cave = activeCave();
    cave.specialMatches = event.target.checked;
    cave.testClearMoves = 0;
    renderRules();
    persist();
  });
  $("gimmickRulesForm").addEventListener("submit", saveSelectedGimmickRule);
  $("objectImageFile").addEventListener("change", chooseObjectImage);
  $("resetObjectImage").addEventListener("click", () => {
    const id = selectedAssets[activeLayer];
    if (id) saveObjectImage(activeLayer, id, null);
  });
  $("addSelectedGoal").addEventListener("click", () => {
    const id = selectedAssets[activeLayer];
    if (id) {
      addObjective(activeLayer, id);
      selectEditorTab("settings");
      $("objectiveList")?.scrollIntoView({ block: "nearest" });
    }
  });
  $("terrainRuleType").addEventListener("change", (event) => { selectedTerrainRule = event.target.value; renderTerrainRuleEditor(); });
  $("terrainReaction").addEventListener("change", updateTerrainRule);
  $("terrainBlocksFlow").addEventListener("change", updateTerrainRule);
  $("terrainBlocksSwap").addEventListener("change", updateTerrainRule);
  $("terrainLocksBlock").addEventListener("change", updateTerrainRule);
  $("terrainDurability").addEventListener("input", updateTerrainRule);
  $("noteInput").addEventListener("change", (event) => { snapshot(); activeCave().note = event.target.value; persist(); });
}

function updateTerrainRule() {
  snapshot();
  project.terrainRules[selectedTerrainRule] = {
    blocksFlow: $("terrainBlocksFlow").checked,
    blocksSwap: $("terrainBlocksSwap").checked,
    locksBlock: $("terrainLocksBlock").checked,
    reaction: $("terrainReaction").value,
    durability: clampNumber($("terrainDurability").value, 1, 1, 99),
  };
  renderTerrainRuleEditor(); renderGrid(); renderDifficultySummary(activeCave()); persist();
}

function updateRandomSettings() {
  snapshot();
  activeCave().randomSeed = $("randomSeed").value.trim() || activeCave().randomSeed;
  activeCave().randomDensity = clampNumber($("randomDensity").value, 100, 10, 100);
  renderRules(); persist();
}

function renderClearMode(cave) {
  const scoreMode = cave.scoreTarget != null;
  $("clearMode").value = scoreMode ? "score" : "mission";
  $("scoreSettings").hidden = !scoreMode;
  $("missionSettings").hidden = scoreMode;
  $("caveScoreTarget").value = cave.scoreTarget ?? 500;
  $("cavePointsPerBlock").value = cave.pointsPerBlock;
}

function updateClearMode() {
  const cave = activeCave();
  const scoreMode = $("clearMode").value === "score";
  const target = $("caveScoreTarget").valueAsNumber;
  const points = $("cavePointsPerBlock").valueAsNumber;
  if (scoreMode && (!Number.isSafeInteger(target) || target < 1 || !Number.isInteger(points) || points < 1 || points > 1000000)) {
    toast("목표 점수와 블록당 점수는 입력 범위 내의 양의 정수여야 합니다.");
    renderClearMode(cave);
    return;
  }
  snapshot();
  cave.scoreTarget = scoreMode ? target : null;
  if (scoreMode) cave.pointsPerBlock = points;
  renderClearMode(cave);
  renderDifficultySummary(cave);
  persist();
}

function updateRule(event) {
  snapshot(); const cave = activeCave();
  cave.moveLimit = Math.round(clampNumber($("moveLimit").value, cave.moveLimit, 1, 999));
  cave.moveLimitEnabled = $("moveLimitEnabled").checked;
  $("moveLimit").disabled = !cave.moveLimitEnabled;
  cave.parMoves = Math.max(1, Number($("parMoves").value));
  cave.testClearMoves = Math.max(0, Number($("testClearMoves").value || 0));
  if (cave.moveLimitEnabled && [$("moveLimit"), $("moveLimitEnabled")].includes(event?.currentTarget)) {
    if (cave.parMoves > cave.moveLimit) cave.parMoves = cave.moveLimit;
    if (cave.testClearMoves > cave.moveLimit) cave.testClearMoves = 0;
    $("moveLimit").value = cave.moveLimit;
    $("parMoves").value = cave.parMoves;
    $("testClearMoves").value = cave.testClearMoves || "";
  }
  cave.simulationRuns = [10, 30, 100].includes(Number($("simulationRuns").value)) ? Number($("simulationRuns").value) : 30;
  cave.flowRule = FLOW_RULES.includes($("flowRule").value) ? $("flowRule").value : "royal";
  cave.failureBonus = $("failureBonus").checked;
  syncLegacyTarget(cave);
  renderDifficultySummary(cave); persist();
}

function describeCellProperties(cave, index) {
  const fields = [cellDescription(cave, index)];
  for (const [layer, values] of Object.entries(cave.layers)) {
    if (values[index]) fields.push(`${layer} · ${getAsset(layer, values[index])?.name || values[index]} (${values[index]})`);
  }
  const piece = initialPieceAt(cave, index);
  if (piece) fields.push(`초기 피스 · ${piece.name || piece.type} · ${piece.symbol}`);
  const source = ddungCellSource(cave, index);
  if (source) {
    fields.push(`DDUNG 원본 타일 · ${source.tile ?? "없음"}`);
    if (source.gravity !== undefined) fields.push(`원본 칸 중력 · ${source.gravity}`);
    const originalPiece = ddungInitialPiece(source.tile);
    if (originalPiece) fields.push(`원본 초기 피스 · 색상 ${originalPiece.color} · 타입 ${originalPiece.type}`);
    for (const field of ["starts", "goals", "roads"]) {
      for (const token of ddungPositionGroups(source.raw[field], 6)) {
        if (Number(token.slice(2, 4)) === source.x && Number(token.slice(4, 6)) === source.y) fields.push(`${field} · ${token}`);
      }
    }
    for (const field of ["warps", "gears", "watercolors"]) {
      for (const token of ddungPositionGroups(source.raw[field], 4)) {
        const pairs = field === "warps" ? [token.slice(0, 2), token.slice(2)] :
          [field === "gears" ? token.slice(2) : token.slice(0, 2)];
        if (pairs.some((pair) => Number(pair[0]) === source.x && Number(pair[1]) === source.y)) fields.push(`${field} · ${token}`);
      }
    }
  }
  return fields.join("\n");
}

function specialTypeOptions(cave) {
  const definitions = new Map(EDITABLE_INITIAL_PIECES.map((entry) => [entry.id, entry]));
  for (const entry of cave.initialPieceDefinitions || []) {
    if (entry?.id) definitions.set(String(entry.id), { ...entry, id: String(entry.id) });
  }
  cave.layers.block.forEach((block, index) => {
    if (!block) return;
    const piece = initialPieceAt(cave, index);
    if (!piece) return;
    const id = String(piece.type);
    if (!definitions.has(id)) definitions.set(id, { id, name: piece.name || "기존 타입 " + id, symbol: piece.symbol });
  });
  return definitions;
}

function normalizeSpecialPieceRules(source) {
  const generation = {};
  for (const shape of Object.keys(SPECIAL_MATCH_SHAPES)) {
    if (!Object.hasOwn(source?.generation || {}, shape)) continue;
    const type = source.generation[shape];
    if (type === null || assetId(type)) generation[shape] = type === null ? null : assetId(type);
  }
  const combos = new Map();
  for (const rule of Array.isArray(source?.combos) ? source.combos : []) {
    const first = assetId(rule?.first);
    const second = assetId(rule?.second);
    if (!first || !second || !Object.hasOwn(PROJECT_COMBO_EFFECTS, rule.effect)) continue;
    combos.set(JSON.stringify([first, second].sort()), { first, second, effect: rule.effect });
  }
  return {
    allowSquare: typeof source?.allowSquare === "boolean" ? source.allowSquare : null,
    generation, combos: [...combos.values()],
    customShapes: normalizeCustomMatchShapes(source?.customShapes),
  };
}

const CUSTOM_MATCH_SIZE = 5;

function normalizeCustomMatchShapes(shapes) {
  const result = new Map();
  for (const shape of Array.isArray(shapes) ? shapes : []) {
    if (!Array.isArray(shape?.cells)) continue;
    const indices = new Set();
    for (const cell of shape.cells) {
      if (!Array.isArray(cell) || cell.length !== 2 ||
          !cell.every((n) => Number.isInteger(n) && n >= 0 && n < CUSTOM_MATCH_SIZE)) continue;
      indices.add(cell[1] * CUSTOM_MATCH_SIZE + cell[0]);
    }
    if (indices.size < 3) continue;
    const points = [...indices].sort((a, b) => a - b)
      .map((index) => [index % CUSTOM_MATCH_SIZE, Math.floor(index / CUSTOM_MATCH_SIZE)]);
    const left = Math.min(...points.map(([x]) => x));
    const top = points[0][1];
    const cells = points.map(([x, y]) => [x - left, y - top]);
    result.set(JSON.stringify(cells), { cells, type: assetId(shape.type) });
  }
  return [...result.values()];
}

function openProjectSpecialRules() {
  const dialog = $("projectRulesDialog");
  const form = $("projectRulesForm");
  const rules = normalizeSpecialPieceRules(project.specialPieceRules);
  $("swapDuringEffects").checked = project.swapDuringEffects;
  const types = new Map([...specialTypeOptions(activeCave())].map(([id, definition]) => [id, definition.name || id]));
  for (const cave of project.caves) {
    for (const definition of cave.initialPieceDefinitions || []) {
      const id = String(definition.id);
      if (!types.has(id)) types.set(id, definition.name || id);
    }
  }
  const typeOptions = [...types];
  const makeSelect = (label, options, value) => {
    const select = document.createElement("select");
    select.className = "field";
    select.setAttribute("aria-label", label);
    for (const [id, name] of options) select.add(new Option(name, id));
    if (![...select.options].some((option) => option.value === value)) select.add(new Option(value, value));
    select.value = value;
    return select;
  };
  const makePieceSelect = (label, value, allowCreate = false) => {
    const select = makeSelect(label, allowCreate ? [["", "생성 안 함"], ...typeOptions] : typeOptions, value);
    select.dataset.projectPieceSelect = "";
    if (!allowCreate) return select;
    const createOption = new Option("＋ 새 특수 피스 만들기", "__new_piece__");
    select.add(createOption);
    let previous = value;
    select.onfocus = () => { previous = select.value; };
    select.onchange = () => {
      if (select.selectedOptions[0] !== createOption) {
        previous = select.value;
        return;
      }
      select.value = previous;
      openSpecialTypeManager((piece) => {
        typeOptions.push([piece.id, piece.name]);
        for (const picker of form.querySelectorAll("[data-project-piece-select]")) {
          picker.add(new Option(piece.name, piece.id));
        }
        select.value = piece.id;
        previous = piece.id;
      });
    };
    return select;
  };
  const generation = Object.entries(SPECIAL_MATCH_SHAPES).map(([shape, [name, fallback]]) => {
    const label = document.createElement("label");
    const selected = Object.hasOwn(rules.generation, shape) ? rules.generation[shape] : fallback;
    const select = makePieceSelect(name, selected ?? "", true);
    label.append(name + " ", select);
    return { shape, label, select };
  });
  $("projectMatchRules").replaceChildren(...generation.map(({ label }) => label));
  $("disableDefaultMatchPieces").onclick = () => {
    for (const { select } of generation) {
      select.value = "";
      select.dispatchEvent(new Event("change"));
    }
  };

  const customShapes = $("projectCustomMatchRules");
  customShapes.replaceChildren();
  const addShape = ({ cells = [], type = null } = {}) => {
    const row = document.createElement("div");
    row.className = "project-custom-match";
    const grid = document.createElement("div");
    grid.className = "project-match-pattern";
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", "매치할 칸");
    for (let y = 0; y < CUSTOM_MATCH_SIZE; y++) {
      for (let x = 0; x < CUSTOM_MATCH_SIZE; x++) {
        const tile = document.createElement("button");
        tile.type = "button";
        tile.dataset.x = x;
        tile.dataset.y = y;
        tile.setAttribute("aria-label", (y + 1) + "행 " + (x + 1) + "열");
        tile.setAttribute("aria-pressed", String(cells.some(([dx, dy]) => dx === x && dy === y)));
        tile.onclick = () => tile.setAttribute("aria-pressed", String(tile.getAttribute("aria-pressed") !== "true"));
        grid.append(tile);
      }
    }
    const label = document.createElement("label");
    label.append("생성할 피스", makePieceSelect("생성할 피스", type ?? "", true));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "button ghost";
    remove.textContent = "삭제";
    remove.onclick = () => row.remove();
    row.append(grid, label, remove);
    customShapes.append(row);
  };
  rules.customShapes.forEach(addShape);
  $("addProjectMatchShape").onclick = () => addShape();

  const combos = $("projectComboRules");
  combos.replaceChildren();
  const addCombo = ({ first = typeOptions[0][0], second = typeOptions[1][0], effect = "both" } = {}) => {
    const row = document.createElement("div");
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "button ghost";
    remove.textContent = "삭제";
    remove.onclick = () => row.remove();
    row.className = "project-combo-row";
    const labeledSelect = (name, options, value) => {
      const label = document.createElement("label");
      label.append(name, options === typeOptions ? makePieceSelect(name, value) : makeSelect(name, options, value));
      return label;
    };
    row.append(labeledSelect("첫 피스", typeOptions, first), labeledSelect("두 번째 피스", typeOptions, second),
      labeledSelect("조합 효과", Object.entries(PROJECT_COMBO_EFFECTS), effect), remove);
    combos.append(row);
  };
  rules.combos.forEach(addCombo);
  $("addProjectCombo").onclick = () => addCombo();
  $("cancelProjectRules").onclick = () => dialog.close();
  $("projectRulesStatus").textContent = "";
  form.onsubmit = (event) => {
    event.preventDefault();
    const next = normalizeSpecialPieceRules({
      allowSquare: rules.allowSquare,
      generation: Object.fromEntries(generation.map(({ shape, select }) => [shape, select.value || null])),
      customShapes: Array.from(customShapes.children, (row) => ({
        cells: Array.from(row.querySelectorAll('[aria-pressed="true"]'), (tile) => [Number(tile.dataset.x), Number(tile.dataset.y)]),
        type: row.querySelector("select").value || null,
      })),
      combos: Array.from(combos.children, (row) => {
        const [first, second, effect] = Array.from(row.querySelectorAll("select"), (select) => select.value);
        return { first, second, effect };
      }),
    });
    if (next.customShapes.length !== customShapes.children.length) {
      $("projectRulesStatus").textContent = "각 모양은 서로 달라야 하며 칸을 3개 이상 선택해야 합니다.";
      return;
    }
    if (next.combos.length !== combos.children.length) {
      $("projectRulesStatus").textContent = "같은 두 피스의 조합은 한 번만 설정할 수 있습니다.";
      return;
    }
    snapshot();
    project.specialPieceRules = next;
    project.swapDuringEffects = $("swapDuringEffects").checked;
    for (const cave of project.caves) cave.testClearMoves = 0;
    dialog.close();
    renderAll();
    persist();
  };
  dialog.showModal();
}

function openSpecialTypeManager(onCreate) {
  const cave = activeCave();
  const dialog = $("specialTypeDialog");
  const form = $("specialTypeForm");
  const select = $("specialTypeSelect");
  const name = $("specialTypeName");
  const symbol = $("specialTypeSymbol");
  const effect = $("specialTypeEffect");
  const status = $("specialTypeStatus");
  const scriptField = $("specialTypeScriptField");
  const script = $("specialTypeScript");
  const showScript = () => { scriptField.hidden = effect.value !== "script"; };
  effect.onchange = showScript;
  let definitions;

  effect.replaceChildren(new Option("발동 효과 없음", "none"));
  for (const [id, label] of Object.entries(SPECIAL_EFFECTS)) effect.add(new Option(label, id));
  effect.add(new Option(SCRIPT_EFFECT_LABEL, "script"));

  const showType = () => {
    const definition = definitions.get(select.value);
    name.value = definition?.name || "";
    symbol.value = definition?.symbol || "";
    effect.value = definition?.effect === "script" ? "script" : specialEffect(cave, definition ? { type: definition.id } : null) || "none";
    script.value = definition?.effectScript || "";
    showScript();
    status.textContent = "";
  };
  const refresh = (selected) => {
    definitions = specialTypeOptions(cave);
    select.replaceChildren(new Option("새 특수 타입", ""));
    for (const entry of definitions.values()) {
      const label = (entry.effect === "script" ? SCRIPT_EFFECT_LABEL : specialEffectLabel(specialEffect(cave, { type: entry.id }))) || "발동 효과 없음";
      select.add(new Option(entry.name + " · " + label, entry.id));
    }
    select.value = selected;
    showType();
  };
  refresh("");
  select.disabled = Boolean(onCreate);
  $("specialTypeTitle").textContent = onCreate ? "새 특수 피스 만들기" : "특수 타입 관리";
  $("specialTypeSave").textContent = onCreate ? "만들고 선택" : "타입 저장";
  select.onchange = showType;
  form.onsubmit = (event) => {
    event.preventDefault();
    const label = name.value.trim();
    if (!label || activeCave() !== cave) return;
    const current = definitions.get(select.value);
    const id = current?.id || "custom-" + crypto.randomUUID();
    const updated = { ...current, id, name: label, symbol: symbol.value.trim() || "✦", effect: effect.value };
    if (updated.effect === "script") {
      try { parseEffectScript(script.value); }
      catch (error) {
        status.textContent = error.message;
        script.focus();
        return;
      }
      updated.effectScript = script.value.trim();
    }
    snapshot();
    cave.initialPieceDefinitions = (cave.initialPieceDefinitions || []).filter((entry) => String(entry?.id) !== id);
    cave.initialPieceDefinitions.push(updated);
    cave.testClearMoves = 0;
    renderAll();
    persist();
    if (onCreate) {
      onCreate(updated);
      dialog.close();
      return;
    }
    refresh(id);
    status.textContent = "특수 타입을 저장했습니다.";
  };
  dialog.showModal();
}

function inspectCell(index) {
  const cave = activeCave();
  const dialog = $("cellInspector");
  const form = $("initialPieceForm");
  const color = $("initialPieceColor");
  const type = $("initialPieceType");
  $("cellInspectorText").textContent = describeCellProperties(cave, index);
  form.hidden = isBarrier(cave, index);
  if (!form.hidden) {
    const currentColor = cave.layers.block[index];
    const current = initialPieceAt(cave, index);
    const definitions = specialTypeOptions(cave);
    color.replaceChildren(new Option("블록 없음", ""));
    for (const id of new Set([...(project.paletteAssets.block || []), ...Object.keys(COLORS), currentColor].filter(Boolean))) {
      color.add(new Option(getAsset("block", id)?.name || id, id));
    }
    color.value = currentColor || "";
    type.replaceChildren(new Option("일반 블록 · 특수 타입 해제", ""));
    for (const entry of definitions.values()) type.add(new Option(entry.symbol + " " + entry.name, entry.id));
    type.value = current ? String(current.type) : "";
    const refresh = () => {
      $("initialPieceApply").disabled = Boolean(type.value && !color.value);
    };
    form.oninput = refresh;
    refresh();
    form.onsubmit = (event) => {
      event.preventDefault();
      if (type.value && !color.value) return;
      snapshot();
      cave.layers.block[index] = color.value || null;
      cave.initialPieceTypes ??= {};
      cave.initialPieceTypes[index] = type.value || null;
      project.paletteAssets = collectPaletteAssets(project.caves, project.paletteAssets);
      cave.testClearMoves = 0;
      dialog.close();
      renderAll();
      persist();
      toast("초기 피스 설정을 적용했습니다.");
    };
  }
  dialog.showModal();
}

function showCellStatus(index) {
  const cave = activeCave(); const x = index % cave.width; const y = Math.floor(index / cave.width);
  const layers = Object.entries(cave.layers).filter(([, values]) => values[index]).map(([name, values]) => `${name}: ${values[index]}`);
  $("cellStatus").textContent = `(${x + 1}, ${y + 1})${layers.length ? ` · ${layers.join(" · ")}` : " · Empty"}`;
}

function cellDescription(cave, index) {
  if (isExcluded(cave, index)) return `(${index % cave.width + 1}, ${Math.floor(index / cave.width) + 1}) · 제외된 칸`;
  const x = index % cave.width; const y = Math.floor(index / cave.width);
  return `열 ${x + 1}, 행 ${y + 1}`;
}

function toast(message) {
  const node = $("toast"); node.textContent = message; node.classList.add("show");
  clearTimeout(toast.timer); toast.timer = setTimeout(() => node.classList.remove("show"), 1800);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
}

if (document.body.dataset.puzzlePlayer === undefined) loadProject().then((loaded) => {
  project = loaded;
  bindInputs();
  renderAll();
});

export {
  $, activeCave, adaptImportedJson, createPlayState, getAsset, normalizeObjectImage, playtestState, puzzleArtwork,
  readThemePack, THEME_PACK_FORMAT,
  renderPlaytest, renderSimulationGrid, showObjectImage, showPlaytestHint, validateCave,
};

export function setPuzzleProject(value) { project = value; }
export function setPuzzlePlaytestState(value) { playtestState = value; }
export function setPuzzleArtwork(value) { puzzleArtwork = value; }
export function setPuzzleView(render, burst) {
  puzzleView = render;
  puzzleBurst = burst;
}
