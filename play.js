"use strict";

let puzzleMaps;
let puzzleIndex = 0;

function startPuzzle(index) {
  const level = puzzleMaps.mapinfos[index];
  const imported = adaptImportedJson({ version: puzzleMaps.version, mapinfos: [level] });
  project = imported.project;
  const cave = activeCave();
  const validation = validateCave(cave);
  if (validation.errors.length || validation.unsupported.length || imported.unknownTokens.length) {
    throw new Error("이 레벨을 불러올 수 없습니다.");
  }

  puzzleIndex = index;
  playtestState = createPlayState(cave, crypto.randomUUID(), true);
  playtestState.validation = validation;
  $("levelTitle").textContent = `레벨 ${level.level}`;
  renderPlaytest();
}

function renderPuzzlePlayer() {
  const state = playtestState;
  $("movesLeft").textContent = state.movesLeft;
  $("goals").innerHTML = objectiveProgressHtml(state);

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
}

function tryStartPuzzle(index) {
  try {
    startPuzzle(index);
  } catch (error) {
    $("playtestFrameStatus").textContent = error.message;
  }
}

$("restart").addEventListener("click", () => tryStartPuzzle(puzzleIndex));
$("hint").addEventListener("click", showPlaytestHint);
$("next").addEventListener("click", () => tryStartPuzzle(puzzleIndex + 1));

async function loadPuzzleMaps() {
  try {
    const response = await fetch("./play-maps.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    puzzleMaps = await response.json();
    if (puzzleMaps.mapinfos?.[0]?.level !== 1) throw new Error("레벨 1 누락");
    startPuzzle(0);
  } catch (error) {
    console.error(error);
    $("playtestFrameStatus").textContent = "퍼즐을 불러오지 못했어요. 페이지를 새로고침해 주세요.";
  }
}

loadPuzzleMaps();
