const COLORS = {
  red: "#ef4f5f", yellow: "#f7c73b", blue: "#35a9ff",
  green: "#36d477", orange: "#ff8a36", purple: "#b65bff",
};

const CLIENT_VERSION = "2.3.0";
const SCHEMA_VERSION = 4;
const MIN_SCHEMA_VERSION = 1;

const ASSETS = {
  terrain: [
    { id: "floor", name: "Floor", className: "terrain-floor", visual: "·" },
    { id: "wall", name: "Wall", className: "terrain-wall", visual: "▦" },
    { id: "ice", name: "Ice", className: "terrain-ice", visual: "❄" },
    { id: "pit", name: "Pit", className: "terrain-pit", visual: "●" },
    { id: "conveyor", name: "Conveyor", className: "terrain-conveyor", visual: "➜" },
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
  ],
  item: [
    { id: "coin", name: "Coin", visual: "●" },
    { id: "key", name: "Key", visual: "⚿" },
    { id: "star", name: "Star", visual: "★" },
    { id: "bomb", name: "Bomb", visual: "✹" },
    { id: "bonus", name: "Bonus", visual: "+" },
  ],
};

const DEFAULT_TERRAIN_RULES = {
  floor: { blocksFlow: false, reaction: "none", durability: 1 },
  wall: { blocksFlow: true, reaction: "none", durability: 1 },
  ice: { blocksFlow: false, reaction: "adjacent", durability: 2 },
  pit: { blocksFlow: true, reaction: "none", durability: 1 },
  conveyor: { blocksFlow: false, reaction: "none", durability: 1 },
};

const FLOW_RULES = ["left-first", "right-first", "alternate", "seeded-random", "none"];

const STORAGE_KEY = "windy-cave-map-tool-v1";

const deepCopy = (value) => JSON.parse(JSON.stringify(value));
const emptyLayers = (size) => ({ terrain: Array(size).fill(null), block: Array(size).fill(null), gimmick: Array(size).fill(null), item: Array(size).fill(null) });

function createCave(number, name = `Cave ${String(number).padStart(4, "0")}`) {
  const width = 10;
  const height = 12;
  const layers = emptyLayers(width * height);
  for (let x = 0; x < width; x += 1) {
    layers.terrain[x] = "wall";
    layers.terrain[(height - 1) * width + x] = "wall";
  }
  for (let y = 0; y < height; y += 1) {
    layers.terrain[y * width] = "wall";
    layers.terrain[y * width + width - 1] = "wall";
  }
  [23, 24, 25, 34, 35, 44].forEach((i, idx) => { layers.block[i] = ["red", "yellow", "blue", "green", "orange", "purple"][idx]; });
  layers.gimmick[width + 1] = "teleport-a";
  layers.gimmick[(height - 2) * width + width - 2] = "teleport-b";
  return {
    id: crypto.randomUUID(), name, width, height, gravity: "down", layers,
    usableBlocks: Object.keys(COLORS), targetType: "purple", targetCount: 8,
    moveLimit: 20, parMoves: 14, testClearMoves: 0,
    randomSeed: `CAVE-${String(number).padStart(4, "0")}`, randomDensity: 100,
    flowRule: "left-first", terrainRules: deepCopy(DEFAULT_TERRAIN_RULES),
    failureBonus: true, note: "컬러 블록을 정리하고 출구까지 도달하는 기본 Cave입니다.",
  };
}

const defaultProject = () => ({ version: "V0001", caves: [createCave(1)], activeCaveId: null });
let project = loadProject();
if (!project.activeCaveId || !project.caves.some((c) => c.id === project.activeCaveId)) project.activeCaveId = project.caves[0].id;

let activeLayer = "terrain";
let activeTool = "brush";
let selectedAssets = { terrain: "floor", block: "red", gimmick: "teleport-a", item: "coin" };
let undoStack = [];
let redoStack = [];
let isPainting = false;
let strokeSnapshotTaken = false;
let playtestState = null;
let selectedTerrainRule = "ice";

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
  return COLORS[normalized] ? normalized : null;
}

function normalizeGravity(value) {
  const key = String(value ?? "down").trim().toLowerCase();
  const aliases = { 0: "down", 1: "left", 2: "up", 3: "right", d: "down", u: "up", l: "left", r: "right", 아래: "down", 위: "up", 왼쪽: "left", 오른쪽: "right" };
  const normalized = aliases[key] || key;
  return ["up", "down", "left", "right"].includes(normalized) ? normalized : "down";
}

function normalizeProject(data) {
  const source = data && typeof data === "object" ? data : {};
  const rawCaves = Array.isArray(source.caves) ? source.caves : [];
  const caves = rawCaves.map((cave, index) => normalizeCave(cave, index));
  if (!caves.length) caves.push(createCave(1));
  const activeCaveId = caves.some((cave) => cave.id === source.activeCaveId) ? source.activeCaveId : caves[0].id;
  return { ...source, version: String(source.contentVersion || source.version || "V0001"), caves, activeCaveId };
}

function normalizeCave(data, index = 0) {
  const source = data && typeof data === "object" ? data : {};
  const width = clampNumber(source.width, 10, 4, 20);
  const height = clampNumber(source.height, 12, 4, 20);
  const size = width * height;
  const layers = emptyLayers(size);
  for (const layer of Object.keys(layers)) {
    const values = Array.isArray(source.layers?.[layer]) ? source.layers[layer] : [];
    for (let i = 0; i < size; i += 1) layers[layer][i] = values[i] ?? null;
  }
  const usableBlocks = Array.isArray(source.usableBlocks)
    ? source.usableBlocks.map(normalizeColor).filter(Boolean)
    : Object.keys(COLORS);
  const targetType = normalizeColor(source.targetType) || "purple";
  const targetCount = clampNumber(source.targetCount, 8, 1, 999);
  const moveLimit = clampNumber(source.moveLimit, 20, 1, 999);
  const estimatedPar = Math.max(1, Math.ceil(targetCount * 0.8 + usableBlocks.length * 0.7));
  const terrainRules = {};
  Object.keys(DEFAULT_TERRAIN_RULES).forEach((terrainId) => {
    const rule = source.terrainRules?.[terrainId] || {};
    const reaction = ["none", "under", "adjacent"].includes(rule.reaction) ? rule.reaction : DEFAULT_TERRAIN_RULES[terrainId].reaction;
    terrainRules[terrainId] = {
      blocksFlow: rule.blocksFlow == null ? DEFAULT_TERRAIN_RULES[terrainId].blocksFlow : Boolean(rule.blocksFlow),
      reaction,
      durability: clampNumber(rule.durability, DEFAULT_TERRAIN_RULES[terrainId].durability, 1, 99),
    };
  });
  return {
    ...source,
    id: source.id || crypto.randomUUID(),
    name: String(source.name || `Cave ${String(index + 1).padStart(4, "0")}`),
    width, height, gravity: normalizeGravity(source.gravity), layers,
    usableBlocks: [...new Set(usableBlocks.length ? usableBlocks : Object.keys(COLORS))],
    targetType, targetCount, moveLimit,
    parMoves: clampNumber(source.parMoves, Math.min(moveLimit, estimatedPar), 1, 999),
    testClearMoves: clampNumber(source.testClearMoves, 0, 0, 999),
    randomSeed: String(source.randomSeed || `CAVE-${String(index + 1).padStart(4, "0")}`),
    randomDensity: clampNumber(source.randomDensity, 100, 10, 100),
    flowRule: FLOW_RULES.includes(source.flowRule) ? source.flowRule : "left-first",
    terrainRules,
    failureBonus: Boolean(source.failureBonus),
    note: String(source.note || ""),
  };
}

function loadProject() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.caves?.length) return normalizeProject(saved);
  } catch (_) {}
  return defaultProject();
}

function persist(showMessage = false) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  if (showMessage) toast("브라우저에 저장했습니다.");
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

function getAsset(layer, id) { return ASSETS[layer].find((asset) => asset.id === id); }

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
  project.caves.forEach((cave, index) => {
    const button = document.createElement("button");
    button.className = `cave-item${cave.id === project.activeCaveId ? " active" : ""}`;
    button.innerHTML = `<span class="cave-number">${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(cave.name)}</strong>`;
    button.addEventListener("click", () => { project.activeCaveId = cave.id; undoStack = []; redoStack = []; renderAll(); persist(); });
    list.appendChild(button);
  });
}

function renderRules() {
  const cave = activeCave();
  $("caveName").value = cave.name;
  $("mapWidth").value = cave.width;
  $("mapHeight").value = cave.height;
  $("targetType").value = cave.targetType;
  $("targetCount").value = cave.targetCount;
  $("moveLimit").value = cave.moveLimit;
  $("parMoves").value = cave.parMoves;
  $("testClearMoves").value = cave.testClearMoves || "";
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
  const rule = cave.terrainRules[selectedTerrainRule] || DEFAULT_TERRAIN_RULES[selectedTerrainRule];
  $("terrainRuleType").value = selectedTerrainRule;
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
    <div><span>자동 난이도</span><strong>${analysis.label}</strong></div>
    <small>점수 ${analysis.score} · 여유 ${analysis.slack >= 0 ? "+" : ""}${analysis.slack} Moves · 블록 ${analysis.totalBlocks} · 기믹 ${analysis.gimmickCount}</small>
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
  ASSETS[activeLayer].forEach((asset) => {
    const button = document.createElement("button");
    button.className = `asset-card${activeTool !== "eraser" && selectedAssets[activeLayer] === asset.id ? " active" : ""}`;
    const style = activeLayer === "block" ? `background:${COLORS[asset.id]}` : "";
    button.innerHTML = `<span class="asset-visual ${asset.className || ""}" style="${style}">${asset.visual}</span><span>${asset.name}</span>`;
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
  Object.entries(COLORS).forEach(([name, color]) => {
    const button = document.createElement("button");
    button.className = `color-toggle${activeCave().usableBlocks.includes(name) ? " active" : ""}`;
    button.style.background = color;
    button.title = name;
    button.addEventListener("click", () => {
      snapshot();
      const usable = activeCave().usableBlocks;
      activeCave().usableBlocks = usable.includes(name) ? usable.filter((value) => value !== name) : [...usable, name];
      renderPalette(); persist();
    });
    colors.appendChild(button);
  });
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
    if (layer === "block") visual.style.background = COLORS[assetId];
    if (layer === "gimmick" || layer === "item") visual.textContent = asset.visual;
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
  renderGrid(); persist(); showCellStatus(index);
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
  const colors = cave.usableBlocks.length ? cave.usableBlocks : Object.keys(COLORS);
  const random = seededRandom(`${seed}|${cave.width}x${cave.height}|${colors.join(",")}|${density}`);
  const blocks = Array(cave.width * cave.height).fill(null);
  const eligible = [];
  for (let index = 0; index < blocks.length; index += 1) {
    if (isBarrier(cave, index)) continue;
    eligible.push(index);
    if (random() * 100 >= density) continue;
    const candidates = [...colors].sort(() => random() - 0.5).filter((color) => !wouldCreateMatch(blocks, index, color, cave));
    blocks[index] = candidates[0] || null;
  }
  const targetNeeded = Math.min(cave.targetCount, eligible.length);
  let targetPlaced = blocks.filter((value) => value === cave.targetType).length;
  const shuffled = [...eligible].sort(() => random() - 0.5);
  for (const index of shuffled) {
    if (targetPlaced >= targetNeeded) break;
    if (blocks[index] !== cave.targetType && !wouldCreateMatch(blocks, index, cave.targetType, cave)) {
      blocks[index] = cave.targetType;
      targetPlaced += 1;
    }
  }
  snapshot();
  cave.layers.block = blocks;
  cave.randomSeed = seed;
  cave.randomDensity = density;
  renderAll(); persist();
  const shortfall = Math.max(0, targetNeeded - targetPlaced);
  toast(`시드 ${seed} · 시작 매치 0개 · 블록 ${blocks.filter(Boolean).length}개${shortfall ? ` · 목표색 ${shortfall}개 부족` : ""}`);
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
  const targetPressure = cave.targetCount / Math.max(1, totalBlocks);
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
  return { ...levels, score, slack, budgetRatio, totalBlocks, usedColors: usedColors.size, gimmickCount, itemCount, referenceMoves };
}

function validateCave(cave) {
  const errors = [];
  const warnings = [];
  const analysis = analyzeDifficulty(cave);
  const teleportA = cave.layers.gimmick.filter((value) => value === "teleport-a").length;
  const teleportB = cave.layers.gimmick.filter((value) => value === "teleport-b").length;
  const targetBlocks = cave.layers.block.filter((value) => value === cave.targetType).length;
  const initialMatches = findMatches(cave).size;
  if (!analysis.totalBlocks) errors.push("퍼즐 블록이 하나도 없습니다.");
  if (cave.targetCount < 1) errors.push("목표 개수는 1 이상이어야 합니다.");
  if (cave.moveLimit < 1) errors.push("Moves는 1 이상이어야 합니다.");
  if (cave.parMoves < 1) errors.push("권장 클리어 Moves는 1 이상이어야 합니다.");
  if (!cave.usableBlocks.length) errors.push("사용 가능한 블록 색상을 하나 이상 선택해야 합니다.");
  if (teleportA !== teleportB) errors.push(`Teleport A/B 개수가 다릅니다. (${teleportA}/${teleportB})`);
  if (cave.layers.block.some((block) => block && !cave.usableBlocks.includes(block))) errors.push("사용 색상에서 제외된 블록이 맵에 배치되어 있습니다.");
  if (cave.moveLimit < cave.parMoves) errors.push(`Moves ${cave.moveLimit}회가 권장 클리어 ${cave.parMoves}회보다 적습니다.`);
  if (cave.testClearMoves > cave.moveLimit) errors.push(`테스트 클리어 ${cave.testClearMoves}회가 제한 ${cave.moveLimit}회를 초과합니다.`);
  if (!cave.testClearMoves) warnings.push("테스트 클리어 Moves가 없습니다. 실제 플레이 기록을 입력하면 난이도 판정이 더 정확해집니다.");
  if (cave.moveLimit >= cave.parMoves * 2) warnings.push("허용 Moves가 권장 클리어 횟수의 2배 이상이라 난이도가 크게 낮아질 수 있습니다.");
  if (cave.targetCount > analysis.totalBlocks) warnings.push(`목표 ${cave.targetCount}개가 현재 전체 블록 ${analysis.totalBlocks}개보다 많습니다.`);
  if (targetBlocks < cave.targetCount) warnings.push(`현재 ${cave.targetType} 블록은 ${targetBlocks}개입니다. 생성/변환 규칙이 없다면 목표 달성이 어렵습니다.`);
  if (initialMatches) warnings.push(`시작 상태에 이미 3-Match 블록이 ${initialMatches}개 있습니다. 랜덤 재배치를 권장합니다.`);
  if (analysis.totalBlocks && !initialMatches && !hasPossibleSwap(cave)) warnings.push("시작 상태에서 가능한 3-Match 교환을 찾지 못했습니다.");
  return { errors, warnings, analysis };
}

function issueHtml(validation) {
  const errorHtml = validation.errors.length ? `<div><b>오류</b><br>${validation.errors.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  const warningHtml = validation.warnings.length ? `<div><b>경고</b><br>${validation.warnings.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  return errorHtml + warningHtml;
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
  $("simulationTitle").textContent = cave.name;
  $("playtestGuide").hidden = !playMode || Boolean(validation.errors.length);
  $("playtestResetButton").hidden = !playMode || Boolean(validation.errors.length);
  $("usePlaytestResultButton").hidden = true;
  if (playMode && !validation.errors.length) {
    playtestState = {
      cave: deepCopy(cave), movesLeft: cave.moveLimit, targetCleared: 0, selectedIndex: null,
      status: "playing", message: "교환할 첫 번째 블록을 선택하세요.", validation,
      random: seededRandom(`${cave.randomSeed}|playtest`), terrainHits: Array(cave.width * cave.height).fill(0), flowTurn: 0,
    };
    renderPlaytest();
  } else {
    playtestState = null;
    const result = $("simulationResult");
    result.className = `simulation-result ${validation.errors.length ? "error" : validation.warnings.length ? "warning" : "success"}`;
    result.innerHTML = `
      <strong>${validation.errors.length ? "검증 실패" : "검증 통과"}</strong><br>
      난이도 ${validation.analysis.label} (${validation.analysis.score}점) · 목표 ${cave.targetType} × ${cave.targetCount} · 제한 ${cave.moveLimit} · 권장 ${cave.parMoves}${cave.testClearMoves ? ` · 테스트 ${cave.testClearMoves}` : ""}<br>
      여유 Moves ${validation.analysis.slack >= 0 ? "+" : ""}${validation.analysis.slack} · Gravity ${cave.gravity}
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

function isBarrier(cave, index) {
  if (index < 0 || index >= cave.width * cave.height) return true;
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
  const colors = cave.usableBlocks.length ? cave.usableBlocks : Object.keys(COLORS);
  for (let index = 0; index < cave.layers.block.length; index += 1) {
    if (!cave.layers.block[index] && !isBarrier(cave, index)) {
      cave.layers.block[index] = colors[Math.floor(random() * colors.length)];
    }
  }
}

function damageTerrainFromMatches(state, matches) {
  const cave = state.cave;
  let damaged = 0;
  let broken = 0;
  for (let index = 0; index < cave.layers.terrain.length; index += 1) {
    const terrainId = cave.layers.terrain[index];
    const rule = terrainId ? cave.terrainRules?.[terrainId] : null;
    if (!rule || rule.reaction === "none") continue;
    let affected = matches.has(index);
    if (!affected && rule.reaction === "adjacent") {
      const x = index % cave.width;
      const neighbors = [];
      if (x > 0) neighbors.push(index - 1);
      if (x < cave.width - 1) neighbors.push(index + 1);
      if (index >= cave.width) neighbors.push(index - cave.width);
      if (index + cave.width < cave.layers.terrain.length) neighbors.push(index + cave.width);
      affected = neighbors.some((neighbor) => matches.has(neighbor));
    }
    if (!affected) continue;
    state.terrainHits[index] = (state.terrainHits[index] || 0) + 1;
    damaged += 1;
    if (state.terrainHits[index] >= rule.durability) {
      cave.layers.terrain[index] = null;
      state.terrainHits[index] = 0;
      broken += 1;
    }
  }
  return { damaged, broken };
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
    matches.forEach((index) => {
      if (state.cave.layers.block[index] === state.cave.targetType) state.targetCleared += 1;
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
  if (state.targetCleared >= state.cave.targetCount) {
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
  const flowLabels = { "left-first": "왼쪽/위 우선", "right-first": "오른쪽/아래 우선", alternate: "교대", "seeded-random": "시드 랜덤", none: "우회 없음" };
  const result = $("simulationResult");
  result.className = `simulation-result ${state.status === "won" ? "success" : ["lost", "stuck"].includes(state.status) ? "error" : "warning"}`;
  result.innerHTML = `
    <strong>${state.status === "won" ? "PLAYTEST 성공" : ["lost", "stuck"].includes(state.status) ? "PLAYTEST 종료" : "PLAYTEST 진행 중"}</strong><br>
    Moves <b>${state.movesLeft}</b> / ${state.cave.moveLimit} · 목표 ${state.cave.targetType} <b>${Math.min(state.targetCleared, state.cave.targetCount)}</b> / ${state.cave.targetCount} · 사용 ${usedMoves}회<br>
    Gravity ${state.cave.gravity} · 막힘 우회 ${flowLabels[state.cave.flowRule]}<br>
    ${escapeHtml(state.message)}
    ${state.cave.layers.gimmick.some(Boolean) ? "<div>※ 3-Match·중력 우회·Terrain 내구도·리필·색상 목표를 계산합니다. 기믹과 아이템은 표시만 됩니다.</div>" : ""}
  `;
  $("usePlaytestResultButton").hidden = state.status !== "won";
  renderSimulationGrid(state.cave, state.status === "playing");
}

function resetPlaytest() {
  if (!playtestState) return;
  const cave = activeCave();
  playtestState = {
    cave: deepCopy(cave), movesLeft: cave.moveLimit, targetCleared: 0, selectedIndex: null,
    status: "playing", message: "교환할 첫 번째 블록을 선택하세요.", validation: validateCave(cave),
    random: seededRandom(`${cave.randomSeed}|playtest`), terrainHits: Array(cave.width * cave.height).fill(0), flowTurn: 0,
  };
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
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `windy-caves-${project.version.toLowerCase()}.json`; anchor.click(); URL.revokeObjectURL(url);
  toast("프로젝트 JSON을 내보냈습니다.");
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

function normalizeAssetId(layer, value, unknownTokens) {
  if (value == null || value === "" || value === false) return null;
  if (layer === "block") return normalizeColor(value);
  const raw = String(value).trim().toLowerCase();
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
  unknownTokens?.add(`${layer}:${raw}`);
  return null;
}

function applyCellToken(layers, index, token, unknownTokens) {
  if (token == null) return;
  if (Array.isArray(token)) {
    token.forEach((entry) => applyCellToken(layers, index, entry, unknownTokens));
    return;
  }
  if (typeof token === "number" || /^\d+$/.test(String(token).trim())) {
    const numericMap = {
      0: null, 1: "wall", 2: "floor", 3: "red", 4: "yellow", 5: "blue", 6: "green", 7: "orange", 8: "purple",
      9: "pit", 10: "ice", 11: "teleport-a", 12: "teleport-b", 13: "switch", 14: "door", 15: "exit", 16: "coin", 17: "key",
    };
    applyCellToken(layers, index, numericMap[Number(token)], unknownTokens);
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
      const normalized = normalizeAssetId(layer, value, unknownTokens);
      if (normalized) layers[layer][index] = normalized;
      applied = true;
    });
    if (!applied) applyCellToken(layers, index, valueAt(token, ["type", "id", "value", "name"]), unknownTokens);
    return;
  }
  const parts = String(token).split(/[|,+]/).map((part) => part.trim()).filter(Boolean);
  if (parts.length > 1) {
    parts.forEach((part) => applyCellToken(layers, index, part, unknownTokens));
    return;
  }
  const value = parts[0] || String(token);
  const color = normalizeColor(value);
  if (color) { layers.block[index] = color; return; }
  for (const layer of ["terrain", "gimmick", "item"]) {
    const normalized = normalizeAssetId(layer, value, null);
    if (normalized) { layers[layer][index] = normalized; return; }
  }
  unknownTokens?.add(String(value));
}

function adaptExternalLevel(level, index, format, unknownTokens) {
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
      const normalized = normalizeAssetId(layer, value, unknownTokens);
      if (normalized) layers[layer][cellIndex] = normalized;
    });
  });
  flatArray(grid).slice(0, size).forEach((token, cellIndex) => applyCellToken(layers, cellIndex, token, unknownTokens));
  const target = valueAt(source, ["target", "goal", "objective", "objectives.0"], {});
  const rawUsable = valueAt(source, ["usableBlocks", "availableColors", "colors", "palette"], Object.keys(COLORS));
  const usableBlocks = (Array.isArray(rawUsable) ? rawUsable : String(rawUsable).split(",")).map(normalizeColor).filter(Boolean);
  const targetType = normalizeColor(valueAt(source, ["targetType", "targetColor", "goalColor", "target.color", "goal.color", "objective.color", "objectives.0.color"], typeof target === "string" ? target : "purple")) || "purple";
  const targetCount = valueAt(source, ["targetCount", "goalCount", "collectCount", "target.count", "goal.count", "objective.count", "objectives.0.count"], 1);
  const moveLimit = valueAt(source, ["moveLimit", "maxMoves", "moves", "turnLimit", "maxTurns"], 20);
  const parMoves = valueAt(source, ["parMoves", "par", "recommendedMoves", "solutionMoves", "minMoves"], Math.max(1, Math.ceil(Number(targetCount) * 0.8)));
  const testClearMoves = valueAt(source, ["testClearMoves", "clearMoves", "bestMoves", "playtestMoves"], 0);
  return normalizeCave({
    id: valueAt(source, ["id", "uuid", "levelId", "stageId"], crypto.randomUUID()),
    name: valueAt(source, ["name", "title", "levelName", "stageName"], `Imported Cave ${String(index + 1).padStart(4, "0")}`),
    width, height, gravity: valueAt(source, ["gravity", "gravityDirection", "direction"], "down"), layers,
    flowRule: valueAt(source, ["flowRule", "gravityFlowRule", "fallbackFlow"], "left-first"),
    terrainRules: valueAt(source, ["terrainRules", "terrainBehavior", "terrainBehaviors"], undefined),
    usableBlocks, targetType, targetCount, moveLimit, parMoves, testClearMoves,
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
  else {
    const containers = ["levels", "stages", "maps", "puzzles"];
    const key = containers.find((name) => Array.isArray(data?.[name]));
    if (key) { levels = data[key]; format = `외부 ${key}`; }
    else if (data && typeof data === "object") levels = [data];
  }
  if (!levels.length) throw new Error("편집할 레벨 데이터를 찾지 못했습니다.");
  const unknownTokens = new Set();
  const caves = levels.map((level, index) => adaptExternalLevel(level, index, format, unknownTokens));
  const next = normalizeProject({ version: String(data?.version || data?.gameVersion || "IMPORTED"), caves, activeCaveId: caves[0].id });
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
  $("versionInput").addEventListener("change", (event) => { snapshot(); project.version = event.target.value.trim() || "V0001"; persist(); });
  $("caveName").addEventListener("change", (event) => { snapshot(); activeCave().name = event.target.value.trim() || "Untitled Cave"; renderAll(); persist(); });
  $("targetType").addEventListener("change", updateRule);
  $("targetCount").addEventListener("change", updateRule);
  $("moveLimit").addEventListener("change", updateRule);
  $("parMoves").addEventListener("change", updateRule);
  $("testClearMoves").addEventListener("change", updateRule);
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
  cave.targetType = $("targetType").value;
  cave.targetCount = Math.max(1, Number($("targetCount").value));
  cave.moveLimit = Math.max(1, Number($("moveLimit").value));
  cave.parMoves = Math.max(1, Number($("parMoves").value));
  cave.testClearMoves = Math.max(0, Number($("testClearMoves").value || 0));
  cave.flowRule = FLOW_RULES.includes($("flowRule").value) ? $("flowRule").value : "left-first";
  cave.failureBonus = $("failureBonus").checked;
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

