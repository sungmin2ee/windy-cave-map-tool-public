import { createPuzzleEffects } from "./puzzle-effects.js?v=3";
import {
  $, adaptImportedJson, createPlayState, getAsset, playtestState, puzzleArtwork,
  renderPlaytest, renderSimulationGrid, setPuzzleArtwork, setPuzzlePlaytestState, setPuzzleProject,
  setPuzzleView, showObjectImage, showPlaytestHint, validateCave,
} from "./app.js?v=153";

const PUZZLE_GOAL_IMAGES = {
  "ddung-oak": "./art/ddung/goal-oak.png",
  "ddung-dust-piece": "./art/ddung/goal-dust.png",
};

const PUZZLE_PROGRESS_KEY = "ddung-puzzle-progress-v1";

const puzzleParams = new URLSearchParams(location.search);
const puzzleEffects = createPuzzleEffects();
const reportedAttempts = new WeakSet();
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
  const remaining = state.movesLeft / state.cave.moveLimit;
  return remaining >= 0.25 ? 3 : remaining >= 0.10 ? 2 : 1;
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
  const validation = validateCave(cave);
  if (validation.errors.length || validation.unsupported.length) {
    throw new Error("이 레벨을 플레이할 수 없습니다. 맵툴의 검증 결과를 확인해 주세요.");
  }

  const state = createPlayState(cave, crypto.randomUUID(), true);
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
    const artwork = puzzleArtwork?.goals[objective.targetId] || puzzleArtwork?.layers[objective.layer]?.[objective.targetId];
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
  $("movesLeft").textContent = state.movesLeft;
  renderPuzzleGoals(state);

  const playing = state.status === "playing";
  const won = state.status === "won";
  const hasNext = !linkedPuzzle && puzzleIndex + 1 < puzzleMaps.mapinfos.length;

  $("playtestFrameStatus").textContent = won
    ? (hasNext ? "클리어!" : "준비된 레벨을 모두 클리어했어요!")
    : state.status === "lost"
      ? "이동 횟수를 모두 사용했어요."
      : state.message;
  $("restart").hidden = false;
  $("hint").hidden = !playing;
  $("next").hidden = !won || !hasNext;
  renderSimulationGrid(state.cave, playing);
  if (!playing) reportPuzzleResult(state, won);

  const dialog = $("clearDialog");
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
    $("clearMessage").textContent = linkedPuzzle || hasNext
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

function puzzleArtworkUrl(path, base) {
  if (typeof path !== "string" || !path.trim()) throw new Error("이미지 경로가 비어 있습니다.");
  const url = new URL(path, base);
  if (url.origin !== location.origin || !["https:", "http:"].includes(url.protocol)) {
    throw new Error("테마 파일과 이미지는 게임과 같은 사이트에 올려 주세요.");
  }
  return url.href;
}

function puzzleArtworkImages(entries, base) {
  if (entries == null) return Object.create(null);
  if (typeof entries !== "object" || Array.isArray(entries)) throw new Error("이미지 설정은 객체여야 합니다.");
  return Object.assign(Object.create(null), Object.fromEntries(
    Object.entries(entries).map(([id, path]) => [id, puzzleArtworkUrl(path, base)]),
  ));
}

async function loadPuzzleArtwork() {
  const path = puzzleParams.get("theme");
  if (!path) return;

  try {
    const url = puzzleArtworkUrl(path, location.href);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const theme = await response.json();
    if (!theme || typeof theme !== "object" || Array.isArray(theme)) throw new Error("테마 JSON 형식을 확인해 주세요.");
    const base = response.url || url;
    const layers = Object.fromEntries(["block", "terrain", "gimmick", "item"].map(
      (layer) => [layer, puzzleArtworkImages(theme[layer], base)],
    ));
    const background = theme.background == null ? null : puzzleArtworkUrl(theme.background, base);
    setPuzzleArtwork({
      layers,
      specials: puzzleArtworkImages(theme.specials, base),
      goals: puzzleArtworkImages(theme.goals, base),
    });
    const burst = theme.effects?.blockBurst;
    if (burst) {
      const effects = {};
      if (burst.particle) effects.particle = puzzleArtworkUrl(burst.particle, base);
      if (burst.sound) effects.sound = puzzleArtworkUrl(burst.sound, base);
      if (Number.isFinite(burst.volume)) effects.volume = Math.max(0, Math.min(1, burst.volume));
      puzzleEffects.setTheme(effects);
    }
    if (background) {
      document.body.classList.add("has-puzzle-background");
      document.body.style.backgroundImage = `linear-gradient(rgb(12 15 30 / 50%), rgb(12 15 30 / 75%)), url(${JSON.stringify(background)})`;
    }
  } catch (error) {
    console.warn("퍼즐 테마를 불러오지 못해 기본 이미지를 사용합니다.", error);
  }
}

function reportPuzzleResult(state, success) {
  if (!linkedPuzzle || !resultOrigin || reportedAttempts.has(state)) return;
  const receiver = window.parent !== window ? window.parent : window.opener;
  if (!receiver) return;

  reportedAttempts.add(state);
  receiver.postMessage({
    type: "windy-cave:puzzle-result",
    version: 1,
    requestId: puzzleParams.get("requestId"),
    levelId: linkedPuzzle.cave.id,
    level: linkedPuzzle.cave.number,
    success,
    movesUsed: state.cave.moveLimit - state.movesLeft,
    stars: success ? clearStarCount(state) : 0,
  }, resultOrigin);
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
  resultOrigin = readResultOrigin();
  const url = new URL(mapPath || "./play-maps.json?v=2", location.href);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("맵 JSON의 HTTP 또는 HTTPS 주소를 입력해 주세요.");
  }

  const [response] = await Promise.all([fetch(url, { credentials: "omit" }), loadPuzzleArtwork()]);
  if (!response.ok) throw new Error(`맵 JSON을 읽을 수 없습니다 (HTTP ${response.status}).`);
  const data = await response.json();
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
}

async function loadPuzzleMaps() {
  try {
    const mapPath = puzzleParams.get("map");
    const levelKey = puzzleParams.get("level");
    if (mapPath || levelKey) {
      await loadLinkedPuzzle(mapPath, levelKey);
      return;
    }
    const [response] = await Promise.all([fetch("./play-maps.json?v=2"), loadPuzzleArtwork()]);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    puzzleMaps = await response.json();
    if (puzzleMaps.mapinfos?.[0]?.level !== 1) throw new Error("레벨 1 누락");
    loadPuzzleProgress();
    startPuzzle(puzzleProgress.current - 1);
  } catch (error) {
    console.error(error);
    $("playtestFrameStatus").textContent = puzzleParams.has("map") || puzzleParams.has("level")
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
