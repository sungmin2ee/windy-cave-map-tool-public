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
    moveLimit: 20, failureBonus: true, note: "컬러 블록을 정리하고 출구까지 도달하는 기본 Cave입니다.",
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

function loadProject() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved?.caves?.length) return saved;
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
  $("failureBonus").checked = cave.failureBonus;
  $("noteInput").value = cave.note || "";
  document.querySelectorAll("[data-gravity]").forEach((button) => button.classList.toggle("active", button.dataset.gravity === cave.gravity));
  $("currentCaveTitle").textContent = cave.name;
  $("mapSizeBadge").textContent = `${cave.width} × ${cave.height}`;
  const arrows = { up: "↑", down: "↓", left: "←", right: "→" };
  $("gravityBadge").textContent = `GRAVITY ${arrows[cave.gravity]}`;
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

function validateCave(cave) {
  const issues = [];
  const totalBlocks = cave.layers.block.filter(Boolean).length;
  const teleportA = cave.layers.gimmick.filter((v) => v === "teleport-a").length;
  const teleportB = cave.layers.gimmick.filter((v) => v === "teleport-b").length;
  if (!totalBlocks) issues.push("퍼즐 블록이 하나도 없습니다.");
  if (cave.targetCount < 1) issues.push("목표 개수는 1 이상이어야 합니다.");
  if (cave.moveLimit < 1) issues.push("Moves는 1 이상이어야 합니다.");
  if (!cave.usableBlocks.length) issues.push("사용 가능한 블록 색상을 하나 이상 선택해야 합니다.");
  if (teleportA !== teleportB) issues.push(`Teleport A/B 개수가 다릅니다. (${teleportA}/${teleportB})`);
  if (cave.layers.block.some((block) => block && !cave.usableBlocks.includes(block))) issues.push("사용 색상에서 제외된 블록이 맵에 배치되어 있습니다.");
  return issues;
}

function showSimulation(playMode) {
  const cave = activeCave();
  const issues = validateCave(cave);
  $("simulationTitle").textContent = cave.name;
  const result = $("simulationResult");
  result.className = `simulation-result ${issues.length ? "error" : "success"}`;
  result.innerHTML = issues.length
    ? `<strong>검증 실패</strong><br>${issues.map((issue) => `• ${escapeHtml(issue)}`).join("<br>")}`
    : `<strong>${playMode ? "플레이 준비 완료" : "검증 통과"}</strong><br>목표 ${cave.targetType} × ${cave.targetCount} · Moves ${cave.moveLimit} · Gravity ${cave.gravity}`;
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
  const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob); const anchor = document.createElement("a");
  anchor.href = url; anchor.download = `windy-caves-${project.version.toLowerCase()}.json`; anchor.click(); URL.revokeObjectURL(url);
  toast("프로젝트 JSON을 내보냈습니다.");
}

function importProject(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const next = JSON.parse(reader.result);
      if (!next?.caves?.length) throw new Error("invalid");
      snapshot(); project = next;
      if (!project.activeCaveId) project.activeCaveId = project.caves[0].id;
      renderAll(); persist(); toast("프로젝트를 불러왔습니다.");
    } catch (_) { toast("올바른 Windy Cave JSON이 아닙니다."); }
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
  $("failureBonus").addEventListener("change", updateRule);
  $("noteInput").addEventListener("change", (event) => { snapshot(); activeCave().note = event.target.value; persist(); });
}

function updateRule() {
  snapshot(); const cave = activeCave();
  cave.targetType = $("targetType").value;
  cave.targetCount = Math.max(1, Number($("targetCount").value));
  cave.moveLimit = Math.max(1, Number($("moveLimit").value));
  cave.failureBonus = $("failureBonus").checked;
  persist();
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

