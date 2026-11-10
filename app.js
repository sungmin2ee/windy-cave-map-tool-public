const COLORS = {
  red: "#ef4f5f", yellow: "#f7c73b", blue: "#35a9ff",
  green: "#36d477", orange: "#ff8a36", purple: "#b65bff",
};

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
  return { ...source, version: String(source.version || "V0001"), caves, activeCaveId };
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
  return {
    ...source,
    id: source.id || crypto.randomUUID(),
    name: String(source.name || `Cave ${String(index + 1).padStart(4, "0")}`),
    width, height, gravity: normalizeGravity(source.gravity), layers,
    usableBlocks: [...new Set(usableBlocks.length ? usableBlocks : Object.keys(COLORS))],
    targetType, targetCount, moveLimit,
    parMoves: clampNumber(source.parMoves, Math.min(moveLimit, estimatedPar), 1, 999),
    testClearMoves: clampNumber(source.testClearMoves, 0, 0, 999),
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
  $("failureBonus").checked = cave.failureBonus;
  $("noteInput").value = cave.note || "";
  document.querySelectorAll("[data-gravity]").forEach((button) => button.classList.toggle("active", button.dataset.gravity === cave.gravity));
  $("currentCaveTitle").textContent = cave.name;
  $("mapSizeBadge").textContent = `${cave.width} × ${cave.height}`;
  const arrows = { up: "↑", down: "↓", left: "←", right: "→" };
  $("gravityBadge").textContent = `GRAVITY ${arrows[cave.gravity]}`;
  renderDifficultySummary(cave);
}

function renderDifficultySummary(cave) {
  const analysis = analyzeDifficulty(cave);
  const node = $("difficultySummary");
  node.className = `difficulty-summary difficulty-${analysis.key}`;
  node.innerHTML = `
    <div><span>자동 난이도</span><strong>${analysis.label}</strong></div>
    <small>점수 ${analysis.score} · 여유 ${analysis.slack >= 0 ? "+" : ""}${analysis.slack} Moves · 블록 ${analysis.totalBlocks} · 기믹 ${analysis.gimmickCount}</small>
  `;
}

function renderPalette() {
  document.querySelectorAll("[data-layer]").forEach((button) => button.classList.toggle("active", button.dataset.layer === activeLayer));
  const assetGrid = $("assetGrid");
  assetGrid.innerHTML = "";
  ASSETS[activeLayer].forEach((asset) => {
    const button = document.createElement("button");
    button.className = `asset-card${selectedAssets[activeLayer] === asset.id ? " active" : ""}`;
    const style = activeLayer === "block" ? `background:${COLORS[asset.id]}` : "";
    button.innerHTML = `<span class="asset-visual ${asset.className || ""}" style="${style}">${asset.visual}</span><span>${asset.name}</span>`;
    button.addEventListener("click", () => { selectedAssets[activeLayer] = asset.id; renderPalette(); });
    assetGrid.appendChild(button);
  });
  const current = getAsset(activeLayer, selectedAssets[activeLayer]);
  $("selectedAssetSummary").textContent = `${activeLayer.toUpperCase()} · ${current.name}`;
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
      event.preventDefault(); isPainting = true; strokeSnapshotTaken = false;
      editCell(index, activeTool === "fill");
    });
    cell.addEventListener("pointerenter", () => { if (isPainting && activeTool !== "fill") editCell(index, false); });
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
  return { errors, warnings, analysis };
}

function showSimulation(playMode) {
  const cave = activeCave();
  const validation = validateCave(cave);
  $("simulationTitle").textContent = cave.name;
  const result = $("simulationResult");
  result.className = `simulation-result ${validation.errors.length ? "error" : validation.warnings.length ? "warning" : "success"}`;
  const errorHtml = validation.errors.length ? `<div><b>오류</b><br>${validation.errors.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  const warningHtml = validation.warnings.length ? `<div><b>경고</b><br>${validation.warnings.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}</div>` : "";
  result.innerHTML = `
    <strong>${validation.errors.length ? "검증 실패" : playMode ? "맵 미리보기" : "검증 통과"}</strong><br>
    난이도 ${validation.analysis.label} (${validation.analysis.score}점) · 목표 ${cave.targetType} × ${cave.targetCount} · 제한 ${cave.moveLimit} · 권장 ${cave.parMoves}${cave.testClearMoves ? ` · 테스트 ${cave.testClearMoves}` : ""}<br>
    여유 Moves ${validation.analysis.slack >= 0 ? "+" : ""}${validation.analysis.slack} · Gravity ${cave.gravity}
    ${errorHtml}${warningHtml}
  `;
  const grid = $("simulationGrid");
  grid.style.gridTemplateColumns = `repeat(${cave.width}, 30px)`;
  grid.innerHTML = "";
  for (let i = 0; i < cave.width * cave.height; i += 1) {
    const cell = document.createElement("div"); cell.className = "map-cell"; applyCellVisual(cell, cave, i); grid.appendChild(cell);
  }
  $("simulationDialog").showModal();
}

function exportProject() {
  persist();
  const payload = { schema: "windy-cave-map-tool/v2", exportedAt: new Date().toISOString(), ...project };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `windy-caves-${project.version.toLowerCase()}.json`; anchor.click(); URL.revokeObjectURL(url);
  toast("프로젝트 JSON을 내보냈습니다.");
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
    usableBlocks, targetType, targetCount, moveLimit, parMoves, testClearMoves,
    failureBonus: Boolean(valueAt(source, ["failureBonus", "useFailureBonus"], false)),
    note: valueAt(source, ["note", "description", "memo"], ""),
    externalSource: { format, sourceId: valueAt(source, ["id", "levelId", "stageId"], null) },
  }, index);
}

function adaptImportedJson(data) {
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
  window.addEventListener("pointerup", () => { isPainting = false; strokeSnapshotTaken = false; });
  $("toolGroup").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tool]"); if (!button) return;
    activeTool = button.dataset.tool; document.querySelectorAll("[data-tool]").forEach((node) => node.classList.toggle("active", node === button));
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
  $("undoButton").addEventListener("click", undo);
  $("redoButton").addEventListener("click", redo);
  $("prevCaveButton").addEventListener("click", () => switchCave(-1));
  $("nextCaveButton").addEventListener("click", () => switchCave(1));
  $("validateButton").addEventListener("click", () => showSimulation(false));
  $("playButton").addEventListener("click", () => showSimulation(true));
  $("closeSimulationButton").addEventListener("click", () => $("simulationDialog").close());
  $("closeSimulationFooterButton").addEventListener("click", () => $("simulationDialog").close());
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
  $("failureBonus").addEventListener("change", updateRule);
  $("noteInput").addEventListener("change", (event) => { snapshot(); activeCave().note = event.target.value; persist(); });
}

function updateRule() {
  snapshot(); const cave = activeCave();
  cave.targetType = $("targetType").value;
  cave.targetCount = Math.max(1, Number($("targetCount").value));
  cave.moveLimit = Math.max(1, Number($("moveLimit").value));
  cave.parMoves = Math.max(1, Number($("parMoves").value));
  cave.testClearMoves = Math.max(0, Number($("testClearMoves").value || 0));
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

