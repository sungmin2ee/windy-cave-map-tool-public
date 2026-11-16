"use strict";

const PUZZLE_GOAL_IMAGES = {
  "ddung-oak": "./art/ddung/goal-oak.png",
  "ddung-dust-piece": "./art/ddung/goal-dust.png",
};

const PUZZLE_PROGRESS_KEY = "ddung-puzzle-progress-v1";

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
  if (!Number.isInteger(index) || index < 0 || index >= unlockedLevelCount()) {
    throw new Error("아직 열리지 않은 레벨입니다.");
  }
  const level = puzzleMaps.mapinfos[index];
  const imported = adaptImportedJson({ version: puzzleMaps.version, mapinfos: [level] });
  project = imported.project;
  const cave = activeCave();
  const validation = validateCave(cave);
  if (validation.errors.length || validation.unsupported.length || imported.unknownTokens.length) {
    throw new Error("이 레벨을 불러올 수 없습니다.");
  }

  const state = createPlayState(cave, crypto.randomUUID(), true);
  $("clearDialog").close();
  puzzleIndex = index;
  playtestState = state;
  playtestState.validation = validation;
  $("levelTitle").textContent = `레벨 ${level.level}`;
  puzzleProgress.current = level.level;
  savePuzzleProgress();
  renderLevelSelect();
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
    showObjectImage(icon, PUZZLE_GOAL_IMAGES[objective.targetId] || asset?.image);

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
  const hasNext = puzzleIndex + 1 < puzzleMaps.mapinfos.length;

  $("playtestFrameStatus").textContent = won
    ? (hasNext ? "클리어!" : "준비된 레벨을 모두 클리어했어요!")
    : state.status === "lost"
      ? "이동 횟수를 모두 사용했어요."
      : state.message;
  $("restart").hidden = false;
  $("hint").hidden = !playing;
  $("next").hidden = !won || !hasNext;
  renderSimulationGrid(state.cave, playing);

  const dialog = $("clearDialog");
  if (won && !dialog.open) {
    const level = puzzleMaps.mapinfos[puzzleIndex].level;
    const stars = clearStarCount(state);
    puzzleProgress.bestStars[level] = Math.max(stars, puzzleProgress.bestStars[level] || 0);
    savePuzzleProgress();
    renderLevelSelect();
    $("clearStars").textContent = "★".repeat(stars) + "☆".repeat(3 - stars);
    $("clearStars").setAttribute("aria-label", `별 ${stars}개`);
    $("clearMessage").textContent = hasNext
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

async function loadPuzzleMaps() {
  try {
    const response = await fetch("./play-maps.json?v=2");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    puzzleMaps = await response.json();
    if (puzzleMaps.mapinfos?.[0]?.level !== 1) throw new Error("레벨 1 누락");
    loadPuzzleProgress();
    startPuzzle(puzzleProgress.current - 1);
  } catch (error) {
    console.error(error);
    $("playtestFrameStatus").textContent = "퍼즐을 불러오지 못했어요. 페이지를 새로고침해 주세요.";
  }
}

loadPuzzleMaps();
