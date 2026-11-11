const COLORS = {
  red: "#ef4f5f", yellow: "#f7c73b", blue: "#35a9ff",
  green: "#36d477", orange: "#ff8a36", purple: "#b65bff",
};

const CLIENT_VERSION = "2.7.45";
const SCHEMA_VERSION = 5;
const MIN_SCHEMA_VERSION = 1;

const SPAWNER_ID = "spawner";

const ASSETS = {
  terrain: [
    { id: "floor", name: "Floor", className: "terrain-floor", visual: "·" },
    { id: "wall", name: "Wall", className: "terrain-wall", visual: "▦" },
    { id: "ice", name: "Ice", className: "terrain-ice", visual: "❄" },
    { id: "pit", name: "Pit", className: "terrain-pit", visual: "●" },
    { id: "conveyor", name: "Conveyor", className: "terrain-conveyor", visual: "➜" },
    { id: "ddung-web", name: "DDUNG Web", className: "terrain-ddung-web", visual: "⌁" },
    { id: "ddung-dust", name: "DDUNG Dust", className: "terrain-ddung-dust", visual: "░" },
    { id: "ddung-oak", name: "DDUNG Oak", className: "terrain-ddung-oak", visual: "♣" },
    { id: "ddung-stone", name: "DDUNG Stone", className: "terrain-ddung-stone", visual: "▰" },
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
    { id: "exit", name: "Exit", visual: "⇥" },
    { id: "ddung-box", name: "DDUNG Box", visual: "□" },
    { id: "ddung-mouse-panel", name: "DDUNG Mouse Panel", visual: "◉" },
    { id: "ddung-dungs", name: "DDUNG Dungs", visual: "♟" },
    { id: "ddung-bulldozer", name: "DDUNG Bulldozer", visual: "▸" },
    { id: "ddung-spider-cave", name: "DDUNG Spider Cave", visual: "⌂" },
    { id: "ddung-bee", name: "DDUNG Bee", visual: "♢" },
    { id: "ddung-feng", name: "DDUNG Feng", visual: "風" },
    { id: "ddung-mayor-small", name: "DDUNG Mayor Small", visual: "♙" },
    { id: "ddung-mayor-large", name: "DDUNG Mayor Large", visual: "♛" },
    { id: "ddung-bee-up", name: "DDUNG Bee Up", visual: "⇧" },
    { id: "ddung-octo", name: "DDUNG Octo", visual: "◈" },
  ],
  item: [
    { id: "coin", name: "Coin", visual: "●" },
    { id: "key", name: "Key", visual: "⚿" },
    { id: "star", name: "Star", visual: "★" },
    { id: "bomb", name: "Bomb", visual: "✹" },
    { id: "bonus", name: "Bonus", visual: "+" },
    { id: "ddung-treasure-1", name: "DDUNG Treasure 1", visual: "◆" },
    { id: "ddung-treasure-2", name: "DDUNG Treasure 2", visual: "◇" },
    { id: "ddung-chocolate", name: "DDUNG Chocolate", visual: "▣" },
    { id: "ddung-jam-blue", name: "DDUNG Jam Blue", visual: "●" },
    { id: "ddung-jam-green", name: "DDUNG Jam Green", visual: "●" },
    { id: "ddung-jam-orange", name: "DDUNG Jam Orange", visual: "●" },
    { id: "ddung-jam-pink", name: "DDUNG Jam Pink", visual: "●" },
    { id: "ddung-jam-purple", name: "DDUNG Jam Purple", visual: "●" },
    { id: "ddung-jam-yellow", name: "DDUNG Jam Yellow", visual: "●" },
  ],
};

const DEFAULT_TERRAIN_RULES = {
  floor: { blocksFlow: false, reaction: "none", durability: 1 },
  wall: { blocksFlow: true, reaction: "none", durability: 1 },
  ice: { blocksFlow: false, reaction: "adjacent", durability: 2 },
  pit: { blocksFlow: true, reaction: "none", durability: 1 },
  conveyor: { blocksFlow: false, reaction: "none", durability: 1 },
  "ddung-web": { locksBlock: true, blocksFlow: false, reaction: "adjacent", durability: 1 },
  "ddung-dust": { blocksFlow: false, reaction: "adjacent", durability: 1 },
  "ddung-oak": { blocksFlow: true, reaction: "adjacent", durability: 2 },
  "ddung-stone": { blocksFlow: true, reaction: "adjacent", durability: 2 },
  "ddung-water": { blocksFlow: false, reaction: "under", durability: 1 },
  "ddung-frost": { locksBlock: true, blocksFlow: false, reaction: "splash", durability: 1 },
  "ddung-ice": { locksBlock: true, blocksFlow: false, reaction: "splash", durability: 1 },
  "ddung-heather-small": { locksBlock: true, blocksFlow: false, reaction: "splash", durability: 1 },
  "ddung-heather-large": { locksBlock: true, blocksFlow: false, reaction: "splash", durability: 2 },
  "ddung-jelly": { blocksFlow: false, reaction: "adjacent", durability: 1 },
};

const FLOW_RULES = ["left-first", "right-first", "alternate", "seeded-random", "none"];
const MAX_OBJECTIVES = 4;
const OBJECTIVE_ACTIONS = {
  block: { action: "match", label: "매치해서 제거" },
  terrain: { action: "destroy", label: "내구도 소진 후 파괴" },
  gimmick: { action: "activate", label: "매치로 활성화" },
  item: { action: "collect", label: "같은 칸 매치로 수집" },
};

const STORAGE_KEY = "windy-cave-map-tool-v1";

const deepCopy = (value) => JSON.parse(JSON.stringify(value));
const emptyLayers = (size) => ({ terrain: Array(size).fill(null), block: Array(size).fill(null), gimmick: Array(size).fill(null), item: Array(size).fill(null) });

function packLayer(layer, values) {
  const ids = [null, ...ASSETS[layer].map((asset) => asset.id)];
  return values.map((value) => String.fromCharCode(33 + Math.max(0, ids.indexOf(value)))).join("");
}

function unpackLayer(layer, packed, size) {
  const ids = [null, ...ASSETS[layer].map((asset) => asset.id)];
  const text = String(packed || "");
  return Array.from({ length: size }, (_, index) => ids[Math.max(0, text.charCodeAt(index) - 33)] || null);
}

function packProjectForStorage(value) {
  return {
    ...value,
    storageFormat: "packed-layers-v1",
    caves: value.caves.map((cave) => {
      const layers = {};
      const packedLayers = {};
      for (const [layer, values] of Object.entries(cave.layers)) {
        const knownIds = new Set(ASSETS[layer].map((asset) => asset.id));
        if (values.some((id) => id !== null && !knownIds.has(id))) layers[layer] = values;
        else packedLayers[layer] = packLayer(layer, values);
      }
      const compact = { ...cave, layers, packedLayers };
      delete compact.targetType;
      delete compact.targetCount;
      if (JSON.stringify(compact.terrainRules) === JSON.stringify(DEFAULT_TERRAIN_RULES)) delete compact.terrainRules;
      if (compact.testClearMoves === 0) delete compact.testClearMoves;
      if (compact.simulationRuns === 30) delete compact.simulationRuns;
      if (compact.randomDensity === 100) delete compact.randomDensity;
      if (compact.flowRule === "left-first") delete compact.flowRule;
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
    usableBlocks: [],
    levelSettings: normalizeLevelSettings({}),
    objectives: [],
    targetType: null, targetCount: 0,
    moveLimit: 20, parMoves: 14, testClearMoves: 0,
    simulationRuns: 30,
    randomSeed: `CAVE-${String(number).padStart(4, "0")}`, randomDensity: 100,
    flowRule: "left-first", terrainRules: deepCopy(DEFAULT_TERRAIN_RULES),
    specialMatches: true, failureBonus: true, note: "",
  };
}

const defaultProject = () => ({ version: "V0001", assetDefinitions: {}, paletteAssets: { gimmick: [SPAWNER_ID] }, caves: [createCave(1)], activeCaveId: null });
let project = loadProject();
if (!project.activeCaveId || !project.caves.some((c) => c.id === project.activeCaveId)) project.activeCaveId = project.caves[0].id;

let activeLayer = "terrain";
let activeTool = "brush";
let selectedAssets = { terrain: null, block: null, gimmick: null, item: null };
let undoStack = [];
let redoStack = [];
let isPainting = false;
let strokeSnapshotTaken = false;
let playtestState = null;
let selectedTerrainRule = "ice";
let caveSearchQuery = "";

const $ = (id) => document.getElementById(id);
const activeCave = () => project.caves.find((c) => c.id === project.activeCaveId);

const clampNumber = (value, fallback, min = 0, max = 999) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, number)) : fallback;
};

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

function normalizeAssetDefinitions(source) {
  return Object.fromEntries(Object.keys(ASSETS).map((layer) => {
    const definitions = Array.isArray(source?.[layer]) ? source[layer] : [];
    const unique = new Map();
    for (const definition of definitions) {
      const id = assetId(definition?.id);
      if (id) unique.set(id, { id, name: String(definition.name || id) });
    }
    return [layer, [...unique.values()]];
  }));
}

function normalizeObjective(value, fallback = {}) {
  const source = value && typeof value === "object" ? value : {};
  const requestedLayer = String(source.layer || source.category || fallback.layer || "block").toLowerCase();
  const layer = Object.prototype.hasOwnProperty.call(ASSETS, requestedLayer) ? requestedLayer : "block";
  const fallbackTarget = ASSETS[layer][0]?.id || "red";
  let targetId = source.targetId ?? source.objectId ?? source.type ?? source.target ?? source.color ?? fallback.targetId ?? fallbackTarget;
  targetId = assetId(targetId) || fallbackTarget;
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
      for (const id of cave.layers[layer]) used[layer].add(id);
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
  const caves = rawCaves.map((cave, index) => normalizeCave(cave, index));
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
  return { ...source, version: String(source.contentVersion || source.version || "V0001"), caves, activeCaveId, assetDefinitions, paletteAssets: collectPaletteAssets(caves, source.paletteAssets, assetDefinitions) };
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

function normalizeCave(data, index = 0) {
  const source = data && typeof data === "object" ? data : {};
  const width = clampNumber(source.width, 10, 4, 20);
  const height = clampNumber(source.height, 12, 4, 20);
  const size = width * height;
  const layers = emptyLayers(size);
  for (const layer of Object.keys(layers)) {
    const values = Array.isArray(source.layers?.[layer])
      ? source.layers[layer]
      : unpackLayer(layer, source.packedLayers?.[layer], size);
    for (let i = 0; i < size; i += 1) layers[layer][i] = assetId(values[i]);
  }
  const excludedCells = Array.isArray(source.excludedCells)
    ? [...new Set(source.excludedCells.filter((index) => Number.isInteger(index) && index >= 0 && index < size))].sort((a, b) => a - b)
    : [];
  for (const index of excludedCells) for (const layer of Object.values(layers)) layer[index] = null;
  const usableBlocks = Array.isArray(source.usableBlocks)
    ? source.usableBlocks.map(assetId).filter(Boolean)
    : layers.block.filter(Boolean);
  const objectives = normalizeObjectives(source);
  const externalSource = source.externalSource;
  const migrateDdungGoals = isDdungSource(externalSource) && !externalSource.goalRulesVersion;
  const migrateWaterReaction = isDdungSource(externalSource) && !externalSource.waterReactionNormalized;
  const savedWater = source.terrainRules?.["ddung-water"];
  const oldWaterRule = migrateWaterReaction && (!savedWater || (savedWater.reaction === "adjacent" && savedWater.durability === 1 && savedWater.blocksFlow === false));
  let goalChanged = oldWaterRule && layers.terrain.includes("ddung-water");
  if (migrateDdungGoals) {
    for (const objective of objectives) {
      const type = ddungObjectiveType(objective);
      goalChanged ||= Boolean(ddungGoalLimitation({ externalSource }, objective));
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
  const terrainRules = {};
  const terrainIds = new Set([...Object.keys(DEFAULT_TERRAIN_RULES), ...Object.keys(source.terrainRules || {}).filter(assetId)]);
  terrainIds.forEach((terrainId) => {
    const fallback = getDefaultTerrainRule(terrainId);
    const rule = terrainId === "ddung-water" && oldWaterRule ? fallback : source.terrainRules?.[terrainId] || {};
    const reaction = ["none", "under", "adjacent", "adjacent-only", "splash"].includes(rule.reaction) ? rule.reaction : fallback.reaction;
    terrainRules[terrainId] = {
      blocksFlow: rule.blocksFlow == null ? fallback.blocksFlow : Boolean(rule.blocksFlow),
      locksBlock: rule.locksBlock == null ? Boolean(fallback.locksBlock) : Boolean(rule.locksBlock),
      reaction,
      durability: clampNumber(rule.durability, fallback.durability, 1, 99),
    };
  });
  const normalized = {
    ...source,
    id: source.id || crypto.randomUUID(),
    name: String(source.name || `Cave ${String(index + 1).padStart(4, "0")}`),
    width, height, gravity: normalizeGravity(source.gravity), layers, excludedCells,
    levelSettings: normalizeLevelSettings(source),
    specialMatches: source.specialMatches ?? true,
    usableBlocks: [...new Set(usableBlocks)],
    blockWeights: normalizeBlockWeights(source.blockWeights),
    objectives, targetType, targetCount, moveLimit,
    parMoves: clampNumber(source.parMoves, Math.min(moveLimit, estimatedPar), 1, 999),
    testClearMoves: goalChanged ? 0 : clampNumber(source.testClearMoves, 0, 0, 999),
    simulationRuns: [10, 30, 100].includes(Number(source.simulationRuns)) ? Number(source.simulationRuns) : 30,
    randomSeed: String(source.randomSeed || `CAVE-${String(index + 1).padStart(4, "0")}`),
    randomDensity: clampNumber(source.randomDensity, 100, 10, 100),
    flowRule: FLOW_RULES.includes(source.flowRule) ? source.flowRule : "left-first",
    terrainRules,
    failureBonus: Boolean(source.failureBonus),
    note: String(source.note || ""),
  };
  if (migrateDdungGoals || migrateWaterReaction) normalized.externalSource = { ...externalSource, goalRulesVersion: 2, waterReactionNormalized: true };
  delete normalized.packedLayers;
  delete normalized.storageFormat;
  return normalized;
}

function loadProject() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.caves?.length) return normalizeProject({ ...saved, contentVersion: saved.version || saved.contentVersion });
  } catch (_) {}
  return defaultProject();
}

function persist(showMessage = false, value = project) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packProjectForStorage(value)));
    if (showMessage) toast("브라우저에 저장했습니다.");
    return true;
  } catch (_) {
    toast("프로젝트가 너무 커서 브라우저 저장 공간을 초과했습니다. JSON으로 내보내 백업하세요.");
    return false;
  }
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

function getAsset(layer, id) {
  if (!assetId(id)) return null;
  const known = ASSETS[layer].find((asset) => asset.id === id);
  const definition = project.assetDefinitions?.[layer]?.find((asset) => asset.id === id);
  if (layer === "gimmick" && id === "ddung-iron-box" && !definition) return { id, name: "DDUNG Iron Box", visual: "▣" };
  return { visual: { terrain: "▦", block: "◆", gimmick: "◈", item: "●" }[layer], ...known, id, name: definition?.name || known?.name || id };
}

function blockColor(id) {
  if (Object.hasOwn(COLORS, id)) return COLORS[id];
  let hash = 0;
  for (const character of id) hash = (Math.imul(hash, 31) + character.codePointAt(0)) >>> 0;
  return `hsl(${hash % 360} 68% 55%)`;
}

function paletteOptions(layer, extraId) {
  return [...new Set([...(project.paletteAssets[layer] || []), extraId].filter(Boolean))]
    .map((id) => getAsset(layer, id));
}

function isDdungSource(source) {
  return /^DDUNG MapInfo\b/.test(String(source?.format || ""));
}

function ddungObjectiveType(objective) {
  const match = /^ddung-target-\d+-(\d+)$/.exec(objective.id);
  return match ? Number(match[1]) : null;
}

function ddungUsesBoardCount(type) {
  return type >= 7 && type <= 37 && type !== 11 && type !== 12;
}

function ddungGoalLimitation(cave, objective) {
  if (!isDdungSource(cave.externalSource)) return null;
  const type = ddungObjectiveType(objective);
  if (type == null) return null;
  if (type >= 1 && type <= 6) {
    const specialColors = cave.externalSource.specialColors;
    if (!Array.isArray(specialColors)) return "원본 JSON을 다시 가져와 특수 블록 목표 여부를 확인하세요.";
    return specialColors.includes(objective.targetId) ? "특수 블록 목표" : null;
  }
  if (type === 11 || type === 12) return "보물 생성과 출구 도달";
  if (type === 9 && objective.targetId !== "ddung-dust-piece") return "먼지 목표를 판정하려면 원본 JSON을 다시 가져오세요.";
  if (type === 36) return "여러 칸으로 구성된 젤리 그룹 제거";
  if (type === 7) return cave.externalSource.boxLayoutParsed ? null : "철 상자 배치를 확인하려면 원본 JSON을 다시 가져오세요.";
  if ([8, 9, 10, 13, 14, 24, 34, 35].includes(type)) return null;
  return "원본 전용 오브젝트 동작";
}

function matchesObjectiveAsset(objective, id) {
  return id === objective.targetId || (objective.layer === "gimmick" &&
    objective.targetId === "ddung-box" && ddungObjectiveType(objective) === 7 && id === "ddung-iron-box");
}

function countObjectiveAssets(cave, objective) {
  return cave.layers[objective.layer].filter((id) => matchesObjectiveAsset(objective, id)).length;
}

function resolvedObjectiveCount(cave, objective) {
  return objective.countMode === "auto-map" ? countObjectiveAssets(cave, objective) : objective.count;
}

function objectiveLabel(objective) {
  const layer = objective.layer[0].toUpperCase() + objective.layer.slice(1);
  const asset = getAsset(objective.layer, objective.targetId);
  return `${layer} · ${asset?.name || objective.targetId}`;
}

function syncLegacyTarget(cave) {
  const primary = cave.objectives.find((objective) => objective.layer === "block");
  cave.targetType = primary?.targetId ?? null;
  cave.targetCount = primary ? resolvedObjectiveCount(cave, primary) : 0;
}

function addObjective() {
  const cave = activeCave();
  if (cave.objectives.length >= MAX_OBJECTIVES) return toast(`목표는 최대 ${MAX_OBJECTIVES}개까지 설정할 수 있습니다.`);
  const layer = Object.keys(ASSETS).find((key) => project.paletteAssets[key]?.length);
  if (!layer) return toast("먼저 팔레트에 오브젝트 종류를 추가하세요.");
  snapshot();
  cave.objectives.push(normalizeObjective({ layer, targetId: project.paletteAssets[layer][0], countMode: "auto-map", count: 1 }));
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
    const row = document.createElement("div");
    row.className = "objective-row";
    const targetOptions = paletteOptions(objective.layer, objective.targetId)
      .map((asset) => `<option value="${escapeHtml(asset.id)}"${asset.id === objective.targetId ? " selected" : ""}>${escapeHtml(asset.name)}</option>`).join("");
    const autoCount = resolvedObjectiveCount(cave, objective);
    row.innerHTML = `
      <div class="objective-row-top">
        <label><span class="field-label">레이어</span><select class="field objective-layer">${Object.keys(ASSETS).filter((layer) => layer === objective.layer || project.paletteAssets[layer]?.length).map((layer) => `<option value="${layer}"${layer === objective.layer ? " selected" : ""}>${layer[0].toUpperCase() + layer.slice(1)}</option>`).join("")}</select></label>
        <label><span class="field-label">대상</span><select class="field objective-target">${targetOptions}</select></label>
        <button class="button objective-remove" title="목표 삭제" aria-label="목표 삭제">×</button>
      </div>
      <div class="objective-row-bottom">
        <label><span class="field-label">완료 조건</span><div class="objective-auto-count">${escapeHtml(objective.targetId === "ddung-dust-piece" ? "특수 피스로 먼지 제거" : ddungObjectiveType(objective) === 7 ? "내구도 소진 후 파괴" : OBJECTIVE_ACTIONS[objective.layer].label)}</div></label>
        <label><span class="field-label">수량 방식</span><select class="field objective-count-mode"><option value="manual"${objective.countMode === "manual" ? " selected" : ""}>직접 입력</option><option value="auto-map"${objective.countMode === "auto-map" ? " selected" : ""}>맵 개수 자동</option></select></label>
      </div>
      <div class="objective-row-bottom objective-count-row">
        <label><span class="field-label">목표 수량</span>${objective.countMode === "auto-map" ? `<div class="objective-auto-count">현재 ${autoCount}개</div>` : `<input class="field objective-count" type="number" min="1" max="999" value="${objective.count}" />`}</label>
        <div class="objective-auto-count">${escapeHtml(objectiveLabel(objective))}</div>
      </div>`;
    row.querySelector(".objective-layer").addEventListener("change", (event) => {
      const layer = event.target.value;
      updateObjective(index, { layer, targetId: project.paletteAssets[layer][0], action: OBJECTIVE_ACTIONS[layer].action });
    });
    row.querySelector(".objective-target").addEventListener("change", (event) => updateObjective(index, { targetId: event.target.value }));
    row.querySelector(".objective-count-mode").addEventListener("change", (event) => updateObjective(index, { countMode: event.target.value }));
    row.querySelector(".objective-count")?.addEventListener("change", (event) => updateObjective(index, { count: clampNumber(event.target.value, 1, 1, 999) }));
    row.querySelector(".objective-remove").addEventListener("click", () => removeObjective(index));
    list.appendChild(row);
  });
  $("addObjectiveButton").disabled = cave.objectives.length >= MAX_OBJECTIVES;
}

function renderAll() {
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
    button.addEventListener("click", () => { project.activeCaveId = cave.id; undoStack = []; redoStack = []; renderAll(); persist(); });
    list.appendChild(button);
  });
}

function renderRules() {
  const cave = activeCave();
  $("caveName").value = cave.name;
  $("mapWidth").value = cave.width;
  $("mapHeight").value = cave.height;
  renderObjectives();
  $("moveLimit").value = cave.moveLimit;
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
  const cave = activeCave();
  const terrainSelect = $("terrainRuleType");
  const terrainIds = project.paletteAssets.terrain || [];
  $("terrainRuleSection").hidden = terrainIds.length === 0;
  if (!terrainIds.length) return;
  terrainSelect.innerHTML = paletteOptions("terrain").map((asset) => `<option value="${escapeHtml(asset.id)}">${escapeHtml(asset.name)}</option>`).join("");
  if (!terrainIds.includes(selectedTerrainRule)) selectedTerrainRule = terrainIds[0];
  const rule = cave.terrainRules[selectedTerrainRule] || getDefaultTerrainRule(selectedTerrainRule);
  terrainSelect.value = selectedTerrainRule;
  $("terrainReaction").value = rule.reaction;
  $("terrainDurability").value = rule.durability;
  $("terrainBlocksFlow").checked = rule.blocksFlow;
  $("terrainLocksBlock").checked = Boolean(rule.locksBlock);
  $("terrainDurability").disabled = rule.reaction === "none";
  const terrainName = getAsset("terrain", selectedTerrainRule)?.name || selectedTerrainRule;
  const reactionLabel = rule.reaction === "none"
    ? "3-Match로 제거할 수 없습니다."
    : `${rule.durability}번 반응하면 사라집니다.`;
  $("terrainRuleSummary").innerHTML = `<strong>${escapeHtml(terrainName)}</strong><span>${rule.blocksFlow || rule.locksBlock ? "블록의 교환, 매치, 낙하를 막습니다." : "이 지형 위의 블록은 교환하고 매치할 수 있습니다."} ${reactionLabel}</span>`;
}

function renderDifficultySummary(cave) {
  const analysis = analyzeDifficulty(cave);
  const node = $("difficultySummary");
  node.className = `difficulty-summary difficulty-${analysis.key}`;
  node.innerHTML = `
    <div><span>휴리스틱 난이도</span><strong>${analysis.label}</strong></div>
    <small>점수 ${analysis.score} · 목표 작업량 ${analysis.objectiveWork} · 여유 ${analysis.slack >= 0 ? "+" : ""}${analysis.slack} Moves · 블록 ${analysis.totalBlocks}</small>
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
  const paletteIds = project.paletteAssets[layer] || [];
  if (!paletteIds.includes(selectedAssets[layer])) selectedAssets[layer] = null;

  $("assetDefinitionForm").hidden = true;

  paletteOptions(layer).forEach((asset) => {
    const button = document.createElement("button");
    button.className = `asset-card${activeTool !== "eraser" && selectedAssets[activeLayer] === asset.id ? " active" : ""}`;
    const style = activeLayer === "block" ? `background:${blockColor(asset.id)}` : "";
    button.innerHTML = `<span class="asset-visual ${asset.className || ""}" style="${style}">${escapeHtml(asset.visual)}</span><span>${escapeHtml(asset.name)}</span>`;
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
  $("deleteSelectedAsset").hidden = hideAssetActions || (layer === "gimmick" && current?.id === SPAWNER_ID);
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

function findAssetUsage(caves, layer, id) {
  return caves.flatMap((cave) => {
    const reasons = [];
    const placed = cave.layers[layer].filter((value) => value === id).length;
    if (placed) reasons.push(`${placed}칸 배치`);
    if (cave.objectives.some((goal) => goal.layer === layer && matchesObjectiveAsset(goal, id))) reasons.push("클리어 목표");
    if (layer === "block" && cave.usableBlocks.includes(id)) reasons.push("사용 색상");
    return reasons.length ? [{ cave, reasons }] : [];
  }).sort((a, b) => a.cave.number - b.cave.number);
}

function showAssetUsage(layer, id, name, usage, message) {
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
  if (!project.paletteAssets[layer]?.includes(id)) return;
  const name = getAsset(layer, id).name;
  const usage = findAssetUsage(project.caves, layer, id);
  const message = usage.length ? `‘${name}’ 사용처 · ${usage.length}개 Cave` : `‘${name}’을(를) 사용하는 Cave가 없습니다.`;
  showAssetUsage(layer, id, name, usage, message);
}

function deleteSelectedAsset() {
  const layer = activeLayer;
  const id = selectedAssets[layer];
  if (layer === "gimmick" && id === SPAWNER_ID) return;
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
  const layer = activeLayer;
  const id = selectedAssets[layer];
  const cave = activeCave();
  if (!id || !project.paletteAssets[layer].includes(id)) return toast("교체할 오브젝트를 선택하세요.");
  const alternatives = paletteOptions(layer).filter((asset) => asset.id !== id);
  if (!alternatives.length) return toast("같은 레이어에 교체할 오브젝트를 먼저 추가하세요.");
  const select = $("assetReplaceTarget");
  select.replaceChildren(...alternatives.map(({ name, id }) => new Option(name, id)));
  $("assetReplaceRange").value = "";
  $("assetReplaceCaves").replaceChildren();
  assetReplacement = { caveId: cave.id, layer, id };
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
      !project.paletteAssets[change.layer].includes(target)) return;
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
  return cave.layers[assetLocator.layer].flatMap((id, index) => id === assetLocator.id ? [index] : []);
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
    cell.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      if (activeTool === "inspect") { inspectCell(index); return; }
      event.preventDefault(); isPainting = true; strokeSnapshotTaken = false;
      editCell(index, activeTool === "fill");
    });
    cell.addEventListener("pointerenter", (event) => {
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

function isExcluded(cave, index) {
  return cave.excludedCells?.includes(index) ?? false;
}
function applyCellVisual(cell, cave, index) {
  if (isExcluded(cave, index)) {
    cell.classList.add("excluded-cell");
    if (cell.tagName === "BUTTON") cell.disabled = true;
    return;
  }
  for (const layer of ["terrain", "block", "gimmick", "item"]) {
    const assetId = cave.layers[layer][index];
    if (!assetId) continue;
    const asset = getAsset(layer, assetId);
    if (!asset) continue;
    const visual = document.createElement("span");
    visual.className = `cell-${layer} ${asset.className || ""}`;
    if (layer === "block") {
      visual.style.background = blockColor(assetId);
      if (assetId === "ddung-dust-piece") visual.textContent = asset.visual;
      const piece = cave.playtestPieces ? cave.playtestPieces[index] : initialPieceAt(cave, index);
      if (piece && (!piece.color || piece.color === assetId)) {
        const badge = document.createElement("span");
        badge.className = "initial-piece-badge";
        badge.textContent = piece.symbol;
        badge.title = `특수 피스 · ${piece.name || piece.type}`;
        cell.classList.add("has-initial-piece");
        cell.appendChild(badge);
      }
    }
    if (layer === "gimmick" || layer === "item" || (layer === "terrain" && !asset.className)) visual.textContent = asset.visual;
    cell.appendChild(visual);
  }
}

function editCell(index, fillMode) {
  const cave = activeCave();
  if (activeTool === "shape") {
    const excluded = isExcluded(cave, index);
    if (!excluded && (cave.excludedCells?.length || 0) >= cave.width * cave.height - 1) return toast("보드에는 최소 한 칸이 필요합니다.");
    snapshot();
    cave.excludedCells = excluded ? cave.excludedCells.filter((cell) => cell !== index) : [...(cave.excludedCells || []), index].sort((a, b) => a - b);
    if (!excluded) for (const layer of Object.values(cave.layers)) layer[index] = null;
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
  if (fillMode) floodFill(cave, activeLayer, index, value);
  else cave.layers[activeLayer][index] = value;
  renderGrid();
  if (cave.objectives.some((objective) => objective.layer === activeLayer && objective.countMode === "auto-map")) renderObjectives();
  persist(); showCellStatus(index);
}

function floodFill(cave, layer, start, replacement) {
  const cells = cave.layers[layer];
  const target = cells[start];
  if (target === replacement) return;
  const queue = [start];
  const visited = new Set();
  while (queue.length) {
    const index = queue.shift();
    if (visited.has(index) || isExcluded(cave, index) || cells[index] !== target) continue;
    visited.add(index); cells[index] = replacement;
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
  renderAll(); persist(); toast(`맵 크기를 ${width} × ${height}(으)로 변경했습니다.`);
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
    if (commitCaveSave([...project.caves, cave], cave.id)) toast(`${cave.name}을 만들었습니다.`);
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
  if (commitCaveSave(caves, copy.id)) toast(`${label}에 저장했습니다.`);
}

function commitCaveSave(caves, activeCaveId) {
  const next = { ...project, caves, activeCaveId };
  if (!persist(false, next)) return false;
  snapshot();
  project = next;
  caveSearchQuery = "";
  $("caveSearch").value = "";
  renderAll();
  return true;
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
}

function switchCave(delta) {
  const index = project.caves.findIndex((c) => c.id === project.activeCaveId);
  const nextIndex = Math.max(0, Math.min(project.caves.length - 1, index + delta));
  project.activeCaveId = project.caves[nextIndex].id; undoStack = []; redoStack = []; renderAll(); persist();
}

function seededRandom(seedText) {
  let hash = 1779033703 ^ seedText.length;
  for (let i = 0; i < seedText.length; i += 1) {
    hash = Math.imul(hash ^ seedText.charCodeAt(i), 3432918353);
    hash = hash << 13 | hash >>> 19;
  }
  return () => {
    hash = Math.imul(hash ^ hash >>> 16, 2246822507);
    hash = Math.imul(hash ^ hash >>> 13, 3266489909);
    const value = (hash ^= hash >>> 16) >>> 0;
    return value / 4294967296;
  };
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
  return 1 + countDirection(-1, 0) + countDirection(1, 0) >= 3
    || 1 + countDirection(0, -1) + countDirection(0, 1) >= 3;
}

function boardShapeCandidates(cave, symmetry, percent) {
  const { width, height } = cave;
  const size = width * height;
  const target = Math.min(size - 1, Math.round(size * percent / 100));
  const protectedCells = Array.from({ length: size }, (_, index) =>
    Object.values(cave.layers).some((layer) => layer[index]) || initialPieceAt(cave, index)
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
  for (let attempt = 0; attempt < 30 && candidates.size < 3; attempt++) {
    const shuffled = [...groups];
    for (let index = shuffled.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
    }
    const cells = [];
    for (const group of shuffled.sort((a, b) => b.length - a.length)) {
      if (cells.length + group.length <= target) cells.push(...group);
    }
    cells.sort((a, b) => a - b);
    candidates.set(cells.join(","), cells);
  }
  return { target, candidates: [...candidates.values()] };
}

function openBoardShapes() {
  const cave = activeCave();
  const dialog = $("boardShapeDialog");
  const options = $("boardShapeOptions");
  const refresh = () => {
    const percent = clampNumber($("boardShapePercent").value, 20, 0, 70);
    const { candidates, target } = boardShapeCandidates(cave, $("boardShapeSymmetry").value, percent);
    options.replaceChildren();
    $("boardShapeStatus").textContent = cave.width + " × " + cave.height + " · 목표 " + target + "칸";
    if (candidates[0].length < target) {
      $("boardShapeStatus").textContent += " · 대칭과 기존 오브젝트를 고려해 가능한 만큼 막았습니다.";
    }
    for (const [index, cells] of candidates.entries()) {
      const blocked = new Set(cells);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "button ghost";
      card.textContent = "후보 " + (index + 1) + " 적용 · 막힌 칸 " + cells.length + "개";
      const grid = document.createElement("span");
      grid.className = "board-shape-grid";
      grid.style.gridTemplateColumns = "repeat(" + cave.width + ", 10px)";
      grid.setAttribute("aria-hidden", "true");
      for (let cell = 0; cell < cave.width * cave.height; cell++) {
        const tile = document.createElement("span");
        if (blocked.has(cell)) tile.className = "board-shape-blocked";
        grid.append(tile);
      }
      card.append(grid);
      card.addEventListener("click", () => {
        snapshot();
        cave.excludedCells = cells;
        cave.testClearMoves = 0;
        dialog.close();
        renderAll();
        persist();
        toast("보드 모양을 적용했습니다. 막힌 칸 " + cells.length + "개");
      });
      options.append(card);
    }
  };
  $("boardShapeRefresh").onclick = refresh;
  $("boardShapeSymmetry").onchange = refresh;
  $("boardShapePercent").onchange = refresh;
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
  for (const id of project.paletteAssets.item || []) {
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
  cave.usableBlocks = [...colors];
  project.paletteAssets = collectPaletteAssets(project.caves, project.paletteAssets);
  cave.randomSeed = seed;
  cave.randomDensity = density;
  renderAll(); persist();
  toast(`시드 ${seed} · 고정 칸 ${fixed.filter(Boolean).length}개 보존 · 블록 ${blocks.filter(Boolean).length}개${shortfalls.length ? ` · 목표색 부족 ${shortfalls.join(", ")}` : ""}`);
}


function difficultyTerrainIds(cave) {
  return (project.paletteAssets.terrain || []).filter((id) => {
    const rule = cave.terrainRules[id];
    return rule && rule.reaction !== "none" &&
      (!id.startsWith("ddung-") || ["ddung-water", "ddung-ice", "ddung-web"].includes(id));
  });
}

function buildDifficultyCandidate(source, colors, target, attempt, keepPlacement) {
  const cave = deepCopy(source);
  const seed = source.randomSeed + "|difficulty-" + target + "-" + (attempt + 1);
  const random = seededRandom(seed);
  if (!keepPlacement) {
    cave.layers = emptyLayers(cave.width * cave.height);
    cave.initialPieceTypes = Object.fromEntries(
      source.layers.block.flatMap((_, index) => initialPieceAt(source, index) ? [[index, null]] : [])
    );
  }
  cave.randomSeed = seed;
  cave.usableBlocks = keepPlacement ? [...new Set([...source.usableBlocks, ...colors])] : colors;
  cave.testClearMoves = 0;

  const terrain = cave.layers.terrain;
  const terrainSlots = terrain.flatMap((id, index) => !id && !isBarrier(cave, index) ? [index] : []);
  const terrainCounts = new Map();
  terrain.forEach((id, index) => {
    if (id && !isExcluded(cave, index)) terrainCounts.set(id, (terrainCounts.get(id) || 0) + 1);
  });
  const terrainIds = difficultyTerrainIds(cave).filter((id) =>
    terrainCounts.has(id) || (terrainSlots.length && !cave.terrainRules[id].blocksFlow));
  if (!terrainIds.length) return null;
  const targetId = terrainIds[Math.floor(random() * terrainIds.length)];
  const variation = 0.65 + random() * 0.7;
  const existing = terrainCounts.get(targetId) || 0;
  let terrainCount = Math.max(1, Math.min(existing, Math.round(existing * (0.2 + target * 0.008) * variation)));
  if (!existing) {
    terrainCount = Math.min(terrainSlots.length, Math.max(1, Math.round(terrainSlots.length * (0.05 + target * 0.002) * variation)));
    for (let placed = 0; placed < terrainCount; placed += 1) {
      const [index] = terrainSlots.splice(Math.floor(random() * terrainSlots.length), 1);
      terrain[index] = targetId;
    }
  }

  const spawnEdge = new Set(gravityLines(cave).map((line) => line[line.length - 1]));
  const gimmicks = cave.layers.gimmick;
  for (let index = 0; index < gimmicks.length; index += 1) {
    if (spawnEdge.has(index) && !isBarrier(cave, index)) {
      if (!gimmicks[index]) gimmicks[index] = SPAWNER_ID;
    } else if (gimmicks[index] === SPAWNER_ID) {
      gimmicks[index] = null;
    }
  }

  const free = cave.layers.block.flatMap((_, index) =>
    !isBarrier(cave, index) && Object.values(cave.layers).every((layer) => !layer[index]) ? [index] : []
  );
  const eligibleAssets = {
    item: (project.paletteAssets.item || []).filter((id) => !id.startsWith("ddung-")),
    gimmick: (project.paletteAssets.gimmick || []).filter((id) => id === "switch" ||
      (id === "ddung-box" && isDdungSource(cave.externalSource) && cave.externalSource.boxLayoutParsed)),
  };
  for (const [layer, assets] of Object.entries(eligibleAssets)) {
    if (!assets.length || !free.length) continue;
    const id = assets[Math.floor(random() * assets.length)];
    const count = Math.min(free.length, Math.max(1, Math.round(free.length * (0.025 + target * 0.001) * (0.65 + random() * 0.7))));
    for (let placed = 0; placed < count; placed += 1) {
      const [index] = free.splice(Math.floor(random() * free.length), 1);
      cave.layers[layer][index] = id;
    }
  }

  const blocks = cave.layers.block;
  for (let index = 0; index < blocks.length; index += 1) {
    if (blocks[index] || isBarrier(cave, index)) continue;
    const available = colors.filter((color) => !wouldCreateMatch(blocks, index, color, cave));
    if (!available.length) return null;
    blocks[index] = chooseBlockColor(cave, available, random);
  }
  if (findMatches(cave).size || !hasPossibleSwap(cave)) return null;

  cave.objectives = [normalizeObjective({ id: "generated-terrain-goal", layer: "terrain", targetId, count: terrainCount })];
  cave.targetType = null;
  cave.targetCount = terrainCount;
  const moveSpread = [-8, -4, 0, 4, 9, 15][attempt % 6];
  cave.moveLimit = Math.max(2, Math.min(35, Math.round(16 - target / 8 + Math.sqrt(terrainCount) * 3 + moveSpread)));
  cave.parMoves = Math.max(1, Math.floor(cave.moveLimit * 0.75));
  const validation = validateCave(cave);
  return validation.errors.length || validation.unsupported.length ? null : cave;
}

function difficultyCandidateScore(cave, batch) {
  const failureRate = 1 - batch.wins / batch.runs;
  const movePressure = batch.average / cave.moveLimit;
  return Math.max(1, Math.min(100, Math.round(70 * failureRate + 25 * movePressure + 5 * batch.stuck / batch.runs)));
}

function renderDifficultyCandidates(source, candidates) {
  const options = $("difficultyOptions");
  options.replaceChildren();
  for (const [index, { cave, batch, score }] of candidates.entries()) {
    const card = document.createElement("details");
    card.open = index === 0;
    const summary = document.createElement("summary");
    summary.textContent = "후보 " + (index + 1) + " · 추정 난이도 " + score + " · 클리어 " + batch.clearRate + "% (" + batch.wins + "/" + batch.runs + ")";
    const info = document.createElement("p");
    info.textContent = "제한 " + cave.moveLimit + " Moves · 성공 평균 " + batch.average +
      " Moves · 막힘 " + batch.stuck + "/" + batch.runs;
    const goals = document.createElement("p");
    goals.textContent = cave.objectives.map((goal) => objectiveLabel(goal) + " " + goal.count + "개").join(" · ");
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
      toast("추정 난이도 " + score + " 후보를 적용했습니다.");
    };
    card.append(summary, info, goals, viewport, apply);
    options.append(card);
  }
}

function openDifficultyGenerator() {
  $("difficultyOptions").replaceChildren();
  $("difficultyStatus").textContent = "";
  $("difficultyDialog").showModal();
}

async function generateDifficultyCandidates(event) {
  event.preventDefault();
  const source = activeCave();
  const dialog = $("difficultyDialog");
  const target = $("difficultyTarget").valueAsNumber;
  const keepPlacement = $("difficultyKeepPlacement").checked;
  const status = $("difficultyStatus");
  const submit = $("difficultyGenerate");
  const fields = $("difficultyFields");
  if (submit.disabled || !Number.isInteger(target) || target < 1 || target > 100) return;
  $("difficultyOptions").replaceChildren();
  const colors = (source.usableBlocks.length ? source.usableBlocks : project.paletteAssets.block || [])
    .filter((id) => blockWeight(source, id) > 0);
  if (colors.length < 2) {
    status.textContent = "사용 색상에서 생성 가중치가 0보다 큰 블록을 2종 이상 선택하세요.";
    return;
  }
  if (!difficultyTerrainIds(source).length) {
    status.textContent = "Terrain 탭에서 매치로 제거할 수 있는 지형을 등록하고 반응 규칙을 설정하세요.";
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
      const cave = buildDifficultyCandidate(source, colors, target, attempt, keepPlacement);
      if (!cave) continue;
      const signature = JSON.stringify([cave.layers, cave.objectives, cave.moveLimit]);
      if (signatures.has(signature)) continue;
      signatures.add(signature);
      const results = [];
      for (let run = 0; run < runs; run += 1) {
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (canceled || !dialog.open || activeCave() !== source) return;
        results.push(runAutoGame(cave, run));
      }
      const batch = summarizeBatch(results);
      if (batch.wins) candidates.push({ cave, batch, score: difficultyCandidateScore(cave, batch) });
    }
    candidates.sort((a, b) => Math.abs(a.score - target) - Math.abs(b.score - target) || b.batch.wins - a.batch.wins);
    const best = candidates.slice(0, 3);
    renderDifficultyCandidates(source, best);
    status.textContent = best.length
      ? "목표 " + target + " · 가까운 후보 " + best.length + "개 · 후보당 자동 플레이 " + runs + "회"
      : "자동 플레이에서 클리어한 후보가 없습니다. 배치 유지 옵션이나 보드 구성을 확인해 주세요.";
  } catch (error) {
    console.error(error);
    status.textContent = "후보를 만드는 중 오류가 발생했습니다.";
  } finally {
    dialog.removeEventListener("close", cancel);
    fields.disabled = false;
    submit.disabled = false;
  }
}

function analyzeDifficulty(cave) {
  const totalBlocks = cave.layers.block.filter(Boolean).length;
  const usedColors = new Set(cave.layers.block.filter(Boolean));
  const gimmickCount = cave.layers.gimmick.filter(Boolean).length;
  const itemCount = cave.layers.item.filter(Boolean).length;
  const area = cave.width * cave.height;
  const referenceMoves = cave.testClearMoves > 0 ? cave.testClearMoves : cave.parMoves;
  const slack = cave.moveLimit - referenceMoves;
  const budgetRatio = cave.moveLimit / Math.max(1, referenceMoves);
  const objectiveWork = cave.objectives.reduce((sum, objective) => {
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

function validateCave(cave) {
  const errors = [];
  const warnings = [];
  const unsupported = [];
  const analysis = analyzeDifficulty(cave);
  const teleportA = cave.layers.gimmick.filter((value) => value === "teleport-a").length;
  const teleportB = cave.layers.gimmick.filter((value) => value === "teleport-b").length;
  const initialMatches = findMatches(cave).size;
  if (!analysis.totalBlocks) errors.push("퍼즐 블록이 하나도 없습니다.");
  if (!cave.objectives.length) errors.push("목표를 하나 이상 설정해야 합니다.");
  if (cave.objectives.length > MAX_OBJECTIVES) errors.push(`목표는 최대 ${MAX_OBJECTIVES}개까지 설정할 수 있습니다.`);
  const objectiveKeys = new Set();
  cave.objectives.forEach((objective) => {
    const label = objectiveLabel(objective);
    const key = `${objective.layer}:${objective.targetId}:${objective.action}`;
    const placed = countObjectiveAssets(cave, objective);
    const target = resolvedObjectiveCount(cave, objective);
    if (objectiveKeys.has(key)) errors.push(`${label} 목표가 중복되어 있습니다.`);
    objectiveKeys.add(key);
    if (!project.paletteAssets[objective.layer]?.includes(objective.targetId)) errors.push(`${label} 대상이 현재 팔레트에 없습니다.`);
    const limitation = ddungGoalLimitation(cave, objective);
    if (limitation) unsupported.push(`${label} · ${limitation}`);
    if (target < 1 && !limitation) errors.push(`${label} 목표 수량은 1 이상이어야 합니다.`);
    if (!limitation && objective.countMode === "auto-map" && placed < 1) errors.push(`${label} 자동 수량 목표지만 맵에 배치된 대상이 없습니다.`);
    if (!limitation && objective.layer === "block" && !cave.usableBlocks.includes(objective.targetId) && (!isDdungSource(cave.externalSource) || placed < target)) errors.push(`${label} 색상이 사용 가능 블록에서 제외되어 있습니다.`);
    if (objective.layer === "terrain" && cave.terrainRules?.[objective.targetId]?.reaction === "none") errors.push(`${label} 목표는 제거 불가 규칙입니다. Terrain 반응을 같은 칸 또는 인접 매치로 바꾸세요.`);
    if (objective.countMode === "manual" && objective.layer !== "block" && target > placed) warnings.push(`${label} 목표 ${target}개보다 맵 배치 ${placed}개가 적습니다.`);
    if (objective.layer === "block" && placed < target) warnings.push(`${label}은 현재 ${placed}개입니다. 리필에서 생성될 수 있지만 목표 달성 편차가 커질 수 있습니다.`);
  });
  if (cave.moveLimit < 1) errors.push("Moves는 1 이상이어야 합니다.");
  if (cave.parMoves < 1) errors.push("권장 클리어 Moves는 1 이상이어야 합니다.");
  if (!cave.usableBlocks.length) errors.push("사용 가능한 블록 색상을 하나 이상 선택해야 합니다.");
  else if (!cave.usableBlocks.some((id) => blockWeight(cave, id) > 0)) errors.push("사용 색상 중 하나 이상의 생성 가중치를 0보다 높게 설정하세요.");
  if (teleportA !== teleportB) errors.push(`Teleport A/B 개수가 다릅니다. (${teleportA}/${teleportB})`);
  if (cave.layers.block.some((block) => block && !cave.usableBlocks.includes(block))) {
    if (isDdungSource(cave.externalSource)) warnings.push("리필 색상에 없는 고정 배치 블록이 있습니다.");
    else errors.push("사용 색상에서 제외된 블록이 맵에 배치되어 있습니다.");
  }
  if (cave.moveLimit < cave.parMoves) errors.push(`Moves ${cave.moveLimit}회가 권장 클리어 ${cave.parMoves}회보다 적습니다.`);
  if (cave.testClearMoves > cave.moveLimit) errors.push(`테스트 클리어 ${cave.testClearMoves}회가 제한 ${cave.moveLimit}회를 초과합니다.`);
  if (!cave.testClearMoves) warnings.push("테스트 클리어 Moves가 없습니다. 실제 플레이 기록을 입력하면 난이도 판정이 더 정확해집니다.");
  if (cave.moveLimit >= cave.parMoves * 2) warnings.push("허용 Moves가 권장 클리어 횟수의 2배 이상이라 난이도가 크게 낮아질 수 있습니다.");
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

function renderSimulationGrid(cave, interactive = false, remainingTargets = [], damage = playtestState?.cave === cave ? playtestState : null) {
  const grid = $("simulationGrid");
  grid.style.gridTemplateColumns = `repeat(${cave.width}, 30px)`;
  grid.innerHTML = "";
  for (let index = 0; index < cave.width * cave.height; index += 1) {
    const cell = document.createElement(interactive ? "button" : "div");
    const canActivate = interactive && !isBarrier(cave, index) && specialEffect(cave, cave.playtestPieces[index]);
    const canSwap = interactive && playtestState.paused && cave.layers.block[index] && !isBarrier(cave, index);
    const selected = canSwap && playtestState.selectedIndex === index;
    cell.className = `map-cell${canActivate || canSwap ? " playable" : ""}${selected ? " selected" : ""}`;
    cell.type = interactive ? "button" : undefined;
    applyCellVisual(cell, cave, index);
    if (interactive && [playtestState.hint?.first, playtestState.hint?.second].includes(index)) cell.classList.add("hinted");
    const targets = remainingTargets.filter(({ objective }) =>
      matchesObjectiveAsset(objective, cave.layers[objective.layer][index]) &&
      (objective.layer !== "gimmick" || !playtestState.activatedGimmicks.has(index)));
    if (targets.length) {
      cell.classList.add("remaining-target");
      cell.title = targets.map(({ objective }) => objectiveLabel(objective)).join(", ");
      cell.setAttribute("aria-label", `남은 목표 · ${cell.title}`);
    }
    if (damage && !isExcluded(cave, index)) {
      const details = [];
      if (isBarrier(cave, index)) {
        cell.classList.add("locked-cell");
        const lock = document.createElement("span");
        lock.className = "cell-lock";
        lock.textContent = "🔒";
        lock.setAttribute("aria-hidden", "true");
        cell.appendChild(lock);
        details.push("잠긴 칸");
      }
      const terrainId = cave.layers.terrain[index];
      const rule = terrainId ? cave.terrainRules?.[terrainId] : null;
      const boxDurability = ddungBoxDurability(cave, index);
      const durability = boxDurability || (rule && rule.reaction !== "none" ? rule.durability : 0);
      if (durability) {
        const hits = boxDurability ? damage.gimmickHits[index] : damage.terrainHits[index];
        const remaining = Math.max(0, durability - (hits || 0));
        const badge = document.createElement("span");
        badge.className = `terrain-hp${remaining < durability ? " damaged" : ""}`;
        badge.textContent = remaining;
        badge.setAttribute("aria-hidden", "true");
        cell.appendChild(badge);
        const layer = boxDurability ? "gimmick" : "terrain";
        const assetId = cave.layers[layer][index];
        details.push(`${getAsset(layer, assetId).name} 내구도 ${remaining}/${durability}`);
      }
      if (details.length) {
        cell.title = [cell.title, ...details].filter(Boolean).join(" · ");
        cell.setAttribute("aria-label", cell.title);
      }
    }
    if (interactive) {
      cell.disabled ||= !(canActivate || canSwap);
      const piece = cave.playtestPieces[index];
      if (piece && !canActivate && !isBarrier(cave, index)) {
        cell.title = [cell.title, "발동 효과가 연결되지 않은 특수 피스"].filter(Boolean).join(" · ");
      }
      if (canActivate) {
        cell.setAttribute("aria-label", [`특수 피스 발동 · ${specialEffectLabel(canActivate)}`, cell.title].filter(Boolean).join(" · "));
      } else if (canSwap) {
        cell.setAttribute("aria-label", cellDescription(cave, index));
        cell.setAttribute("aria-pressed", String(selected));
      }
      if (!cell.disabled) cell.addEventListener("click", () => playtestCell(index));
    }
    grid.appendChild(cell);
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
  $("usePlaytestResultButton").hidden = true;
  if (canPractice) {
    playtestState = createPlayState(cave, `playtest-${crypto.randomUUID()}`, true);
    playtestState.validation = validation;
    renderPlaytest();
  } else {
    playtestState = null;
    $("playtestPauseButton").hidden = true;
    $("playtestHintButton").hidden = true;
    const baseline = blocked ? null : readValidationBaseline(cave);
    const simulationCave = baseline ? { ...cave, randomSeed: baseline.seed } : cave;
    const batch = blocked ? null : runBatchSimulation(simulationCave, baseline?.runs ?? cave.simulationRuns);
    const objectiveSummary = cave.objectives.map((objective) => `${escapeHtml(objectiveLabel(objective))} × ${resolvedObjectiveCount(cave, objective)}`).join(" · ");
    const result = $("simulationResult");
    result.className = `simulation-result ${blocked ? "error" : validation.warnings.length ? "warning" : "success"}`;
    result.innerHTML = `
      <strong>${validation.unsupported.length ? "원본 동작 판정 미지원" : blocked ? "검증 실패" : "검증 통과"}</strong><br>
      ${batch ? `자동 플레이 난이도 <b>${batch.label}</b> · 휴리스틱 ${validation.analysis.label} (${validation.analysis.score}점)<br>` : `휴리스틱 난이도 ${validation.analysis.label} (${validation.analysis.score}점)<br>`}
      목표 ${objectiveSummary} · 제한 ${cave.moveLimit} · 권장 ${cave.parMoves}${cave.testClearMoves ? ` · 테스트 ${cave.testClearMoves}` : ""}<br>
      여유 Moves ${validation.analysis.slack >= 0 ? "+" : ""}${validation.analysis.slack} · Gravity ${cave.gravity}
      ${batch ? `<div class="batch-summary"><span><b>${batch.clearRate}%</b>클리어율 (${batch.wins}/${batch.runs})</span><span><b>${batch.average || "-"}</b>평균 Moves</span><span><b>${batch.median || "-"} / ${batch.p90 || "-"}</b>중앙 / 90%</span></div><div>${batch.runs}회 중 성공 ${batch.wins}회 · 이동 횟수 소진 ${batch.lost}회 · 가능한 매치 없음 ${batch.stuck}회 · 셔플 총 ${batch.shuffles}회</div><div>목표 우선 휴리스틱 자동 플레이 결과이며 실제 유저 난이도와는 차이가 날 수 있습니다.</div>` : ""}
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

function findMatches(cave, runs, protectedCells) {
  const matches = new Set();
  const blocks = cave.layers.block.map((color, index) =>
    color && color !== "ddung-dust-piece" && !protectedCells?.has(index) && !isBarrier(cave, index) ? color : null);
  for (let y = 0; y < cave.height; y += 1) {
    let start = 0;
    for (let x = 1; x <= cave.width; x += 1) {
      const current = x < cave.width ? blocks[y * cave.width + x] : null;
      const first = blocks[y * cave.width + start];
      if (current === first && first) continue;
      if (first && x - start >= 3) {
        const cells = runs ? [] : null;
        for (let fill = start; fill < x; fill += 1) {
          const index = y * cave.width + fill;
          matches.add(index);
          cells?.push(index);
        }
        if (runs) runs.push({ axis: "horizontal", cells });
      }
      start = x;
    }
  }
  for (let x = 0; x < cave.width; x += 1) {
    let start = 0;
    for (let y = 1; y <= cave.height; y += 1) {
      const current = y < cave.height ? blocks[y * cave.width + x] : null;
      const first = blocks[start * cave.width + x];
      if (current === first && first) continue;
      if (first && y - start >= 3) {
        const cells = runs ? [] : null;
        for (let fill = start; fill < y; fill += 1) {
          const index = fill * cave.width + x;
          matches.add(index);
          cells?.push(index);
        }
        if (runs) runs.push({ axis: "vertical", cells });
      }
      start = y;
    }
  }
  if (cave.specialMatches) {
    for (let y = 0; y < cave.height - 1; y += 1) {
      for (let x = 0; x < cave.width - 1; x += 1) {
        const topLeft = y * cave.width + x;
        const color = blocks[topLeft];
        if (!color) continue;
        const cells = [topLeft, topLeft + 1, topLeft + cave.width, topLeft + cave.width + 1];
        if (!cells.every((index) => blocks[index] === color)) continue;
        cells.forEach((index) => matches.add(index));
        runs?.push({ axis: "square", cells });
      }
    }
  }
  return matches;
}

function neighborsOf(cave, index) {
  const x = index % cave.width;
  const neighbors = [];
  if (x > 0) neighbors.push(index - 1);
  if (x < cave.width - 1) neighbors.push(index + 1);
  if (index >= cave.width) neighbors.push(index - cave.width);
  if (index + cave.width < cave.width * cave.height) neighbors.push(index + cave.width);
  return neighbors;
}

function createObjectiveProgress(cave) {
  return cave.objectives.map((objective) => ({
    id: objective.id,
    current: 0,
    target: resolvedObjectiveCount(cave, objective),
  }));
}

function advanceObjectives(state, layer, targetId, amount = 1) {
  state.cave.objectives.forEach((objective, index) => {
    if (objective.layer !== layer || !matchesObjectiveAsset(objective, targetId)) return;
    const progress = state.objectiveProgress[index];
    progress.current = Math.min(progress.target, progress.current + amount);
  });
}

function allObjectivesComplete(state) {
  return !state.goalLimitations.some(Boolean) && state.objectiveProgress.length > 0 &&
    state.objectiveProgress.every((progress, index) => {
      const objective = state.cave.objectives[index];
      if (isDdungSource(state.cave.externalSource) && ddungUsesBoardCount(ddungObjectiveType(objective)) &&
          objective.countMode === "auto-map") return countObjectiveAssets(state.cave, objective) === 0;
      return progress.current >= progress.target;
    });
}

function objectiveProgressHtml(state) {
  return `<div class="objective-progress">${state.cave.objectives.map((objective, index) => {
    const progress = state.objectiveProgress[index];
    if (state.goalLimitations[index]) return `<div class="objective-progress-row"><span>${escapeHtml(objectiveLabel(objective))}</span><span></span><b>판정 미지원</b></div>`;
    const percent = Math.min(100, Math.round(progress.current / Math.max(1, progress.target) * 100));
    return `<div class="objective-progress-row"><span>${escapeHtml(objectiveLabel(objective))}</span><i style="--progress:${percent}%"></i><b>${Math.min(progress.current, progress.target)} / ${progress.target}</b></div>`;
  }).join("")}</div>`;
}

function gravityLines(cave) {
  const lines = [];
  if (cave.gravity === "down" || cave.gravity === "up") {
    for (let x = 0; x < cave.width; x += 1) {
      const line = [];
      if (cave.gravity === "down") for (let y = cave.height - 1; y >= 0; y -= 1) line.push(y * cave.width + x);
      else for (let y = 0; y < cave.height; y += 1) line.push(y * cave.width + x);
      lines.push(line);
    }
  } else {
    for (let y = 0; y < cave.height; y += 1) {
      const line = [];
      if (cave.gravity === "right") for (let x = cave.width - 1; x >= 0; x -= 1) line.push(y * cave.width + x);
      else for (let x = 0; x < cave.width; x += 1) line.push(y * cave.width + x);
      lines.push(line);
    }
  }
  return lines;
}

function ddungBoxDurability(cave, index) {
  if (!isDdungSource(cave.externalSource)) return 0;
  const id = cave.layers.gimmick[index];
  if (id === "ddung-iron-box") return 6;
  return id === "ddung-box" ? 3 : 0;
}

function isBarrier(cave, index) {
  if (index < 0 || index >= cave.width * cave.height || isExcluded(cave, index)) return true;
  if (ddungBoxDurability(cave, index)) return true;
  const terrainId = cave.layers.terrain[index];
  const rule = terrainId ? cave.terrainRules?.[terrainId] : null;
  return Boolean(rule?.blocksFlow || rule?.locksBlock);
}

function settleStraight(cave) {
  const pieces = cave.playtestPieces;
  for (const line of gravityLines(cave)) {
    let segment = [];
    const settle = () => {
      const values = segment.filter((index) => cave.layers.block[index])
        .map((index) => ({ block: cave.layers.block[index], piece: pieces?.[index] }));
      segment.forEach((index, position) => {
        cave.layers.block[index] = values[position]?.block ?? null;
        if (pieces) pieces[index] = values[position]?.piece ?? null;
      });
      segment = [];
    };
    for (const index of line) {
      if (isBarrier(cave, index)) settle();
      else segment.push(index);
    }
    settle();
  }
}

function flowOffsets(cave, state) {
  const directions = {
    down: [[-1, 1], [1, 1]],
    up: [[-1, -1], [1, -1]],
    left: [[-1, -1], [-1, 1]],
    right: [[1, -1], [1, 1]],
  };
  const [first, second] = directions[cave.gravity];
  if (cave.flowRule === "none") return [];
  if (cave.flowRule === "right-first") return [second, first];
  if (cave.flowRule === "alternate") {
    const reverse = state.flowTurn % 2 === 1;
    state.flowTurn += 1;
    return reverse ? [second, first] : [first, second];
  }
  if (cave.flowRule === "seeded-random") return state.random() < 0.5 ? [first, second] : [second, first];
  return [first, second];
}

function applyGravity(cave, state) {
  settleStraight(cave);
  if (!state || cave.flowRule === "none") return 0;
  const directVectors = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
  const [directX, directY] = directVectors[cave.gravity];
  let flowMoves = 0;
  for (let pass = 0; pass < cave.width * cave.height * 4; pass += 1) {
    let moved = false;
    const order = gravityLines(cave).flat();
    for (const index of order) {
      if (!cave.layers.block[index]) continue;
      const x = index % cave.width;
      const y = Math.floor(index / cave.width);
      const nextX = x + directX;
      const nextY = y + directY;
      if (nextX < 0 || nextX >= cave.width || nextY < 0 || nextY >= cave.height) continue;
      const directIndex = nextY * cave.width + nextX;
      if (!isBarrier(cave, directIndex)) continue;
      const offsets = flowOffsets(cave, state);
      for (const [offsetX, offsetY] of offsets) {
        const targetX = x + offsetX;
        const targetY = y + offsetY;
        if (targetX < 0 || targetX >= cave.width || targetY < 0 || targetY >= cave.height) continue;
        const targetIndex = targetY * cave.width + targetX;
        if (isBarrier(cave, targetIndex) || cave.layers.block[targetIndex]) continue;
        swapPlaytestBlocks(cave, targetIndex, index);
        flowMoves += 1;
        moved = true;
        break;
      }
    }
    if (!moved) break;
    settleStraight(cave);
  }
  return flowMoves;
}

function chooseRefillColor(state, colors) {
  const mode = state.cave.levelSettings?.spawnMode ?? 1;
  if (mode === 0) return colors[Math.floor(state.random() * colors.length)];
  const weights = colors.map((color) => blockWeight(state.cave, color));
  const total = weights.reduce((sum, weight) => sum + weight, 0);
  if (!total) return null;
  const offsets = state.spawnOffsets ??= {};
  const roll = Math.floor(state.random() * 100);
  let lower = 0;
  let selected = -1;
  for (const [index, color] of colors.entries()) {
    const upper = lower + weights[index] * 100 / total + (mode === 2 ? offsets[color] || 0 : 0);
    if (roll >= lower && roll < upper) {
      selected = index;
      break;
    }
    lower = upper;
  }
  // DDUNG falls back to the first color without adjusting probabilities.
  if (selected < 0) return colors[0];
  if (mode === 2) {
    for (const [index, color] of colors.entries()) {
      offsets[color] = (offsets[color] || 0) + (index === selected ? 1 - colors.length : 1);
    }
  }
  return colors[selected];
}

function refillBlocks(state) {
  const { cave } = state;
  const colors = cave.usableBlocks;
  if (!colors.length) return;
  for (let index = 0; index < cave.layers.block.length; index += 1) {
    if (!cave.layers.block[index] && !isBarrier(cave, index)) {
      cave.layers.block[index] = chooseRefillColor(state, colors);
    }
  }
}

function damageTerrainFromMatches(state, matches, forcedTerrain = new Set(), removedBlocks = new Set()) {
  const cave = state.cave;
  let damaged = 0;
  let broken = 0;
  const brokenDetails = [];
  for (let index = 0; index < cave.layers.terrain.length; index += 1) {
    if (isExcluded(cave, index)) continue;
    const terrainId = cave.layers.terrain[index];
    const rule = terrainId ? cave.terrainRules?.[terrainId] : null;
    const forced = forcedTerrain.has(index);
    if (!forced && (!rule || rule.reaction === "none")) continue;
    let affected = forced || (rule.reaction !== "adjacent-only" && matches.has(index));
    if (!affected && (rule.reaction === "adjacent-only" || rule.reaction === "splash")) {
      affected = neighborsOf(cave, index).some((neighbor) => removedBlocks.has(neighbor));
    }
    if (!affected && rule.reaction === "adjacent") {
      affected = neighborsOf(cave, index).some((neighbor) => matches.has(neighbor));
    }
    if (!affected) continue;
    state.terrainHits[index] = (state.terrainHits[index] || 0) + 1;
    damaged += 1;
    if (forced || state.terrainHits[index] >= rule.durability) {
      brokenDetails.push({ index, terrainId });
      cave.layers.terrain[index] = null;
      state.terrainHits[index] = 0;
      broken += 1;
    }
  }
  return { damaged, broken, brokenDetails };
}

function resolveMatches(state, captureFrame, activation = [], preferred = []) {
  let runs = [];
  let matches = findMatches(state.cave, runs);
  activation.forEach((index) => matches.add(index));
  let cascade = 0;
  let removed = 0;
  let terrainDamaged = 0;
  let terrainBroken = 0;
  let flowMoves = 0;
  const newPieces = new Set();
  let protectedCells = new Set();
  while (matches.size && cascade < 20) {
    const expanded = expandSpecialHits(state, matches, protectedCells, state.beeRandom);
    const created = createdSpecials(state.cave, runs, preferred, matches);
    const triggered = [...expanded.hits].some((index) => !isBarrier(state.cave, index) && specialEffect(state.cave, state.cave.playtestPieces[index]));
    matches = expanded.hits;
    const highlighted = new Set([...matches, ...expanded.targetedTerrain]);
    captureFrame?.(triggered ? "특수 피스 폭발" : "매치", [...highlighted], "match");
    // A blast can break an obstacle without clearing the piece it was protecting.
    const clearableCells = [...matches].filter((index) => !isBarrier(state.cave, index));
    const removedBlocks = new Set(clearableCells.filter((index) => state.cave.layers.block[index] && !created.has(index)));
    const terrainResult = damageTerrainFromMatches(state, matches, expanded.targetedTerrain, removedBlocks);
    terrainDamaged += terrainResult.damaged;
    terrainBroken += terrainResult.broken;
    terrainResult.brokenDetails.forEach(({ terrainId }) => advanceObjectives(state, "terrain", terrainId));
    for (let index = 0; index < state.cave.layers.gimmick.length; index += 1) {
      const gimmickId = state.cave.layers.gimmick[index];
      if (!gimmickId || isExcluded(state.cave, index) || state.activatedGimmicks.has(index)) continue;
      const affected = matches.has(index) || neighborsOf(state.cave, index).some((neighbor) => matches.has(neighbor));
      if (affected) {
        const durability = ddungBoxDurability(state.cave, index);
        if (durability) {
          state.gimmickHits[index] += 1;
          if (state.gimmickHits[index] < durability) continue;
          state.cave.layers.gimmick[index] = null;
        } else {
          state.activatedGimmicks.add(index);
        }
        advanceObjectives(state, "gimmick", gimmickId);
      }
    }
    clearableCells.forEach((index) => {
      const blockId = state.cave.layers.block[index];
      if (blockId && !created.has(index)) {
        advanceObjectives(state, "block", blockId);
        removed += 1;
      }
      const itemId = state.cave.layers.item[index];
      if (itemId) {
        advanceObjectives(state, "item", itemId);
        state.cave.layers.item[index] = null;
      }
      state.cave.playtestPieces[index] = created.get(index) ?? null;
      if (!created.has(index)) state.cave.layers.block[index] = null;
    });
    for (const piece of created.values()) newPieces.add(piece);
    captureFrame?.(created.size ? "특수 피스 생성" : "블록 제거", created.size ? [...created.keys()] : [...matches], "match");
    flowMoves += applyGravity(state.cave, state);
    refillBlocks(state);
    captureFrame?.("낙하 및 블록 채우기", [], "refill");
    cascade += 1;
    runs = [];
    preferred = [];
    protectedCells = new Set();
    if (newPieces.size) {
      state.cave.playtestPieces.forEach((piece, index) => {
        if (newPieces.has(piece)) protectedCells.add(index);
      });
    }
    matches = findMatches(state.cave, runs, protectedCells);
  }
  return { cascade, removed, terrainDamaged, terrainBroken, flowMoves, capped: matches.size > 0 };
}

function hasPossibleSwap(cave) {
  const blocks = cave.layers.block;
  for (let index = 0; index < blocks.length; index += 1) {
    if (!blocks[index] || isBarrier(cave, index)) continue;
    const x = index % cave.width;
    const candidates = [];
    if (x < cave.width - 1) candidates.push(index + 1);
    if (index + cave.width < blocks.length) candidates.push(index + cave.width);
    for (const other of candidates) {
      if (!blocks[other] || blocks[other] === blocks[index] || isBarrier(cave, other)) continue;
      [blocks[index], blocks[other]] = [blocks[other], blocks[index]];
      const matches = findMatches(cave);
      const possible = matches.has(index) || matches.has(other);
      [blocks[index], blocks[other]] = [blocks[other], blocks[index]];
      if (possible) return true;
    }
  }
  return false;
}

function scoreAutoMove(state, { hits: matches, targetedTerrain }) {
  let score = matches.size + 12 * targetedTerrain.size;
  state.cave.objectives.forEach((objective) => {
    if (objective.layer === "block") {
      matches.forEach((index) => { if (!isBarrier(state.cave, index) && state.cave.layers.block[index] === objective.targetId) score += 6; });
    } else if (objective.layer === "item") {
      matches.forEach((index) => { if (!isBarrier(state.cave, index) && state.cave.layers.item[index] === objective.targetId) score += 10; });
    } else if (objective.layer === "terrain") {
      state.cave.layers.terrain.forEach((terrainId, index) => {
        if (terrainId !== objective.targetId) return;
        const reaction = state.cave.terrainRules?.[terrainId]?.reaction;
        const adjacent = neighborsOf(state.cave, index);
        if (reaction === "adjacent-only" || reaction === "splash") {
          if ((reaction === "splash" && matches.has(index)) ||
              adjacent.some((cell) => matches.has(cell) && state.cave.layers.block[cell] && !isBarrier(state.cave, cell))) score += 8;
        } else if (matches.has(index) || (reaction === "adjacent" && adjacent.some((cell) => matches.has(cell)))) {
          score += 8;
        }
      });
    } else if (objective.layer === "gimmick") {
      state.cave.layers.gimmick.forEach((gimmickId, index) => {
        if (gimmickId !== objective.targetId || state.activatedGimmicks.has(index)) return;
        if (matches.has(index) || neighborsOf(state.cave, index).some((neighbor) => matches.has(neighbor))) score += 7;
      });
    }
  });
  return score;
}

function listPossibleSwaps(state, firstOnly = false) {
  const cave = state.cave;
  const blocks = cave.layers.block;
  const candidates = [];
  for (let first = 0; first < blocks.length; first += 1) {
    if (!blocks[first] || isBarrier(cave, first) || specialEffect(cave, cave.playtestPieces[first])) continue;
    const x = first % cave.width;
    const others = [];
    if (x < cave.width - 1) others.push(first + 1);
    if (first + cave.width < blocks.length) others.push(first + cave.width);
    for (const second of others) {
      if (!blocks[second] || blocks[first] === blocks[second] || isBarrier(cave, second) ||
          specialEffect(cave, cave.playtestPieces[second])) continue;
      swapPlaytestBlocks(cave, first, second);
      const matches = findMatches(cave);
      const valid = matches.has(first) || matches.has(second);
      if (valid && !firstOnly) candidates.push({ first, second, score: scoreAutoMove(state, expandSpecialHits(state, matches)) });
      swapPlaytestBlocks(cave, first, second);
      if (valid && firstOnly) return [{ first, second }];
    }
  }
  return candidates;
}


const SPECIAL_EFFECTS = {
  row: "가로 한 줄", column: "세로 한 줄", area: "주변 3×3", cross: "가로·세로 십자", color: "같은 색 전체",
  target: "목표 타일 1칸 제거",
  fish: "벌 · 목표 한 칸 타격",
};

const SCRIPT_EFFECT_LABEL = "직접 작성한 스크립트";
const MAX_EFFECT_SCRIPT_LENGTH = 4000;
const effectScriptCache = new Map();

function parseEffectScript(source) {
  if (typeof source !== "string" || source.length > MAX_EFFECT_SCRIPT_LENGTH) {
    throw new Error("스크립트는 4,000자 이내로 입력하세요.");
  }
  let commands;
  try { commands = JSON.parse(source); }
  catch { throw new Error("스크립트를 JSON 배열로 입력하세요. 따옴표와 쉼표를 확인하세요."); }
  if (!Array.isArray(commands) || commands.length < 1 || commands.length > 16) {
    throw new Error("스크립트에는 명령을 1~16개 넣으세요.");
  }
  return commands.map((command, index) => {
    const fail = (message) => { throw new Error((index + 1) + "번째 명령: " + message); };
    const op = command?.op;
    if (typeof op !== "string" || !(Object.hasOwn(SPECIAL_EFFECTS, op) || op === "offsets")) {
      fail("지원 명령은 row, column, cross, area, color, target, fish, offsets입니다.");
    }
    const keys = op === "area" ? ["op", "radius"] : op === "offsets" ? ["op", "cells"] : ["op"];
    if (Object.keys(command).some((key) => !keys.includes(key))) fail("지원하지 않는 옵션이 있습니다.");
    if (op === "area" && Object.hasOwn(command, "radius") &&
        (!Number.isInteger(command.radius) || command.radius < 1 || command.radius > 5)) {
      fail("radius는 1~5 사이의 정수여야 합니다.");
    }
    if (op === "offsets" && (!Array.isArray(command.cells) || command.cells.length < 1 || command.cells.length > 64 ||
        !command.cells.every((pair) => Array.isArray(pair) && pair.length === 2 &&
          pair.every((value) => Number.isInteger(value) && Math.abs(value) <= 19)))) {
      fail("cells에 [가로, 세로] 정수 좌표를 1~64개 입력하세요. 각 값은 -19~19입니다.");
    }
    return command;
  });
}

function getEffectCommands(source) {
  if (typeof source !== "string" || source.length > MAX_EFFECT_SCRIPT_LENGTH) return null;
  if (!effectScriptCache.has(source)) {
    let commands = null;
    try { commands = parseEffectScript(source); } catch { /* Invalid imported effects stay inactive. */ }
    if (effectScriptCache.size >= 64) effectScriptCache.clear();
    effectScriptCache.set(source, commands);
  }
  return effectScriptCache.get(source);
}

function specialEffectLabel(effect) {
  return effect === "script" ? SCRIPT_EFFECT_LABEL : SPECIAL_EFFECTS[effect];
}

const DEFAULT_SPECIAL_EFFECTS = Object.freeze({ horizontal: "row", vertical: "column", bomb: "area", rainbow: "color", bee: "target" });

const DDUNG_SPECIAL_EFFECTS = Object.freeze({ 1: "row", 2: "column", 3: "area", 8: "fish" });

function specialEffect(cave, piece) {
  if (!piece) return null;
  const id = String(piece.type);
  const declared = cave.initialPieceDefinitions?.find((entry) => entry?.id === id);
  if (declared?.effect === "none") return null;
  if (declared?.effect === "script") return getEffectCommands(declared.effectScript) ? "script" : null;
  if (Object.hasOwn(SPECIAL_EFFECTS, declared?.effect)) return declared.effect;
  if (isDdungSource(cave.externalSource) && Object.hasOwn(DDUNG_SPECIAL_EFFECTS, id)) return DDUNG_SPECIAL_EFFECTS[id];
  return Object.hasOwn(DEFAULT_SPECIAL_EFFECTS, id) ? DEFAULT_SPECIAL_EFFECTS[id] : null;
}

function findRemainingTerrainTarget(state, origin, selected) {
  const { cave } = state;
  const remaining = cave.objectives.filter((objective, index) => {
    const progress = state.objectiveProgress[index];
    return objective.layer === "terrain" && !state.goalLimitations[index] && progress.current < progress.target;
  });
  const x = origin % cave.width;
  const y = Math.floor(origin / cave.width);
  let nearest = -1;
  let distance = Infinity;
  for (const [index, terrainId] of cave.layers.terrain.entries()) {
    if (!terrainId || selected.has(index) || isExcluded(cave, index)) continue;
    if (cave.terrainRules?.[terrainId]?.reaction === "adjacent-only") continue;
    if (!remaining.some((objective) => matchesObjectiveAsset(objective, terrainId))) continue;
    const steps = Math.abs(index % cave.width - x) + Math.abs(Math.floor(index / cave.width) - y);
    if (steps >= distance) continue;
    nearest = index;
    distance = steps;
  }
  return nearest;
}

function findBeeTarget(state, hits, protectedCells, random) {
  const { cave } = state;
  const goals = cave.objectives.filter((objective, index) => {
    const progress = state.objectiveProgress[index];
    return !state.goalLimitations[index] && progress.current < progress.target;
  });
  const targets = [];
  const fallback = [];
  for (let index = 0; index < cave.layers.block.length; index += 1) {
    if (hits.has(index) || protectedCells.has(index) || isExcluded(cave, index)) continue;
    if (goals.some((objective) => {
      const id = cave.layers[objective.layer][index];
      return id && matchesObjectiveAsset(objective, id);
    })) targets.push(index);
    else if (cave.layers.block[index] && !isBarrier(cave, index)) fallback.push(index);
  }
  const candidates = targets.length ? targets : fallback;
  return candidates.length ? candidates[Math.floor(random() * candidates.length)] : -1;
}

function expandSpecialHits(state, matches, protectedCells = new Set(), beeRandom = () => 0.5) {
  const { cave } = state;
  const hits = new Set(matches);
  const targetedTerrain = new Set();
  for (const index of hits) {
    if (isBarrier(cave, index)) continue;
    const effect = specialEffect(cave, cave.playtestPieces[index]);
    if (!effect) continue;
    const x = index % cave.width;
    const y = Math.floor(index / cave.width);
    const color = cave.layers.block[index];
    const definition = effect === "script" && cave.initialPieceDefinitions.find((entry) => entry?.id === String(cave.playtestPieces[index].type));
    const commands = effect === "script" ? getEffectCommands(definition.effectScript) : [{ op: effect }];
    for (const { op, radius = 1, cells } of commands) {
      if (op === "fish") {
        const target = findBeeTarget(state, hits, protectedCells, beeRandom);
        if (target >= 0) hits.add(target);
        continue;
      }
      if (op === "target") {
        const target = findRemainingTerrainTarget(state, index, targetedTerrain);
        if (target >= 0) targetedTerrain.add(target);
        continue;
      }
      if (op === "offsets") {
        for (const [dx, dy] of cells) {
          const targetX = x + dx;
          const targetY = y + dy;
          if (targetX < 0 || targetX >= cave.width || targetY < 0 || targetY >= cave.height) continue;
          const other = targetY * cave.width + targetX;
          if (!isExcluded(cave, other) && !protectedCells.has(other)) hits.add(other);
        }
        continue;
      }
      for (let other = 0; other < cave.layers.block.length; other += 1) {
        const dx = Math.abs(other % cave.width - x);
        const dy = Math.abs(Math.floor(other / cave.width) - y);
        const affected = (op === "row" && dy === 0) || (op === "column" && dx === 0) ||
          (op === "cross" && (dx === 0 || dy === 0)) || (op === "area" && dx <= radius && dy <= radius) ||
          (op === "color" && color && cave.layers.block[other] === color);
        if (affected && !isExcluded(cave, other) && !protectedCells.has(other)) hits.add(other);
      }
    }
  }
  return { hits, targetedTerrain };
}

function createdSpecials(cave, runs, preferred, hits) {
  const result = new Map();
  if (!cave.specialMatches) return result;
  const reserved = new Set();
  const create = (cells, type, candidates = cells) => {
    if (cells.some((index) => reserved.has(index))) return;
    const index = [...preferred.filter((index) => candidates.includes(index)), ...candidates]
      .find((index) => !cave.playtestPieces[index] && hits.has(index));
    if (index === undefined) return;
    const definition = cave.initialPieceDefinitions?.find((entry) => entry.id === type) ||
      EDITABLE_INITIAL_PIECES.find((entry) => entry.id === type);
    result.set(index, { type, name: definition.name, symbol: definition.symbol });
    cells.forEach((cell) => reserved.add(cell));
  };
  for (const { cells } of runs) {
    if (cells.length >= 5) create(cells, "rainbow", [cells[Math.floor(cells.length / 2)], ...cells]);
  }
  const vertical = new Map();
  runs.filter(({ axis }) => axis === "vertical").forEach((run) =>
    run.cells.forEach((index) => vertical.set(index, run.cells)));
  for (const { cells, axis } of runs) {
    if (axis !== "horizontal") continue;
    const center = cells.find((index) => vertical.has(index));
    if (center !== undefined) create([...cells, ...vertical.get(center)], "bomb", [center]);
  }
  for (const { cells, axis } of runs) {
    if (axis === "square") create(cells, "bee");
    else if (cells.length === 4) create(cells, axis, [cells[1], ...cells]);
  }
  return result;
}

function swapPlaytestBlocks(cave, first, second) {
  const blocks = cave.layers.block;
  const pieces = cave.playtestPieces;
  [blocks[first], blocks[second]] = [blocks[second], blocks[first]];
  [pieces[first], pieces[second]] = [pieces[second], pieces[first]];
}

function findPlayableAction(state) {
  const { cave } = state;
  const special = cave.playtestPieces.findIndex((piece, index) =>
    cave.layers.block[index] && !isBarrier(cave, index) && specialEffect(cave, piece));
  return special >= 0 ? { first: special } : listPossibleSwaps(state, true)[0];
}

function ensurePlayableBoard(state, captureFrame) {
  if (findPlayableAction(state)) return;
  const { cave } = state;
  const blocks = cave.layers.block;
  const slots = blocks.flatMap((color, index) =>
    color && color !== "ddung-dust-piece" && !cave.playtestPieces[index] && !isBarrier(cave, index) ? [index] : []);
  const original = slots.map((index) => blocks[index]);
  if (slots.length >= 4 && new Set(original).size >= 2) {
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const shuffled = [...original];
      for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const other = Math.floor(state.shuffleRandom() * (index + 1));
        [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
      }
      slots.forEach((slot, index) => { blocks[slot] = shuffled[index]; });
      if (findMatches(cave).size || !listPossibleSwaps(state, true).length) continue;
      state.shuffleCount += 1;
      state.message += " · 가능한 교환이 없어 보드를 섞었습니다.";
      captureFrame?.("보드 셔플", slots, "swap", 350);
      return;
    }
    slots.forEach((slot, index) => { blocks[slot] = original[index]; });
  }
  state.status = "stuck";
  state.message = "셔플로 가능한 교환을 만들 수 없습니다.";
}

function showPlaytestHint() {
  const state = playtestState;
  if (!state?.paused || state.status !== "playing" || state.animating) return;
  const action = findPlayableAction(state);
  if (!action) return;
  state.selectedIndex = null;
  state.hint = action;
  state.message = action.second === undefined ? "강조된 특수 피스를 눌러 발동하세요." : "강조된 두 블록을 교환하세요.";
  renderPlaytest();
}

function chooseAutoAction(state) {
  const cave = state.cave;
  const candidates = listPossibleSwaps(state);
  cave.playtestPieces.forEach((piece, index) => {
    if (!specialEffect(cave, piece) || isBarrier(cave, index)) return;
    candidates.push({ first: index, score: scoreAutoMove(state, expandSpecialHits(state, [index])) });
  });
  if (!candidates.length) return null;
  const bestScore = Math.max(...candidates.map(({ score }) => score));
  const best = candidates.filter(({ score }) => score === bestScore);
  return best[Math.floor(state.random() * best.length)];
}

function playSimulationTurn(state, action, captureFrame) {
  if (!action) {
    state.status = "stuck";
    state.message = "가능한 교환이나 특수 피스 발동이 없습니다.";
    return;
  }
  const { first, second } = action;
  const cave = state.cave;
  const activation = second === undefined;
  if (activation) {
    captureFrame?.("특수 피스 발동", [first], "match");
  } else {
    swapPlaytestBlocks(cave, first, second);
    captureFrame?.("블록 교환", [first, second], "swap", 250);
  }
  state.movesLeft -= 1;
  const resolved = resolveMatches(state, captureFrame, activation ? [first] : [], activation ? [] : [second, first]);
  state.message = resolved.removed + "개 제거 · " + resolved.cascade + "연쇄 · Terrain " + resolved.terrainBroken + "개 파괴";
  if (allObjectivesComplete(state)) state.status = "won";
  else if (!state.movesLeft) state.status = "lost";
  else ensurePlayableBoard(state, captureFrame);
}

function createPlayState(cave, seedSuffix, manual = false) {
  const copy = deepCopy(cave);
  copy.layers.block.forEach((id, index) => {
    if (id && ddungBoxDurability(copy, index)) copy.layers.block[index] = null;
  });
  copy.playtestPieces = copy.layers.block.map((block, index) => {
    const piece = block ? initialPieceAt(copy, index) : null;
    return piece && (!piece.color || piece.color === block) ? piece : null;
  });
  const state = {
    cave: copy,
    movesLeft: copy.moveLimit,
    paused: manual,
    selectedIndex: null,
    status: "playing",
    message: manual ? "교환할 인접 블록 두 개를 클릭하세요." : "자동 플레이를 시작합니다.",
    random: seededRandom(`${copy.randomSeed}|${seedSuffix}`),
    shuffleRandom: seededRandom(`${copy.randomSeed}|${seedSuffix}|shuffle`),
    shuffleCount: 0,
    beeRandom: seededRandom(`${copy.randomSeed}|${seedSuffix}|bee`),
    terrainHits: Array(copy.width * copy.height).fill(0),
    gimmickHits: Array(copy.width * copy.height).fill(0),
    activatedGimmicks: new Set(),
    objectiveProgress: createObjectiveProgress(copy),
    goalLimitations: copy.objectives.map((objective) => ddungGoalLimitation(copy, objective)),
    flowTurn: 0,
  };
  ensurePlayableBoard(state);
  return state;
}

function runAutoGame(cave, runIndex) {
  const state = createPlayState(cave, `batch-${runIndex}`);
  if (state.goalLimitations.some(Boolean)) return { status: "unsupported", moves: 0, runIndex };
  while (state.status === "playing") playSimulationTurn(state, chooseAutoAction(state));
  return { status: state.status, moves: cave.moveLimit - state.movesLeft, shuffles: state.shuffleCount, runIndex };
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
  renderPlaytest();
  runAnimatedPlaytest(playtestState);
}

async function showPlaytestFrames(state, frames, stopOnPause) {
  for (const frame of frames) {
    if (playtestState !== state || !$("simulationDialog").open || (stopOnPause && state.paused)) return;
    renderSimulationGrid(frame.cave, false, [], frame);
    const grid = $("simulationGrid");
    for (const index of frame.cells) grid.children[index]?.classList.add("playtest-frame-" + frame.kind);
    $("playtestFrameStatus").textContent = frame.label;
    await new Promise((resolve) => setTimeout(resolve, frame.delay));
  }
}

async function animatePlaytestTurn(state, action) {
  const frames = [];
  const capture = (label, cells, kind, delay = 180) => {
    const layers = Object.fromEntries(Object.entries(state.cave.layers).map(([layer, values]) => [layer, [...values]]));
    frames.push({
      cave: { ...state.cave, layers, playtestPieces: [...state.cave.playtestPieces] },
      terrainHits: [...state.terrainHits], gimmickHits: [...state.gimmickHits],
      label, cells, kind, delay,
    });
  };
  state.animating = true;
  try {
    playSimulationTurn(state, action, capture);
    await showPlaytestFrames(state, frames, !state.paused);
  } finally {
    state.animating = false;
    if (playtestState === state && $("simulationDialog").open) renderPlaytest();
  }
}

async function runAnimatedPlaytest(state) {
  if (state.running) return;
  state.running = true;
  try {
    while (playtestState === state && $("simulationDialog").open && !state.paused && state.status === "playing") {
      // Keep the settled board available for clicks before the next automatic turn.
      await new Promise((resolve) => setTimeout(resolve, 650));
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
  state.hint = null;
  state.selectedIndex = null;
  state.message = state.paused ? "교환할 인접 블록 두 개를 클릭하세요." : "자동 플레이 중입니다.";
  $("playtestPauseButton").textContent = state.paused ? "자동 플레이 시작" : "직접 플레이로 전환";
  if (!state.animating) renderPlaytest();
  if (!state.paused) runAnimatedPlaytest(state);
}

function playtestCell(index) {
  const state = playtestState;
  if (!state || state.status !== "playing" || state.animating) return;
  const cave = state.cave;
  if (isBarrier(cave, index) || !cave.layers.block[index]) return;
  state.hint = null;

  if (specialEffect(cave, cave.playtestPieces[index])) {
    state.selectedIndex = null;
    const action = { first: index };
    if (state.paused) {
      playSimulationTurn(state, action);
      renderPlaytest();
    } else {
      animatePlaytestTurn(state, action);
    }
    return;
  }
  if (!state.paused) return;

  const first = state.selectedIndex;
  state.selectedIndex = null;
  if (first === index) {
    state.message = "선택을 취소했습니다.";
  } else if (first === null || !neighborsOf(cave, first).includes(index)) {
    state.selectedIndex = index;
    state.message = "교환할 인접 블록을 클릭하세요.";
  } else {
    swapPlaytestBlocks(cave, first, index);
    const matched = findMatches(cave);
    swapPlaytestBlocks(cave, first, index);
    if (matched.has(first) || matched.has(index)) {
      playSimulationTurn(state, { first, second: index });
    } else {
      state.message = "매치가 만들어지지 않아 교환을 되돌렸습니다.";
    }
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
  $("playtestFrameStatus").textContent = "";
  const state = playtestState;
  if (!state) return;
  const failed = state.status === "lost" || state.status === "stuck";
  const remainingTargets = failed ? playtestRemainingTargets(state) : [];
  const usedMoves = state.cave.moveLimit - state.movesLeft;
  const practice = state.goalLimitations.some(Boolean);
  const flowLabels = { "left-first": "왼쪽/위 우선", "right-first": "오른쪽/아래 우선", alternate: "교대", "seeded-random": "시드 랜덤", none: "우회 없음" };
  const result = $("simulationResult");
  result.className = `simulation-result ${state.status === "won" ? "success" : ["lost", "stuck"].includes(state.status) ? "error" : "warning"}`;
  result.innerHTML = `
    <strong>${practice ? "PLAYTEST 연습 · 클리어 판정 미지원" : state.status === "won" ? "PLAYTEST 성공" : ["lost", "stuck"].includes(state.status) ? "PLAYTEST 실패" : "PLAYTEST 진행 중"}</strong><br>
    Moves <b>${state.movesLeft}</b> / ${state.cave.moveLimit} · 사용 ${usedMoves}회 · 셔플 ${state.shuffleCount}회<br>
    ${objectiveProgressHtml(state)}
    Gravity ${state.cave.gravity} · 막힘 우회 ${flowLabels[state.cave.flowRule]}<br>
    ${failed ? `<strong>${state.status === "lost" ? "이동 횟수 소진" : escapeHtml(state.message)}</strong>` : escapeHtml(state.message)}
    ${remainingTargets.length ? `<ul aria-label="남은 목표">${remainingTargets.map(({ objective, remaining }) =>
      `<li>${escapeHtml(objectiveLabel(objective))} · ${remaining}개 남음</li>`).join("")}</ul>` : ""}
    ${practice ? issueHtml({ errors: [], warnings: [], unsupported: state.validation.unsupported }) : ""}
  `;
  $("usePlaytestResultButton").hidden = state.status !== "won";
  const pause = $("playtestPauseButton");
  pause.hidden = state.status !== "playing";
  $("playtestHintButton").hidden = !state.paused || state.status !== "playing";
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
  const usedMoves = playtestState.cave.moveLimit - playtestState.movesLeft;
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

function exportProject() {
  persist();
  const payload = {
    ...project,
    schema: `windy-cave-map-tool/v${SCHEMA_VERSION}`,
    schemaVersion: SCHEMA_VERSION,
    contentVersion: project.version,
    minimumClientVersion: CLIENT_VERSION,
    exportedAt: new Date().toISOString(),
  };
  downloadJson(payload, `windy-caves-${project.version.toLowerCase()}.json`);
  toast("프로젝트 JSON을 내보냈습니다.");
}

function describePatchChanges(previous, cave) {
  const groups = [
    ["보드 배치", ["layers", "excludedCells", "width", "height", "initialPieceTypes", "initialPieceDefinitions", "specialMatches"]],
    ["클리어 목표", ["objectives", "targetType", "targetCount"]],
    ["이동 횟수", ["moveLimit", "parMoves", "testClearMoves"]],
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
    $("patchPreviewSummary").textContent = `${payload.baseContentVersion} → ${payload.contentVersion} · 추가 ${counts["추가"]} · 수정 ${counts["수정"]} · 삭제 ${counts["삭제"]}${assetsChanged ? " · 팔레트 변경" : ""}`;
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

const DDUNG_COLOR_IDS = ["yellow", "blue", "orange", "green", "red", "purple"];
const DDUNG_BLOCK_CHARACTERS = {
  yellow: "ㄵㄶㄷㄸㄹ⒰",
  blue: "ㄺㄻㄼㄽㄾ⒱",
  orange: "ㄿㅀㅁㅂㅃ⒲",
  green: "ㅄㅅㅆㅇㅈ⒳",
  red: "ㅉㅊㅋㅌㅍ⒴",
  purple: "ㅎㅏㅐㅑㅒ⒵",
};

const DDUNG_TARGETS = {
  1: ["block", "yellow"], 2: ["block", "blue"], 3: ["block", "orange"],
  4: ["block", "green"], 5: ["block", "red"], 6: ["block", "purple"],
  7: ["gimmick", "ddung-box"], 8: ["terrain", "ddung-web"], 9: ["block", "ddung-dust-piece"],
  10: ["terrain", "ddung-oak"], 11: ["item", "ddung-treasure-1"], 12: ["item", "ddung-treasure-2"],
  13: ["terrain", "ddung-stone"], 14: ["terrain", "ddung-water"], 15: ["item", "bomb"],
  16: ["gimmick", "ddung-mouse-panel"], 17: ["gimmick", "ddung-dungs"], 18: ["gimmick", "ddung-bulldozer"],
  20: ["item", "ddung-chocolate"], 21: ["gimmick", "ddung-spider-cave"], 22: ["gimmick", "ddung-bee"],
  23: ["gimmick", "ddung-feng"], 24: ["terrain", "ddung-ice"],
  25: ["gimmick", "ddung-mayor-small"], 26: ["gimmick", "ddung-mayor-large"],
  27: ["item", "ddung-jam-blue"], 28: ["item", "ddung-jam-green"], 29: ["item", "ddung-jam-orange"],
  30: ["item", "ddung-jam-pink"], 31: ["item", "ddung-jam-purple"], 32: ["item", "ddung-jam-yellow"],
  33: ["gimmick", "ddung-bee-up"], 34: ["terrain", "ddung-heather-small"],
  35: ["terrain", "ddung-heather-large"], 36: ["terrain", "ddung-jelly"], 37: ["gimmick", "ddung-octo"],
};

function ddungGridIndex(size, x, y) {
  return x >= 0 && x < size && y >= 0 && y < size ? y * size + x : -1;
}

function ddungPositionGroups(value, chunkSize) {
  const text = String(value || "");
  const groups = [];
  for (let start = 0; start + chunkSize <= text.length; start += chunkSize) groups.push(text.slice(start, start + chunkSize));
  return groups;
}

function ddungObjective(raw, index, unknownTokens) {
  const rawType = Number(raw?.type);
  const type = Number.isInteger(rawType) && rawType > 0 ? rawType : 999;
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
    count: raw?.count || 1,
  });
}

function applyDdungTile(layers, index, character, unknownTokens) {
  layers.terrain[index] = character === "y" ? "pit" : "floor";
  for (const [color, characters] of Object.entries(DDUNG_BLOCK_CHARACTERS)) {
    if (characters.includes(character)) { layers.block[index] = color; return; }
  }
  if (".ㄱㄲㄳ⑴ㄴy".includes(character)) return;
  const dustTerrain = { D: "floor", C: "ddung-frost", V: "ddung-web", E: "ddung-ice" };
  if (Object.hasOwn(dustTerrain, character)) {
    layers.terrain[index] = dustTerrain[character];
    layers.block[index] = "ddung-dust-piece";
    return;
  }
  const terrainCharacters = [
    ["ddung-web", "W"], ["ddung-oak", "I⒝⒞⒟⒠⒣⒤⒥!@#$"],
    ["ddung-stone", "FG78"], ["ddung-water", "U6⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯"],
    ["ddung-ice", "N"], ["ddung-heather-small", "s"], ["ddung-heather-large", "tuvw"],
    ["ddung-jelly", "①②③④⑤⑥⑦⑧⑨⑩ⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ"],
  ];
  const terrain = terrainCharacters.find(([, characters]) => characters.includes(character));
  if (terrain) { layers.terrain[index] = terrain[0]; return; }
  const itemMap = {
    M: "bomb", J: "ddung-chocolate", "⑺": "ddung-treasure-1", "⑻": "ddung-treasure-2",
    l: "ddung-jam-blue", n: "ddung-jam-green", m: "ddung-jam-orange", o: "ddung-jam-pink", p: "ddung-jam-purple", k: "ddung-jam-yellow",
  };
  if (itemMap[character]) { layers.item[index] = itemMap[character]; return; }
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
  if (gimmickMap[character]) { layers.gimmick[index] = gimmickMap[character]; return; }
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

function blockWeight(cave, id) {
  return cave.blockWeights && Object.hasOwn(cave.blockWeights, id) ? cave.blockWeights[id] : 1;
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
  applySixDigitPositions(source.starts, (cellIndex) => { layers.gimmick[cellIndex] = "spawner"; });
  applySixDigitPositions(source.goals, (cellIndex) => { layers.gimmick[cellIndex] = "exit"; });
  applySixDigitPositions(source.roads, (cellIndex) => { layers.terrain[cellIndex] = "conveyor"; });
  ddungPositionGroups(source.warps, 4).forEach((group) => {
    const first = ddungGridIndex(size, Number(group[0]), Number(group[1]));
    const second = ddungGridIndex(size, Number(group[2]), Number(group[3]));
    if (first >= 0) layers.gimmick[first] = "teleport-a";
    if (second >= 0) layers.gimmick[second] = "teleport-b";
  });
  ddungPositionGroups(source.gears, 4).forEach((group) => {
    const cellIndex = ddungGridIndex(size, Number(group[2]), Number(group[3]));
    if (cellIndex >= 0) layers.gimmick[cellIndex] = "switch";
  });
  ddungPositionGroups(source.watercolors, 4).forEach((group) => {
    const cellIndex = ddungGridIndex(size, Number(group[0]), Number(group[1]));
    const color = DDUNG_COLOR_IDS[Number(group[2]) - 1];
    if (cellIndex >= 0 && color && layers.block[cellIndex] !== "ddung-dust-piece") layers.block[cellIndex] = color;
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
    flowRule: "left-first",
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
      rawMap: deepCopy(source),
    },
  }, index);
  const random = seededRandom(`${cave.randomSeed}|import`);
  for (let cellIndex = 0; cellIndex < cave.layers.block.length; cellIndex += 1) {
    if (cave.layers.block[cellIndex] || isBarrier(cave, cellIndex)) continue;
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
  const target = valueAt(source, ["target", "goal", "objective", "objectives.0"], null);
  const rawUsable = valueAt(source, ["usableBlocks", "availableColors", "colors", "palette"], layers.block.filter(Boolean));
  const usableBlocks = (Array.isArray(rawUsable) ? rawUsable : String(rawUsable).split(","))
    .map((value) => normalizeAssetId("block", value, true)).filter(Boolean);
  const targetType = normalizeColor(valueAt(source, ["targetType", "targetColor", "goalColor", "target.color", "goal.color", "objective.color", "objectives.0.color"], typeof target === "string" ? target : "purple")) || "purple";
  const targetCount = valueAt(source, ["targetCount", "goalCount", "collectCount", "target.count", "goal.count", "objective.count", "objectives.0.count"], 1);
  const rawObjectives = valueAt(source, ["objectives", "targets", "goals"], []);
  const collectObjectives = Object.entries(source.goals?.collect || {})
    .filter(([color, count]) => Number(count) > 0 && usableBlocks.includes(normalizeAssetId("block", color, true)))
    .slice(0, MAX_OBJECTIVES)
    .map(([color, count]) => ({ layer: "block", targetId: normalizeAssetId("block", color, true), count }));
  const objectives = Array.isArray(rawObjectives) && rawObjectives.length
    ? rawObjectives.slice(0, MAX_OBJECTIVES).map((objective) => adaptExternalObjective(objective, targetType, targetCount))
    : target != null || source.targetType || source.targetColor || source.goalColor
      ? [adaptExternalObjective(target, targetType, targetCount)] : collectObjectives;
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
    flowRule: valueAt(source, ["flowRule", "gravityFlowRule", "fallbackFlow"], "left-first"),
    terrainRules: valueAt(source, ["terrainRules", "terrainBehavior", "terrainBehaviors"], undefined),
    usableBlocks, objectives, targetType, targetCount, moveLimit, parMoves, testClearMoves,
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
  const next = normalizeProject({ version: String(data?.version || data?.gameVersion || "IMPORTED"), caves, activeCaveId: caves[0].id, assetDefinitions: data?.assetDefinitions });
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

function importProject(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = adaptImportedJson(JSON.parse(reader.result));
      previewImport(imported, file.name);
    } catch (error) { toast(error.message || "지원되는 퍼즐 JSON이 아닙니다."); }
    $("importFile").value = "";
  };
  reader.readAsText(file);
}

function bindInputs() {
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
  $("manageSpecialTypes").addEventListener("click", openSpecialTypeManager);
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
  $("deleteCaveButton").addEventListener("click", deleteCave);
  $("resizeButton").addEventListener("click", resizeMap);
  $("randomizeButton").addEventListener("click", randomizeBlocks);
  $("boardShapeButton").addEventListener("click", openBoardShapes);
  $("difficultyButton").addEventListener("click", openDifficultyGenerator);
  $("difficultyForm").addEventListener("submit", generateDifficultyCandidates);
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
  $("closeSimulationButton").addEventListener("click", () => $("simulationDialog").close());
  $("closeSimulationFooterButton").addEventListener("click", () => $("simulationDialog").close());
  $("playtestResetButton").addEventListener("click", resetPlaytest);
  $("playtestPauseButton").addEventListener("click", togglePlaytestPause);
  $("playtestHintButton").addEventListener("click", showPlaytestHint);
  $("usePlaytestResultButton").addEventListener("click", usePlaytestResult);
  $("saveButton").addEventListener("click", () => persist(true));
  $("exportButton").addEventListener("click", exportProject);
  $("exportGridTiles").addEventListener("click", exportGridTilesProfile);
  $("importButton").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", (event) => importProject(event.target.files[0]));
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
  $("addObjectiveButton").addEventListener("click", addObjective);
  $("moveLimit").addEventListener("change", updateRule);
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
  $("terrainRuleType").addEventListener("change", (event) => { selectedTerrainRule = event.target.value; renderTerrainRuleEditor(); });
  $("terrainReaction").addEventListener("change", updateTerrainRule);
  $("terrainBlocksFlow").addEventListener("change", updateTerrainRule);
  $("terrainLocksBlock").addEventListener("change", updateTerrainRule);
  $("terrainDurability").addEventListener("input", updateTerrainRule);
  $("noteInput").addEventListener("change", (event) => { snapshot(); activeCave().note = event.target.value; persist(); });
}

function updateTerrainRule() {
  snapshot();
  const cave = activeCave();
  cave.terrainRules[selectedTerrainRule] = {
    blocksFlow: $("terrainBlocksFlow").checked,
    locksBlock: $("terrainLocksBlock").checked,
    reaction: $("terrainReaction").value,
    durability: clampNumber($("terrainDurability").value, 1, 1, 99),
  };
  renderTerrainRuleEditor(); persist();
}

function updateRandomSettings() {
  snapshot();
  activeCave().randomSeed = $("randomSeed").value.trim() || activeCave().randomSeed;
  activeCave().randomDensity = clampNumber($("randomDensity").value, 100, 10, 100);
  renderRules(); persist();
}

function updateRule() {
  snapshot(); const cave = activeCave();
  cave.moveLimit = Math.max(1, Number($("moveLimit").value));
  cave.parMoves = Math.max(1, Number($("parMoves").value));
  cave.testClearMoves = Math.max(0, Number($("testClearMoves").value || 0));
  cave.simulationRuns = [10, 30, 100].includes(Number($("simulationRuns").value)) ? Number($("simulationRuns").value) : 30;
  cave.flowRule = FLOW_RULES.includes($("flowRule").value) ? $("flowRule").value : "left-first";
  cave.failureBonus = $("failureBonus").checked;
  syncLegacyTarget(cave);
  renderDifficultySummary(cave); persist();
}

function ddungCellSource(cave, index) {
  const raw = cave.externalSource?.rawMap;
  if (!raw) return null;
  const size = clampNumber(raw.size, 9, 4, 20);
  const x = index % cave.width;
  const y = size - 1 - Math.floor(index / cave.width);
  if (x >= size || y < 0) return null;
  const offset = y * size + x;
  return { raw, x, y, tile: String(raw.tiles || "")[offset], gravity: String(raw.gravitys || "")[offset] };
}

// Display symbols distinguish original piece types without assigning gameplay effects.
const DDUNG_PIECE_ICONS = Object.freeze({ 1: "◆", 2: "▲", 3: "■", 6: "✚", 8: "🐝" });

function ddungInitialPiece(tile) {
  if (!tile) return null;
  for (const [color, tokens] of Object.entries(DDUNG_BLOCK_CHARACTERS)) {
    const variant = tokens.indexOf(tile);
    if (variant >= 0) return { color, type: variant === 5 ? 8 : variant === 4 ? 6 : variant };
  }
  return null;
}

function initialPieceAt(cave, index) {
  const type = cave.initialPieceTypes?.[index];
  if (cave.initialPieceTypes && Object.hasOwn(cave.initialPieceTypes, index) && type == null) return null;
  if (type) {
    const declared = cave.initialPieceDefinitions?.find((entry) => entry.id === type);
    return { type, symbol: declared?.symbol || "✦", name: declared?.name };
  }
  const original = ddungInitialPiece(ddungCellSource(cave, index)?.tile);
  const symbol = DDUNG_PIECE_ICONS[original?.type];
  return symbol ? { ...original, symbol, ...(original.type === 8 ? { name: "벌" } : {}) } : null;
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

const EDITABLE_INITIAL_PIECES = [
  { id: "horizontal", name: "가로", symbol: "↔" },
  { id: "vertical", name: "세로", symbol: "↕" },
  { id: "bomb", name: "폭탄", symbol: "✹" },
  { id: "bee", name: "벌", symbol: "◆" },
  { id: "rainbow", name: "오색", symbol: "✦" },
];

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

function openSpecialTypeManager() {
  const cave = activeCave();
  const dialog = $("specialTypeDialog");
  const form = $("specialTypeForm");
  const select = $("specialTypeSelect");
  const name = $("specialTypeName");
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
  select.onchange = showType;
  form.onsubmit = (event) => {
    event.preventDefault();
    const label = name.value.trim();
    if (!label || activeCave() !== cave) return;
    const current = definitions.get(select.value);
    const id = current?.id || "custom-" + crypto.randomUUID();
    const updated = { ...current, id, name: label, symbol: current?.symbol || "✦", effect: effect.value };
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

bindInputs();
renderAll();

