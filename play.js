import { createPuzzleEffects } from "./puzzle-effects.js?v=3";
import {
  $, adaptImportedJson, createPlayState, getAsset, normalizeObjectImage, playtestState, puzzleArtwork,
  renderPlaytest, renderSimulationGrid, setPuzzleArtwork, setPuzzlePlaytestState, setPuzzleProject,
  setPuzzleView, showObjectImage, showPlaytestHint, validateCave,
  readThemePack, THEME_PACK_FORMAT,
} from "./app.js?v=186";

const PUZZLE_GOAL_IMAGES = {
  "ddung-oak": "./art/ddung/goal-oak.webp",
  "ddung-dust-piece": "./art/ddung/goal-dust.webp",
};

const PUZZLE_PROGRESS_KEY = "ddung-puzzle-progress-v1";

const puzzleParams = new URLSearchParams(location.search);
const embedded = puzzleParams.get("embed") === "1";
const requestId = puzzleParams.get("requestId");
const puzzleEffects = createPuzzleEffects();
const reportedAttempts = new WeakSet();
let rules = {
  threeStars: 0.25, twoStars: 0.10, pointsPerGoalUnit: 0, pointsPerMoveLeft: 0,
};
let versions = { mapVersion: null, themeVersion: null };
let linkedPuzzle;
let resultOrigin;
let puzzleMaps;
let puzzleProgress = { current: 1, bestStars: {} };

function loadPuzzleProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PUZZLE_PROGRESS_KEY));
    for (const { level } of puzzleMaps.mapinfos) {
      const stars = saved?.bestStars?.[level];
      if (!Number.isInteger(stars) || stars < 1 || stars > 3) break;
      puzzleProgress.bestStars[level] = stars;
    }
    if (Number.isInteger(saved?.current) && saved.current > 0 && saved.current <= unlockedLevelCount()) {
      puzzleProgress.current = saved.current;
    }
  } catch {
    // Use session progress when browser storage is unavailable.
  }
}

function savePuzzleProgress() {
  try {
    localStorage.setItem(PUZZLE_PROGRESS_KEY, JSON.stringify(puzzleProgress));
  } catch {
    // The current session remains playable.
  }
}

function unlockedLevelCount() {
  return Math.min(Object.keys(puzzleProgress.bestStars).length + 1, puzzleMaps.mapinfos.length);
}

function renderLevelSelect() {
  const select = $("levelSelect");
  const options = puzzleMaps.mapinfos.slice(0, unlockedLevelCount()).map(({ level }) => {
    const option = document.createElement("option");
    const stars = puzzleProgress.bestStars[level];
    option.value = String(level);
    option.textContent = `레벨 ${level}${stars ? " · " + "★".repeat(stars) : ""}`;
    return option;
  });
  select.replaceChildren(...options);
  select.value = String(puzzleProgress.current);
  select.disabled = false;
}

function clearStarCount(state) {
  if (state.movesLeft === null) return 3;
  const remaining = state.movesLeft / state.cave.moveLimit;
  return remaining >= rules.threeStars ? 3 : remaining >= rules.twoStars ? 2 : 1;
}

function puzzleScore(state, won) {
  const earned = state.scoreTarget === null
    ? state.objectiveProgress.reduce((total, goal) => total + Math.min(goal.current, goal.target), 0) * rules.pointsPerGoalUnit
    : state.blocksRemoved * state.pointsPerBlock;
  return earned + (won ? (state.movesLeft ?? 0) * rules.pointsPerMoveLeft : 0);
}
let puzzleIndex = 0;

function startPuzzle(index) {
  if (linkedPuzzle) {
    beginPuzzle(linkedPuzzle.project, linkedPuzzle.cave, linkedPuzzle.title);
    return;
  }
  if (!Number.isInteger(index) || index < 0 || index >= unlockedLevelCount()) {
    throw new Error("아직 열리지 않은 레벨입니다.");
  }
  const level = puzzleMaps.mapinfos[index];
  const imported = adaptImportedJson({ version: puzzleMaps.version, mapinfos: [level] });
  if (imported.unknownTokens.length) throw new Error("읽을 수 없는 타일이 있습니다.");
  puzzleIndex = index;
  beginPuzzle(imported.project, imported.project.caves[0], `레벨 ${level.level}`);
}

function beginPuzzle(mapProject, cave, title) {
  setPuzzleProject(mapProject);
  const scoreTarget = rules.scoreTarget === undefined ? cave.scoreTarget : rules.scoreTarget;
  if (scoreTarget != null && rules.pointsPerBlock === 0) {
    throw new Error("점수제의 블록당 점수는 1점 이상이어야 합니다.");
  }
  const validation = validateCave(cave, mapProject.paletteAssets, scoreTarget);
  if (validation.errors.length || validation.unsupported.length) {
    throw new Error("이 레벨을 플레이할 수 없습니다. 맵툴의 검증 결과를 확인해 주세요.");
  }

  const state = createPlayState(cave, crypto.randomUUID(), true, rules);
  $("clearDialog").close();
  setPuzzlePlaytestState(state);
  state.validation = validation;
  $("levelTitle").textContent = title;
  if (!linkedPuzzle) {
    puzzleProgress.current = puzzleMaps.mapinfos[puzzleIndex].level;
    savePuzzleProgress();
    renderLevelSelect();
  }
  renderPlaytest();
}

function renderPuzzleGoals(state) {
  const goals = state.cave.objectives.map((objective, index) => {
    const asset = getAsset(objective.layer, objective.targetId, state.cave);
    const { current, target } = state.objectiveProgress[index];
    const goal = document.createElement("li");
    goal.className = "puzzle-goal";
    goal.title = asset?.name || objective.targetId;

    const icon = document.createElement("span");
    icon.className = "puzzle-goal-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = asset?.visual || "◆";
    if (asset?.color) icon.style.color = asset.color;
    const artwork = puzzleArtwork?.goals?.[objective.targetId] || puzzleArtwork?.layers[objective.layer]?.[objective.targetId];
    showObjectImage(icon, artwork || PUZZLE_GOAL_IMAGES[objective.targetId] || asset?.image);

    const count = document.createElement("strong");
    count.textContent = `${Math.min(current, target)} / ${target}`;
    count.setAttribute("aria-label", `${goal.title} ${target}개 중 ${Math.min(current, target)}개 달성`);
    goal.append(icon, count);
    return goal;
  });
  $("goals").replaceChildren(...goals);
}

function renderPuzzlePlayer() {
  const state = playtestState;
  $("movesLeft").textContent = state.movesLeft ?? "무제한";
  const scoreMode = state.scoreTarget !== null;
  $("scoreCard").hidden = !scoreMode && !rules.pointsPerGoalUnit && !rules.pointsPerMoveLeft;
  $("score").textContent = puzzleScore(state, state.status === "won");
  $("scoreTarget").textContent = scoreMode ? ` / ${state.scoreTarget}` : "";
  $("goalCard").hidden = scoreMode;
  if (!scoreMode) renderPuzzleGoals(state);

  const playing = state.status === "playing";
  const won = state.status === "won";
  const hasNext = !linkedPuzzle && puzzleIndex + 1 < puzzleMaps.mapinfos.length;

  $("playtestFrameStatus").textContent = won
    ? (linkedPuzzle || hasNext ? "클리어!" : "준비된 레벨을 모두 클리어했어요!")
    : state.status === "lost" && state.movesLeft === 0
      ? "이동 횟수를 모두 사용했어요."
      : state.message;
  $("restart").hidden = embedded;
  $("hint").hidden = !playing;
  $("next").hidden = !won || !hasNext;
  renderSimulationGrid(state.cave, playing);
  if (!playing) reportPuzzleResult(state, won ? "won" : "lost");

  const dialog = $("clearDialog");
  if (embedded) return;
  if (won && !dialog.open) {
    const stars = clearStarCount(state);
    if (!linkedPuzzle) {
      const level = puzzleMaps.mapinfos[puzzleIndex].level;
      puzzleProgress.bestStars[level] = Math.max(stars, puzzleProgress.bestStars[level] || 0);
      savePuzzleProgress();
      renderLevelSelect();
    }
    $("clearStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
    $("clearStars").setAttribute("aria-label", `별 ${stars}개`);
    $("clearMessage").textContent = scoreMode
      ? `목표 점수 ${state.scoreTarget}점을 달성했어요.`
      : linkedPuzzle || hasNext
      ? `${$("levelTitle").textContent}의 목표를 달성했어요.`
      : "준비된 레벨을 모두 클리어했어요!";
    $("clearError").textContent = "";
    $("clearNext").hidden = !hasNext;
    dialog.showModal();
    $(hasNext ? "clearNext" : "clearRestart").focus();
  }
}

function tryStartPuzzle(index) {
  try {
    startPuzzle(index);
  } catch (error) {
    $($("clearDialog").open ? "clearError" : "playtestFrameStatus").textContent = error.message;
  }
}

$("levelSelect").addEventListener("change", (event) => tryStartPuzzle(Number(event.target.value) - 1));
$("restart").addEventListener("click", () => tryStartPuzzle(puzzleIndex));
$("hint").addEventListener("click", showPlaytestHint);
$("next").addEventListener("click", () => tryStartPuzzle(puzzleIndex + 1));

$("clearRestart").addEventListener("click", () => tryStartPuzzle(puzzleIndex));
$("clearNext").addEventListener("click", () => tryStartPuzzle(puzzleIndex + 1));
document.addEventListener("contextmenu", (event) => event.preventDefault());

function sendToHost(type, payload = {}) {
  const receiver = window.parent !== window ? window.parent : window.opener;
  if (!receiver || !resultOrigin) return;
  receiver.postMessage({ type: `windy-cave:puzzle-${type}`, version: 1, requestId, ...versions, ...payload }, resultOrigin);
}

if (embedded) {
  $("levelSelectControl").hidden = true;
  $("quit").hidden = false;
  $("quit").addEventListener("click", () => cancelEmbeddedPuzzle());
  window.addEventListener("message", (event) => {
    const receiver = window.parent !== window ? window.parent : window.opener;
    if (event.source !== receiver || event.origin !== resultOrigin || event.data?.requestId !== requestId ||
        event.data?.version !== 1 || event.data?.type !== "windy-cave:puzzle-cancel") return;
    cancelEmbeddedPuzzle();
  });
}

let cancelled = false;
function cancelEmbeddedPuzzle() {
  if (cancelled) return;
  cancelled = true;
  if (playtestState?.status === "playing") {
    playtestState.status = "cancelled";
    reportPuzzleResult(playtestState, "cancelled");
    renderSimulationGrid(playtestState.cave, false);
    setPuzzlePlaytestState(null);
  } else if (playtestState) {
    reportPuzzleResult(playtestState, playtestState.status === "won" ? "won" : "lost");
    setPuzzlePlaytestState(null);
  } else {
    sendToHost("result", { outcome: "cancelled", success: false, movesUsed: 0, stars: 0, score: 0 });
  }
  $("quit").disabled = true;
  $("hint").hidden = true;
  $("playtestFrameStatus").textContent = "퍼즐을 종료했어요.";
}

function puzzleArtworkUrl(path, base) {
  if (typeof path !== "string" || !path.trim()) throw new Error("이미지 경로가 비어 있습니다.");
  const url = new URL(path, base);
  if (url.origin !== location.origin || !["https:", "http:"].includes(url.protocol)) {
    throw new Error("테마 파일과 이미지는 게임과 같은 사이트에 올려 주세요.");
  }
  const builtInSprites = new URL("./art/ddung/", location.href).pathname;
  if (url.pathname.startsWith(builtInSprites) && url.pathname.endsWith(".png")) {
    url.pathname = url.pathname.replace(/\.png$/, ".webp");
  }
  return url.href;
}

function usableImage(url) {
  if (!url) return Promise.resolve(null);
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve(url);
    image.onerror = () => resolve(null);
    image.src = url;
  });
}

async function puzzleArtworkImages(entries, imageUrl) {
  if (entries == null) return Object.create(null);
  if (typeof entries !== "object" || Array.isArray(entries)) throw new Error("이미지 설정은 객체여야 합니다.");
  const images = await Promise.all(Object.entries(entries).map(async ([id, path]) => (
    [id, await usableImage(imageUrl(path))]
  )));
  return Object.assign(Object.create(null), Object.fromEntries(images.filter(([, url]) => url)));
}

async function loadPuzzleArtwork(previewTheme) {
  const path = puzzleParams.get("theme");
  const expectedVersion = puzzleParams.get("themeVersion");
  if (!previewTheme && !path && !expectedVersion) return;

  try {
    let theme = previewTheme;
    let base = location.href;
    if (!theme) {
      const url = puzzleArtworkUrl(path, base);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      theme = await response.json();
      base = response.url || url;
    }
    if (!theme || typeof theme !== "object" || Array.isArray(theme)) throw new Error("테마 JSON 형식을 확인해 주세요.");
    const themeVersion = theme.version == null ? null : String(theme.version);
    const isPack = theme.format === THEME_PACK_FORMAT;
    if (isPack) theme = readThemePack(theme);
    const imageUrl = previewTheme || isPack
      ? (value) => normalizeObjectImage(value, 1500000)
      : (value) => puzzleArtworkUrl(value, base);
    if (expectedVersion && expectedVersion !== themeVersion) throw new Error("요청한 테마 버전과 다릅니다.");
    const burst = previewTheme || isPack ? null : theme.effects?.blockBurst;
    const [layers, specials, goals, background, particle] = await Promise.all([
      Promise.all(["block", "terrain", "gimmick", "item"].map(async (layer) => [layer, await puzzleArtworkImages(theme[layer], imageUrl)])),
      puzzleArtworkImages(theme.specials, imageUrl),
      puzzleArtworkImages(theme.goals, imageUrl),
      theme.background == null ? null : usableImage(imageUrl(theme.background)),
      burst?.particle ? usableImage(imageUrl(burst.particle)) : null,
    ]);
    if (burst) {
      const effects = {};
      if (particle) effects.particle = particle;
      if (burst.sound) effects.sound = puzzleArtworkUrl(burst.sound, base);
      if (Number.isFinite(burst.volume)) effects.volume = Math.max(0, Math.min(1, burst.volume));
      puzzleEffects.setTheme(effects);
    }
    setPuzzleArtwork({ layers: Object.fromEntries(layers), specials, goals });
    versions.themeVersion = themeVersion;
    if (background) {
      document.body.classList.add("has-puzzle-background");
      document.body.style.backgroundImage = `linear-gradient(rgb(12 15 30 / 50%), rgb(12 15 30 / 75%)), url(${JSON.stringify(background)})`;
    }
  } catch (error) {
    if (expectedVersion) throw error;
    console.warn("퍼즐 테마를 불러오지 못해 기본 이미지를 사용합니다.", error);
  }
}

function reportPuzzleResult(state, outcome) {
  if (!linkedPuzzle || !resultOrigin || reportedAttempts.has(state)) return;
  reportedAttempts.add(state);
  const success = outcome === "won";
  sendToHost("result", {
    outcome,
    levelId: linkedPuzzle.cave.id,
    level: linkedPuzzle.cave.number,
    success,
    movesUsed: state.movesUsed,
    stars: success ? clearStarCount(state) : 0,
    score: puzzleScore(state, success),
    ...(state.scoreTarget === null ? {} : { scoreTarget: state.scoreTarget }),
  });
}

async function loadPuzzleRules() {
  const path = puzzleParams.get("rules");
  if (!path) return;
  const response = await fetch(puzzleArtworkUrl(path, location.href));
  if (!response.ok) throw new Error(`규칙 JSON을 읽을 수 없습니다 (HTTP ${response.status}).`);
  const overrides = await response.json();
  const configured = { ...rules, ...overrides };
  const { threeStars, twoStars, pointsPerGoalUnit, pointsPerMoveLeft, scoreTarget = null, pointsPerBlock = 100 } = configured;
  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides) ||
      !Number.isFinite(twoStars) || !Number.isFinite(threeStars) ||
      twoStars < 0 || threeStars > 1 || twoStars > threeStars ||
      ![pointsPerGoalUnit, pointsPerMoveLeft, pointsPerBlock].every((points) => Number.isSafeInteger(points) && points >= 0 && points <= 1000000) ||
      (scoreTarget !== null && (!Number.isSafeInteger(scoreTarget) || scoreTarget <= 0 || !pointsPerBlock))) {
    throw new Error("별점 기준 또는 점수 설정을 확인해 주세요.");
  }
  rules = configured;
}

function readResultOrigin() {
  const value = puzzleParams.get("resultOrigin");
  if (!value) return null;
  const url = new URL(value);
  if (!["http:", "https:"].includes(url.protocol) || url.origin !== value) {
    throw new Error("결과를 받을 게임의 주소는 경로 없이 입력해 주세요.");
  }
  return url.origin;
}

async function loadLinkedPuzzle(mapPath, levelKey) {
  const url = new URL(mapPath || "./play-maps.json?v=2", location.href);
  const localPreview = embedded && puzzleParams.get("previewMap") === "1" &&
    url.protocol === "blob:" && url.origin === location.origin && resultOrigin === location.origin;
  if (!localPreview && (!["http:", "https:"].includes(url.protocol) || url.username || url.password)) {
    throw new Error("맵 JSON의 HTTP 또는 HTTPS 주소를 입력해 주세요.");
  }

  const [response] = await Promise.all([fetch(url, { credentials: "omit" }), localPreview ? null : loadPuzzleArtwork(), loadPuzzleRules()]);
  if (!response.ok) throw new Error(`맵 JSON을 읽을 수 없습니다 (HTTP ${response.status}).`);
  const data = await response.json();
  if (localPreview) await loadPuzzleArtwork(data?.editorTheme);
  if (cancelled) return;
  versions.mapVersion = data?.contentVersion == null && data?.version == null ? null : String(data.contentVersion ?? data.version);
  const expectedVersion = puzzleParams.get("mapVersion");
  if (expectedVersion && expectedVersion !== versions.mapVersion) throw new Error("요청한 맵 버전과 다릅니다.");
  let imported;
  if (Array.isArray(data?.mapinfos)) {
    const raw = data.mapinfos.find((entry) => !levelKey || String(entry.level) === levelKey || `ddung-level-${entry.level}` === levelKey);
    if (!raw) throw new Error("JSON에 지정된 레벨이 없습니다.");
    imported = adaptImportedJson({ ...data, mapinfos: [raw] });
  } else if (Array.isArray(data?.caves) && data.caves.length) {
    imported = adaptImportedJson(data);
  } else {
    throw new Error("맵툴의 전체 레벨 내보내기 JSON을 사용해 주세요.");
  }
  if (imported.unknownTokens.length) throw new Error("읽을 수 없는 타일이 있습니다.");
  const mapProject = imported.project;
  const cave = levelKey
    ? mapProject.caves.find(({ id }) => id === levelKey) || mapProject.caves.find(({ number }) => String(number) === levelKey)
    : mapProject.caves.find(({ id }) => id === mapProject.activeCaveId);
  if (!cave) throw new Error("JSON에 지정된 레벨이 없습니다.");

  mapProject.activeCaveId = cave.id;
  linkedPuzzle = { project: mapProject, cave, title: cave.name || `레벨 ${cave.number}` };
  $("levelSelectControl").hidden = true;
  beginPuzzle(mapProject, cave, linkedPuzzle.title);
  if (playtestState.status === "playing") sendToHost("ready", { levelId: cave.id, level: cave.number });
}

async function loadPuzzleMaps() {
  try {
    const mapPath = puzzleParams.get("map");
    const levelKey = puzzleParams.get("level");
    resultOrigin = readResultOrigin();
    if (embedded && (!requestId || !resultOrigin)) throw new Error("실행 ID와 호출 게임 주소가 필요합니다.");
    if (mapPath || levelKey || embedded) {
      await loadLinkedPuzzle(mapPath, levelKey);
      return;
    }
    const [response] = await Promise.all([fetch("./play-maps.json?v=2"), loadPuzzleArtwork(), loadPuzzleRules()]);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    puzzleMaps = await response.json();
    if (puzzleMaps.mapinfos?.[0]?.level !== 1) throw new Error("레벨 1 누락");
    loadPuzzleProgress();
    startPuzzle(puzzleProgress.current - 1);
  } catch (error) {
    if (cancelled) return;
    sendToHost("error", { code: "load-failed", message: error.message });
    console.error(error);
    $("playtestFrameStatus").textContent = embedded || puzzleParams.has("map") || puzzleParams.has("level")
      ? `퍼즐을 불러오지 못했어요. ${error.message}`
      : "퍼즐을 불러오지 못했어요. 페이지를 새로고침해 주세요.";
  }
}

document.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "mouse") puzzleEffects.unlockAudio();
}, { capture: true });
document.addEventListener("pointerup", puzzleEffects.unlockAudio, { capture: true });
document.addEventListener("keydown", puzzleEffects.unlockAudio, { capture: true });
$("soundToggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const enabled = button.getAttribute("aria-pressed") !== "true";
  button.setAttribute("aria-pressed", String(enabled));
  button.textContent = enabled ? "사운드 켜짐" : "사운드 꺼짐";
  puzzleEffects.setMuted(!enabled);
});

setPuzzleView(renderPuzzlePlayer, puzzleEffects.showBurst);
loadPuzzleMaps();
