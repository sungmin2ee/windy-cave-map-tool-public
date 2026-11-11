const COLORS = {
  red: "#ef4f5f", yellow: "#f7c73b", blue: "#35a9ff",
  green: "#36d477", orange: "#ff8a36", purple: "#b65bff",
};

const CLIENT_VERSION = "2.7.0";
const SCHEMA_VERSION = 5;
const MIN_SCHEMA_VERSION = 1;

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
    { id: "ddung-ice", name: "DDUNG Ice", className: "terrain-ddung-ice", visual: "❅" },
    { id: "ddung-heather-small", name: "DDUNG Heather Small", className: "terrain-ddung-heather", visual: "♨" },
    { id: "ddung-heather-large", name: "DDUNG Heather Large", className: "terrain-ddung-heather", visual: "♨" },
    { id: "ddung-jelly", name: "DDUNG Jelly", className: "terrain-ddung-jelly", visual: "◫" },
  ],
  block: Object.keys(COLORS).map((id) => ({ id, name: id[0].toUpperCase() + id.slice(1), className: `block-${id}`, visual: "◆" })),
  gimmick: [
    { id: "teleport-a", name: "Teleport A", visual: "◉" },
    { id: "teleport-b", name: "Teleport B", visual: "◎" },
    { id: "switch", name: "Switch", visual: "⏻" },
    { id: "door", name: "Door", visual: "▥" },
    { id: "arrow-up", name: "Arrow Up", visual: "↑" },
    { id: "arrow-down", name: "Arrow Down", visual: "↓" },
    { id: "spawner", name: "Spawner", visual: "✦" },
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
  "ddung-web": { blocksFlow: false, reaction: "adjacent", durability: 1 },
  "ddung-dust": { blocksFlow: false, reaction: "adjacent", durability: 1 },
  "ddung-oak": { blocksFlow: true, reaction: "adjacent", durability: 2 },
  "ddung-stone": { blocksFlow: true, reaction: "adjacent", durability: 2 },
  "ddung-water": { blocksFlow: false, reaction: "adjacent", durability: 1 },
  "ddung-ice": { blocksFlow: false, reaction: "adjacent", durability: 1 },
  "ddung-heather-small": { blocksFlow: false, reaction: "adjacent", durability: 1 },
  "ddung-heather-large": { blocksFlow: false, reaction: "adjacent", durability: 2 },
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
    id: crypto.randomUUID(), name, width, height, gravity: "down", layers,
    usableBlocks: [],
    objectives: [],
    targetType: null, targetCount: 0,
    moveLimit: 20, parMoves: 14, testClearMoves: 0,
    simulationRuns: 30,
    randomSeed: `CAVE-${String(number).padStart(4, "0")}`, randomDensity: 100,
    flowRule: "left-first", terrainRules: deepCopy(DEFAULT_TERRAIN_RULES),
    failureBonus: true, note: "",
  };
}

const defaultProject = () => ({ version: "V0001", assetDefinitions: {}, paletteAssets: {}, caves: [createCave(1)], activeCaveId: null });
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
  const activeCaveId = caves.some((cave) => cave.id === source.activeCaveId) ? source.activeCaveId : caves[0].id;
  const assetDefinitions = normalizeAssetDefinitions(source.assetDefinitions);
  return { ...source, version: String(source.contentVersion || source.version || "V0001"), caves, activeCaveId, assetDefinitions, paletteAssets: collectPaletteAssets(caves, source.paletteAssets, assetDefinitions) };
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
  const usableBlocks = Array.isArray(source.usableBlocks)
    ? source.usableBlocks.map(assetId).filter(Boolean)
    : layers.block.filter(Boolean);
  const objectives = normalizeObjectives(source);
  const externalSource = source.externalSource;
  const migrateDdungGoals = isDdungSource(externalSource) && !externalSource.goalRulesVersion;
  let goalChanged = false;
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
    const rule = source.terrainRules?.[terrainId] || {};
    const reaction = ["none", "under", "adjacent"].includes(rule.reaction) ? rule.reaction : fallback.reaction;
    terrainRules[terrainId] = {
      blocksFlow: rule.blocksFlow == null ? fallback.blocksFlow : Boolean(rule.blocksFlow),
      reaction,
      durability: clampNumber(rule.durability, fallback.durability, 1, 99),
    };
  });
  const normalized = {
    ...source,
    id: source.id || crypto.randomUUID(),
    name: String(source.name || `Cave ${String(index + 1).padStart(4, "0")}`),
    width, height, gravity: normalizeGravity(source.gravity), layers,
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
  if (migrateDdungGoals) normalized.externalSource = { ...externalSource, goalRulesVersion: 2 };
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

function persist(showMessage = false) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(packProjectForStorage(project)));
    if (showMessage) toast("브라우저에 저장했습니다.");
  } catch (_) {
    toast("프로젝트가 너무 커서 브라우저 저장 공간을 초과했습니다. JSON으로 내보내 백업하세요.");
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
  if (type === 36) return "여러 칸으로 구성된 젤리 그룹 제거";
  if (type === 9) return "더스트 블록의 이동과 파괴";
  if (type === 7) return cave.externalSource.boxLayoutParsed ? null : "철 상자 배치를 확인하려면 원본 JSON을 다시 가져오세요.";
  if ([8, 10, 13, 14, 24].includes(type)) return null;
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
        <label><span class="field-label">완료 조건</span><div class="objective-auto-count">${escapeHtml(ddungObjectiveType(objective) === 7 ? "내구도 소진 후 파괴" : OBJECTIVE_ACTIONS[objective.layer].label)}</div></label>
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
    visibleCaves = indexedCaves.filter(({ cave, index }) => {
      const number = String(index + 1);
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
  const digits = Math.max(2, String(project.caves.length).length);
  visibleCaves.forEach(({ cave, index }) => {
    const button = document.createElement("button");
    button.className = `cave-item${cave.id === project.activeCaveId ? " active" : ""}`;
    button.innerHTML = `<span class="cave-number">${String(index + 1).padStart(digits, "0")}</span><strong>${escapeHtml(cave.name)}</strong>`;
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
  $("terrainDurability").disabled = rule.reaction === "none";
  const terrainName = getAsset("terrain", selectedTerrainRule)?.name || selectedTerrainRule;
  const reactionLabel = rule.reaction === "none"
    ? "3-Match로 제거할 수 없습니다."
    : `${rule.durability}번 반응하면 사라집니다.`;
  $("terrainRuleSummary").innerHTML = `<strong>${escapeHtml(terrainName)}</strong><span>${rule.blocksFlow ? "블록 흐름을 막습니다." : "블록이 통과할 수 있습니다."} ${reactionLabel}</span>`;
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

function renderGrid() {
  const cave = activeCave();
  const grid = $("mapGrid");
  grid.style.gridTemplateColumns = `repeat(${cave.width}, var(--cell-size))`;
  grid.innerHTML = "";
  for (let index = 0; index < cave.width * cave.height; index += 1) {
    const cell = document.createElement("div");
    cell.className = "map-cell";
    cell.dataset.index = index;
    cell.setAttribute("role", "button");
    cell.setAttribute("aria-label", cellDescription(cave, index));
    applyCellVisual(cell, cave, index);
    cell.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault(); isPainting = true; strokeSnapshotTaken = false;
      editCell(index, activeTool === "fill");
    });
    cell.addEventListener("pointerenter", (event) => {
      if ((event.buttons & 1) === 0) { isPainting = false; strokeSnapshotTaken = false; return; }
      if (isPainting && activeTool !== "fill") editCell(index, false);
    });
    cell.addEventListener("mouseenter", () => showCellStatus(index));
    grid.appendChild(cell);
  }
}

function applyCellVisual(cell, cave, index) {
  for (const layer of ["terrain", "block", "gimmick", "item"]) {
    const assetId = cave.layers[layer][index];
    if (!assetId) continue;
    const asset = getAsset(layer, assetId);
    if (!asset) continue;
    const visual = document.createElement("span");
    visual.className = `cell-${layer} ${asset.className || ""}`;
    if (layer === "block") visual.style.background = blockColor(assetId);
    if (layer === "gimmick" || layer === "item" || (layer === "terrain" && !asset.className)) visual.textContent = asset.visual;
    cell.appendChild(visual);
  }
}

function editCell(index, fillMode) {
  const cave = activeCave();
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
    if (visited.has(index) || cells[index] !== target) continue;
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
  cave.width = width; cave.height = height; cave.layers = next;
  renderAll(); persist(); toast(`맵 크기를 ${width} × ${height}(으)로 변경했습니다.`);
}

function addCave() {
  snapshot();
  const cave = createCave(project.caves.length + 1);
  project.caves.push(cave); project.activeCaveId = cave.id; renderAll(); persist(); toast("새 Cave를 만들었습니다.");
}

function duplicateCave() {
  snapshot();
  const copy = deepCopy(activeCave()); copy.id = crypto.randomUUID(); copy.name = `${copy.name} Copy`;
  const index = project.caves.findIndex((c) => c.id === project.activeCaveId);
  project.caves.splice(index + 1, 0, copy); project.activeCaveId = copy.id; renderAll(); persist(); toast("Cave를 복제했습니다.");
}

function deleteCave() {
  if (project.caves.length === 1) return toast("마지막 Cave는 삭제할 수 없습니다.");
  if (!window.confirm(`${activeCave().name}을(를) 삭제할까요?`)) return;
  snapshot();
  const index = project.caves.findIndex((c) => c.id === project.activeCaveId);
  project.caves.splice(index, 1); project.activeCaveId = project.caves[Math.max(0, index - 1)].id; renderAll(); persist();
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

function randomizeBlocks() {
  const cave = activeCave();
  const seed = ($("randomSeed").value.trim() || `CAVE-${Date.now().toString(36).toUpperCase()}`).slice(0, 40);
  const density = clampNumber($("randomDensity").value, 100, 10, 100);
  const colors = cave.usableBlocks.length ? cave.usableBlocks : project.paletteAssets.block || [];
  if (!colors.some((id) => blockWeight(cave, id) > 0)) return toast("생성 가중치가 0보다 큰 블록 종류를 선택하세요.");
  const random = seededRandom(`${seed}|${cave.width}x${cave.height}|${colors.join(",")}|${density}`);
  const blocks = Array(cave.width * cave.height).fill(null);
  const eligible = [];
  for (let index = 0; index < blocks.length; index += 1) {
    if (isBarrier(cave, index)) continue;
    eligible.push(index);
    if (random() * 100 >= density) continue;
    const candidates = colors.filter((color) => blockWeight(cave, color) > 0 && !wouldCreateMatch(blocks, index, color, cave));
    blocks[index] = candidates.length ? chooseBlockColor(cave, candidates, random) : null;
  }
  const shortfalls = [];
  for (const objective of cave.objectives.filter((item) => item.layer === "block")) {
    const targetNeeded = Math.min(resolvedObjectiveCount(cave, objective), eligible.length);
    let targetPlaced = blocks.filter((value) => value === objective.targetId).length;
    const shuffled = [...eligible].sort(() => random() - 0.5);
    for (const index of shuffled) {
      if (targetPlaced >= targetNeeded) break;
      if (blocks[index] !== objective.targetId && !wouldCreateMatch(blocks, index, objective.targetId, cave)) {
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
  toast(`시드 ${seed} · 시작 매치 0개 · 블록 ${blocks.filter(Boolean).length}개${shortfalls.length ? ` · 목표색 부족 ${shortfalls.join(", ")}` : ""}`);
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
  if (analysis.totalBlocks && !initialMatches && !hasPossibleSwap(cave)) warnings.push("시작 상태에서 가능한 3-Match 교환을 찾지 못했습니다.");
  return { errors, warnings, unsupported, analysis };
}

function issueHtml(validation) {
  const errorHtml = validation.errors.length ? `<div><b>오류</b><br>${validation.errors.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  const warningHtml = validation.warnings.length ? `<div><b>경고</b><br>${validation.warnings.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  const unsupportedHtml = validation.unsupported.length ? `<div><b>원본 동작 판정 미지원</b><br>${validation.unsupported.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  return errorHtml + warningHtml + unsupportedHtml;
}

function renderSimulationGrid(cave, interactive = false) {
  const grid = $("simulationGrid");
  grid.style.gridTemplateColumns = `repeat(${cave.width}, 30px)`;
  grid.innerHTML = "";
  for (let index = 0; index < cave.width * cave.height; index += 1) {
    const cell = document.createElement(interactive ? "button" : "div");
    cell.className = `map-cell${interactive && cave.layers.block[index] ? " playable" : ""}${interactive && playtestState?.selectedIndex === index ? " selected" : ""}`;
    cell.type = interactive ? "button" : undefined;
    applyCellVisual(cell, cave, index);
    if (playtestState?.cave === cave) {
      const terrainId = cave.layers.terrain[index];
      const rule = terrainId ? cave.terrainRules?.[terrainId] : null;
      if (rule && rule.reaction !== "none") {
        const remaining = Math.max(0, rule.durability - (playtestState.terrainHits[index] || 0));
        const badge = document.createElement("span");
        badge.className = `terrain-hp${remaining < rule.durability ? " damaged" : ""}`;
        badge.textContent = remaining;
        badge.title = `${terrainId} 남은 내구도 ${remaining}`;
        cell.appendChild(badge);
      }
    }
    if (interactive) cell.addEventListener("click", () => playtestCell(index));
    grid.appendChild(cell);
  }
}

function showSimulation(playMode) {
  const cave = activeCave();
  const validation = validateCave(cave);
  const blocked = validation.errors.length > 0 || validation.unsupported.length > 0;
  $("simulationTitle").textContent = cave.name;
  const canPractice = playMode && !validation.errors.length;
  $("playtestGuide").hidden = !canPractice;
  $("playtestResetButton").hidden = !canPractice;
  $("usePlaytestResultButton").hidden = true;
  if (canPractice) {
    playtestState = createPlayState(cave, `playtest-${crypto.randomUUID()}`);
    playtestState.validation = validation;
    renderPlaytest();
  } else {
    playtestState = null;
    const batch = blocked ? null : runBatchSimulation(cave, cave.simulationRuns);
    const objectiveSummary = cave.objectives.map((objective) => `${escapeHtml(objectiveLabel(objective))} × ${resolvedObjectiveCount(cave, objective)}`).join(" · ");
    const result = $("simulationResult");
    result.className = `simulation-result ${blocked ? "error" : validation.warnings.length ? "warning" : "success"}`;
    result.innerHTML = `
      <strong>${validation.unsupported.length ? "원본 동작 판정 미지원" : blocked ? "검증 실패" : "검증 통과"}</strong><br>
      ${batch ? `자동 플레이 난이도 <b>${batch.label}</b> · 휴리스틱 ${validation.analysis.label} (${validation.analysis.score}점)<br>` : `휴리스틱 난이도 ${validation.analysis.label} (${validation.analysis.score}점)<br>`}
      목표 ${objectiveSummary} · 제한 ${cave.moveLimit} · 권장 ${cave.parMoves}${cave.testClearMoves ? ` · 테스트 ${cave.testClearMoves}` : ""}<br>
      여유 Moves ${validation.analysis.slack >= 0 ? "+" : ""}${validation.analysis.slack} · Gravity ${cave.gravity}
      ${batch ? `<div class="batch-summary"><span><b>${batch.clearRate}%</b>클리어율 (${batch.wins}/${batch.runs})</span><span><b>${batch.average || "-"}</b>평균 Moves</span><span><b>${batch.median || "-"} / ${batch.p90 || "-"}</b>중앙 / 90%</span></div><div>막힘 ${batch.stuck}회 · 목표 우선 휴리스틱 자동 플레이 결과이며 실제 유저 난이도와는 차이가 날 수 있습니다.</div>` : ""}
      ${issueHtml(validation)}
    `;
    renderSimulationGrid(cave, false);
  }
  $("simulationDialog").showModal();
}

function findMatches(cave) {
  const matches = new Set();
  const blocks = cave.layers.block;
  for (let y = 0; y < cave.height; y += 1) {
    let start = 0;
    for (let x = 1; x <= cave.width; x += 1) {
      const current = x < cave.width ? blocks[y * cave.width + x] : null;
      const first = blocks[y * cave.width + start];
      if (current === first && first) continue;
      if (first && x - start >= 3) for (let fill = start; fill < x; fill += 1) matches.add(y * cave.width + fill);
      start = x;
    }
  }
  for (let x = 0; x < cave.width; x += 1) {
    let start = 0;
    for (let y = 1; y <= cave.height; y += 1) {
      const current = y < cave.height ? blocks[y * cave.width + x] : null;
      const first = blocks[start * cave.width + x];
      if (current === first && first) continue;
      if (first && y - start >= 3) for (let fill = start; fill < y; fill += 1) matches.add(fill * cave.width + x);
      start = y;
    }
  }
  return matches;
}

function areAdjacent(cave, first, second) {
  const firstX = first % cave.width;
  const firstY = Math.floor(first / cave.width);
  const secondX = second % cave.width;
  const secondY = Math.floor(second / cave.width);
  return Math.abs(firstX - secondX) + Math.abs(firstY - secondY) === 1;
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
  if (index < 0 || index >= cave.width * cave.height) return true;
  if (ddungBoxDurability(cave, index)) return true;
  const terrainId = cave.layers.terrain[index];
  return terrainId ? Boolean(cave.terrainRules?.[terrainId]?.blocksFlow) : false;
}

function settleStraight(cave) {
  for (const line of gravityLines(cave)) {
    let segment = [];
    const settle = () => {
      const values = segment.map((index) => cave.layers.block[index]).filter(Boolean);
      segment.forEach((index, position) => { cave.layers.block[index] = values[position] || null; });
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
        cave.layers.block[targetIndex] = cave.layers.block[index];
        cave.layers.block[index] = null;
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

function refillBlocks(cave, random) {
  const colors = cave.usableBlocks;
  if (!colors.length) return;
  for (let index = 0; index < cave.layers.block.length; index += 1) {
    if (!cave.layers.block[index] && !isBarrier(cave, index)) {
      cave.layers.block[index] = chooseBlockColor(cave, colors, random);
    }
  }
}

function damageTerrainFromMatches(state, matches) {
  const cave = state.cave;
  let damaged = 0;
  let broken = 0;
  const brokenDetails = [];
  for (let index = 0; index < cave.layers.terrain.length; index += 1) {
    const terrainId = cave.layers.terrain[index];
    const rule = terrainId ? cave.terrainRules?.[terrainId] : null;
    if (!rule || rule.reaction === "none") continue;
    let affected = matches.has(index);
    if (!affected && rule.reaction === "adjacent") {
      affected = neighborsOf(cave, index).some((neighbor) => matches.has(neighbor));
    }
    if (!affected) continue;
    state.terrainHits[index] = (state.terrainHits[index] || 0) + 1;
    damaged += 1;
    if (state.terrainHits[index] >= rule.durability) {
      brokenDetails.push({ index, terrainId });
      cave.layers.terrain[index] = null;
      state.terrainHits[index] = 0;
      broken += 1;
    }
  }
  return { damaged, broken, brokenDetails };
}

function resolveMatches(state) {
  let matches = findMatches(state.cave);
  let cascade = 0;
  let removed = 0;
  let terrainDamaged = 0;
  let terrainBroken = 0;
  let flowMoves = 0;
  while (matches.size && cascade < 20) {
    const terrainResult = damageTerrainFromMatches(state, matches);
    terrainDamaged += terrainResult.damaged;
    terrainBroken += terrainResult.broken;
    terrainResult.brokenDetails.forEach(({ terrainId }) => advanceObjectives(state, "terrain", terrainId));
    for (let index = 0; index < state.cave.layers.gimmick.length; index += 1) {
      const gimmickId = state.cave.layers.gimmick[index];
      if (!gimmickId || state.activatedGimmicks.has(index)) continue;
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
    matches.forEach((index) => {
      const blockId = state.cave.layers.block[index];
      if (blockId) advanceObjectives(state, "block", blockId);
      const itemId = state.cave.layers.item[index];
      if (itemId) {
        advanceObjectives(state, "item", itemId);
        state.cave.layers.item[index] = null;
      }
      state.cave.layers.block[index] = null;
      removed += 1;
    });
    flowMoves += applyGravity(state.cave, state);
    refillBlocks(state.cave, state.random);
    cascade += 1;
    matches = findMatches(state.cave);
  }
  return { cascade, removed, terrainDamaged, terrainBroken, flowMoves, capped: matches.size > 0 };
}

function hasPossibleSwap(cave) {
  const blocks = cave.layers.block;
  for (let index = 0; index < blocks.length; index += 1) {
    if (!blocks[index]) continue;
    const x = index % cave.width;
    const candidates = [];
    if (x < cave.width - 1) candidates.push(index + 1);
    if (index + cave.width < blocks.length) candidates.push(index + cave.width);
    for (const other of candidates) {
      if (!blocks[other] || blocks[other] === blocks[index]) continue;
      [blocks[index], blocks[other]] = [blocks[other], blocks[index]];
      const possible = findMatches(cave).size > 0;
      [blocks[index], blocks[other]] = [blocks[other], blocks[index]];
      if (possible) return true;
    }
  }
  return false;
}

function scoreAutoMove(state, matches) {
  let score = matches.size;
  state.cave.objectives.forEach((objective) => {
    if (objective.layer === "block") {
      matches.forEach((index) => { if (state.cave.layers.block[index] === objective.targetId) score += 6; });
    } else if (objective.layer === "item") {
      matches.forEach((index) => { if (state.cave.layers.item[index] === objective.targetId) score += 10; });
    } else if (objective.layer === "terrain") {
      state.cave.layers.terrain.forEach((terrainId, index) => {
        if (terrainId !== objective.targetId) return;
        const reaction = state.cave.terrainRules?.[terrainId]?.reaction;
        if (matches.has(index) || (reaction === "adjacent" && neighborsOf(state.cave, index).some((neighbor) => matches.has(neighbor)))) score += 8;
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

function listPossibleSwaps(state) {
  const cave = state.cave;
  const blocks = cave.layers.block;
  const candidates = [];
  for (let first = 0; first < blocks.length; first += 1) {
    if (!blocks[first]) continue;
    const x = first % cave.width;
    const others = [];
    if (x < cave.width - 1) others.push(first + 1);
    if (first + cave.width < blocks.length) others.push(first + cave.width);
    for (const second of others) {
      if (!blocks[second] || blocks[first] === blocks[second]) continue;
      [blocks[first], blocks[second]] = [blocks[second], blocks[first]];
      const matches = findMatches(cave);
      if (matches.size) candidates.push({ first, second, score: scoreAutoMove(state, matches) });
      [blocks[first], blocks[second]] = [blocks[second], blocks[first]];
    }
  }
  return candidates;
}

function createPlayState(cave, seedSuffix) {
  const copy = deepCopy(cave);
  copy.layers.block.forEach((id, index) => {
    if (id && ddungBoxDurability(copy, index)) copy.layers.block[index] = null;
  });
  return {
    cave: copy,
    movesLeft: copy.moveLimit,
    selectedIndex: null,
    status: "playing",
    message: "교환할 첫 번째 블록을 선택하세요.",
    random: seededRandom(`${copy.randomSeed}|${seedSuffix}`),
    terrainHits: Array(copy.width * copy.height).fill(0),
    gimmickHits: Array(copy.width * copy.height).fill(0),
    activatedGimmicks: new Set(),
    objectiveProgress: createObjectiveProgress(copy),
    goalLimitations: copy.objectives.map((objective) => ddungGoalLimitation(copy, objective)),
    flowTurn: 0,
  };
}

function runAutoGame(cave, runIndex) {
  const state = createPlayState(cave, `batch-${runIndex}`);
  if (state.goalLimitations.some(Boolean)) return { status: "unsupported", moves: 0 };
  while (state.movesLeft > 0 && !allObjectivesComplete(state)) {
    const candidates = listPossibleSwaps(state);
    if (!candidates.length) return { status: "stuck", moves: cave.moveLimit - state.movesLeft };
    const bestScore = Math.max(...candidates.map((candidate) => candidate.score));
    const best = candidates.filter((candidate) => candidate.score === bestScore);
    const chosen = best[Math.floor(state.random() * best.length)];
    const blocks = state.cave.layers.block;
    [blocks[chosen.first], blocks[chosen.second]] = [blocks[chosen.second], blocks[chosen.first]];
    state.movesLeft -= 1;
    resolveMatches(state);
  }
  return { status: allObjectivesComplete(state) ? "won" : "lost", moves: cave.moveLimit - state.movesLeft };
}

function runBatchSimulation(cave, runs) {
  const results = [];
  for (let index = 0; index < runs; index += 1) results.push(runAutoGame(cave, index));
  const wins = results.filter((result) => result.status === "won");
  const moves = wins.map((result) => result.moves).sort((a, b) => a - b);
  const average = moves.length ? moves.reduce((sum, value) => sum + value, 0) / moves.length : 0;
  const percentile = (ratio) => moves.length ? moves[Math.min(moves.length - 1, Math.floor((moves.length - 1) * ratio))] : 0;
  const clearRate = Math.round(wins.length / runs * 100);
  const label = clearRate >= 80 ? "Easy" : clearRate >= 55 ? "Normal" : clearRate >= 30 ? "Hard" : clearRate > 0 ? "Expert" : "미클리어";
  return {
    runs,
    wins: wins.length,
    stuck: results.filter((result) => result.status === "stuck").length,
    clearRate,
    average: Number(average.toFixed(1)),
    median: percentile(0.5),
    p90: percentile(0.9),
    label,
  };
}

function playtestCell(index) {
  const state = playtestState;
  if (!state || state.status !== "playing" || !state.cave.layers.block[index]) return;
  if (state.selectedIndex == null) {
    state.selectedIndex = index;
    state.message = "교환할 인접 블록을 선택하세요.";
    renderPlaytest();
    return;
  }
  if (state.selectedIndex === index) {
    state.selectedIndex = null;
    state.message = "선택을 취소했습니다.";
    renderPlaytest();
    return;
  }
  if (!areAdjacent(state.cave, state.selectedIndex, index)) {
    state.selectedIndex = index;
    state.message = "인접하지 않아 첫 번째 블록을 다시 선택했습니다.";
    renderPlaytest();
    return;
  }
  const first = state.selectedIndex;
  const blocks = state.cave.layers.block;
  [blocks[first], blocks[index]] = [blocks[index], blocks[first]];
  state.selectedIndex = null;
  if (!findMatches(state.cave).size) {
    [blocks[first], blocks[index]] = [blocks[index], blocks[first]];
    state.message = "3-Match가 생기지 않아 교환을 되돌렸습니다. Moves는 차감하지 않았습니다.";
    renderPlaytest();
    return;
  }
  state.movesLeft -= 1;
  const resolved = resolveMatches(state);
  state.message = `${resolved.removed}개 제거 · ${resolved.cascade}연쇄 · Terrain 반응 ${resolved.terrainDamaged}회${resolved.terrainBroken ? ` · Terrain ${resolved.terrainBroken}개 파괴` : ""}${resolved.flowMoves ? ` · 우회 흐름 ${resolved.flowMoves}칸` : ""}${resolved.capped ? " · 연쇄 안전 제한 도달" : ""}`;
  if (allObjectivesComplete(state)) {
    state.status = "won";
    state.message = `${state.cave.moveLimit - state.movesLeft} Moves로 목표를 달성했습니다. ${state.message}`;
  } else if (state.movesLeft <= 0) {
    state.status = "lost";
    state.message = "Moves를 모두 사용했습니다.";
  } else if (!hasPossibleSwap(state.cave)) {
    state.status = "stuck";
    state.message = "가능한 3-Match 교환이 없습니다. 새 시드나 셔플이 필요합니다.";
  }
  renderPlaytest();
}

function renderPlaytest() {
  const state = playtestState;
  if (!state) return;
  const usedMoves = state.cave.moveLimit - state.movesLeft;
  const practice = state.goalLimitations.some(Boolean);
  const flowLabels = { "left-first": "왼쪽/위 우선", "right-first": "오른쪽/아래 우선", alternate: "교대", "seeded-random": "시드 랜덤", none: "우회 없음" };
  const result = $("simulationResult");
  result.className = `simulation-result ${state.status === "won" ? "success" : ["lost", "stuck"].includes(state.status) ? "error" : "warning"}`;
  result.innerHTML = `
    <strong>${practice ? "PLAYTEST 연습 · 클리어 판정 미지원" : state.status === "won" ? "PLAYTEST 성공" : ["lost", "stuck"].includes(state.status) ? "PLAYTEST 종료" : "PLAYTEST 진행 중"}</strong><br>
    Moves <b>${state.movesLeft}</b> / ${state.cave.moveLimit} · 사용 ${usedMoves}회<br>
    ${objectiveProgressHtml(state)}
    Gravity ${state.cave.gravity} · 막힘 우회 ${flowLabels[state.cave.flowRule]}<br>
    ${escapeHtml(practice && state.status !== "playing" ? "연습을 종료했습니다." : state.message)}
    ${practice ? issueHtml({ errors: [], warnings: [], unsupported: state.validation.unsupported }) : ""}
  `;
  $("usePlaytestResultButton").hidden = state.status !== "won";
  renderSimulationGrid(state.cave, state.status === "playing");
}

function resetPlaytest() {
  if (!playtestState) return;
  const cave = activeCave();
  playtestState = createPlayState(cave, `playtest-${crypto.randomUUID()}`);
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
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
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
  const baseCaves = new Map(base.caves.map((cave) => [String(cave.id), JSON.stringify(cave)]));
  const currentCaves = project.caves.map(normalizeCave);
  const currentIds = new Set(currentCaves.map((cave) => String(cave.id)));
  return {
    schema: `windy-cave-map-tool/v${SCHEMA_VERSION}`,
    schemaVersion: SCHEMA_VERSION,
    type: "patch",
    baseContentVersion: baseVersion,
    contentVersion: project.version,
    minimumClientVersion: CLIENT_VERSION,
    paletteAssets: project.paletteAssets,
    assetDefinitions: project.assetDefinitions,
    patch: {
      upsertCaves: currentCaves.filter((cave) => baseCaves.get(String(cave.id)) !== JSON.stringify(cave)),
      removeCaveIds: [...baseCaves.keys()].filter((id) => !currentIds.has(id)),
    },
  };
}

async function exportPatch(file) {
  if (!file) return;
  try {
    const patch = buildPatch(JSON.parse(await file.text()));
    downloadJson(patch, `windy-patch-${patch.baseContentVersion}-to-${patch.contentVersion}.json`);
    toast(`패치 ${patch.baseContentVersion} → ${patch.contentVersion} 내보내기 완료`);
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
    if (existingIndex >= 0) next.caves[existingIndex] = cave;
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
  7: ["gimmick", "ddung-box"], 8: ["terrain", "ddung-web"], 9: ["terrain", "ddung-dust"],
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
  const terrainCharacters = [
    ["ddung-web", "WV"], ["ddung-dust", "D"], ["ddung-oak", "IC⒝⒞⒟⒠⒣⒤⒥!@#$"],
    ["ddung-stone", "FG78"], ["ddung-water", "U6⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯"],
    ["ddung-ice", "EN"], ["ddung-heather-small", "s"], ["ddung-heather-large", "tuvw"],
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

function adaptDdungMapInfo(source, index, format, unknownTokens) {
  const size = clampNumber(source.size, 9, 4, 20);
  const layers = emptyLayers(size * size);
  const tiles = Array.from(String(source.tiles || "").padEnd(size * size, "y"));
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const sourceIndex = (size - y - 1) * size + x;
      applyDdungTile(layers, y * size + x, tiles[sourceIndex], unknownTokens);
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
    if (cellIndex >= 0 && color) layers.block[cellIndex] = color;
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
      specialColors: String(source.special || "").split(",").map((value) => value.trim())
        .filter((value) => /^\d+$/.test(value)).map((value) => DDUNG_COLOR_IDS[Number(value)]).filter(Boolean),
      boxLayoutParsed: true,
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

function adaptExternalLevel(level, index, format, unknownTokens, declaredLayers) {
  if (/^DDUNG MapInfo/i.test(format)) return adaptDdungMapInfo(level, index, format, unknownTokens);
  const source = level && typeof level === "object" ? level : {};
  const grid = valueAt(source, ["grid", "board", "cells", "tiles", "map.grid", "map.cells", "map.tiles"], []);
  const gridRows = Array.isArray(grid) && Array.isArray(grid[0]) ? grid : null;
  const width = clampNumber(valueAt(source, ["width", "cols", "columns", "boardWidth", "size.width", "map.width"], gridRows?.[0]?.length || 10), 10, 4, 20);
  const height = clampNumber(valueAt(source, ["height", "rows", "boardHeight", "size.height", "map.height"], gridRows?.length || 12), 12, 4, 20);
  const size = width * height;
  const layers = emptyLayers(size);
  const layerAliases = {
    terrain: ["terrain", "ground", "floor"],
    block: ["block", "blocks", "colors", "pieces"],
    gimmick: ["gimmick", "gimmicks", "mechanics", "objects"],
    item: ["item", "items", "collectibles", "rewards"],
  };
  Object.entries(layerAliases).forEach(([layer, aliases]) => {
    const rawLayer = valueAt(source.layers || {}, aliases, valueAt(source, aliases.map((alias) => `${alias}Layer`), []));
    flatArray(rawLayer).slice(0, size).forEach((value, cellIndex) => {
      const normalized = normalizeAssetId(layer, value, true);
      if (normalized) layers[layer][cellIndex] = normalized;
    });
  });
  flatArray(grid).slice(0, size).forEach((token, cellIndex) => applyCellToken(layers, cellIndex, token, unknownTokens, declaredLayers));
  const target = valueAt(source, ["target", "goal", "objective", "objectives.0"], null);
  const rawUsable = valueAt(source, ["usableBlocks", "availableColors", "colors", "palette"], layers.block.filter(Boolean));
  const usableBlocks = (Array.isArray(rawUsable) ? rawUsable : String(rawUsable).split(","))
    .map((value) => normalizeAssetId("block", value, true)).filter(Boolean);
  const targetType = normalizeColor(valueAt(source, ["targetType", "targetColor", "goalColor", "target.color", "goal.color", "objective.color", "objectives.0.color"], typeof target === "string" ? target : "purple")) || "purple";
  const targetCount = valueAt(source, ["targetCount", "goalCount", "collectCount", "target.count", "goal.count", "objective.count", "objectives.0.count"], 1);
  const rawObjectives = valueAt(source, ["objectives", "targets", "goals"], []);
  const objectives = Array.isArray(rawObjectives) && rawObjectives.length
    ? rawObjectives.slice(0, MAX_OBJECTIVES).map((objective) => adaptExternalObjective(objective, targetType, targetCount))
    : target != null || source.targetType || source.targetColor || source.goalColor
      ? [adaptExternalObjective(target, targetType, targetCount)] : [];
  const moveLimit = valueAt(source, ["moveLimit", "maxMoves", "moves", "turnLimit", "maxTurns"], 20);
  const objectiveCount = objectives.reduce((sum, objective) => sum + objective.count, 0);
  const parMoves = valueAt(source, ["parMoves", "par", "recommendedMoves", "solutionMoves", "minMoves"], Math.max(1, Math.ceil(objectiveCount * 0.8)));
  const testClearMoves = valueAt(source, ["testClearMoves", "clearMoves", "bestMoves", "playtestMoves"], 0);
  return normalizeCave({
    id: valueAt(source, ["id", "uuid", "levelId", "stageId"], crypto.randomUUID()),
    name: valueAt(source, ["name", "title", "levelName", "stageName"], `Imported Cave ${String(index + 1).padStart(4, "0")}`),
    width, height, gravity: valueAt(source, ["gravity", "gravityDirection", "direction"], "down"), layers,
    flowRule: valueAt(source, ["flowRule", "gravityFlowRule", "fallbackFlow"], "left-first"),
    terrainRules: valueAt(source, ["terrainRules", "terrainBehavior", "terrainBehaviors"], undefined),
    usableBlocks, objectives, targetType, targetCount, moveLimit, parMoves, testClearMoves,
    failureBonus: Boolean(valueAt(source, ["failureBonus", "useFailureBonus"], false)),
    note: valueAt(source, ["note", "description", "memo"], ""),
    externalSource: { format, sourceId: valueAt(source, ["id", "levelId", "stageId"], null) },
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
  const caves = levels.map((level, index) => adaptExternalLevel(level, index, format, unknownTokens, declaredLayers));
  const next = normalizeProject({ version: String(data?.version || data?.gameVersion || "IMPORTED"), caves, activeCaveId: caves[0].id, assetDefinitions: data?.assetDefinitions });
  return { project: next, format, unknownTokens: [...unknownTokens] };
}

function importProject(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = adaptImportedJson(JSON.parse(reader.result));
      snapshot(); project = imported.project;
      renderAll(); persist();
      const unknown = imported.unknownTokens.length ? ` · 미매핑 값 ${imported.unknownTokens.length}개 제외` : "";
      toast(`${imported.format}에서 Cave ${project.caves.length}개를 가져왔습니다${unknown}.`);
    } catch (error) { toast(error.message || "지원되는 퍼즐 JSON이 아닙니다."); }
    $("importFile").value = "";
  };
  reader.readAsText(file);
}

function bindInputs() {
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
  $("showAssetDefinition").addEventListener("click", () => {
    $("assetDefinitionForm").reset();
    $("assetDefinitionForm").hidden = false;
    $("assetDefinitionName").focus();
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
  $("deleteCaveButton").addEventListener("click", deleteCave);
  $("resizeButton").addEventListener("click", resizeMap);
  $("randomizeButton").addEventListener("click", randomizeBlocks);
  $("undoButton").addEventListener("click", undo);
  $("redoButton").addEventListener("click", redo);
  $("prevCaveButton").addEventListener("click", () => switchCave(-1));
  $("nextCaveButton").addEventListener("click", () => switchCave(1));
  $("validateButton").addEventListener("click", () => showSimulation(false));
  $("playButton").addEventListener("click", () => showSimulation(true));
  $("closeSimulationButton").addEventListener("click", () => $("simulationDialog").close());
  $("closeSimulationFooterButton").addEventListener("click", () => $("simulationDialog").close());
  $("playtestResetButton").addEventListener("click", resetPlaytest);
  $("usePlaytestResultButton").addEventListener("click", usePlaytestResult);
  $("saveButton").addEventListener("click", () => persist(true));
  $("exportButton").addEventListener("click", exportProject);
  $("importButton").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", (event) => importProject(event.target.files[0]));
  $("caveSearch").addEventListener("input", (event) => { caveSearchQuery = event.target.value; renderCaveList(); });
  $("versionInput").addEventListener("change", (event) => setContentVersion(event.target.value));
  $("versionDown").addEventListener("click", () => stepContentVersion(-1));
  $("versionUp").addEventListener("click", () => stepContentVersion(1));
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
  $("terrainRuleType").addEventListener("change", (event) => { selectedTerrainRule = event.target.value; renderTerrainRuleEditor(); });
  $("terrainReaction").addEventListener("change", updateTerrainRule);
  $("terrainBlocksFlow").addEventListener("change", updateTerrainRule);
  $("terrainDurability").addEventListener("input", updateTerrainRule);
  $("noteInput").addEventListener("change", (event) => { snapshot(); activeCave().note = event.target.value; persist(); });
}

function updateTerrainRule() {
  snapshot();
  const cave = activeCave();
  cave.terrainRules[selectedTerrainRule] = {
    blocksFlow: $("terrainBlocksFlow").checked,
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

function showCellStatus(index) {
  const cave = activeCave(); const x = index % cave.width; const y = Math.floor(index / cave.width);
  const layers = Object.entries(cave.layers).filter(([, values]) => values[index]).map(([name, values]) => `${name}: ${values[index]}`);
  $("cellStatus").textContent = `(${x + 1}, ${y + 1})${layers.length ? ` · ${layers.join(" · ")}` : " · Empty"}`;
}

function cellDescription(cave, index) {
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

