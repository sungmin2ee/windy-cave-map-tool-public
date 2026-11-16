const get = (id) => document.getElementById(id);
const player = new URL("./play.html", location.href);
const labels = { won: "클리어", lost: "실패", cancelled: "중간 종료" };
const preview = new URLSearchParams(location.search).get("preview");
const startButton = get(preview ? "previewStart" : "start");
let active = null;
let coins = 0;

function finish(result) {
  if (!active || result.requestId !== active.id) return;
  const session = active;
  active = null; // Consume the run before granting any reward.
  clearTimeout(session.timeout);
  clearTimeout(session.cancelTimeout);
  if (result.outcome === "won") coins += result.stars * 10;

  get("frameSlot").replaceChildren();
  get("session").hidden = true;
  get("lobby").hidden = false;
  get("coins").textContent = coins;
  get("status").textContent = labels[result.outcome] ?? result.message;
  get("result").textContent = JSON.stringify(result, null, 2);
  get("result").hidden = false;
  startButton.disabled = history.state?.puzzleRun === session.id;
  if (startButton.disabled) history.back();
  else startButton.focus();
}

function cancel() {
  if (!active || active.cancelTimeout) return;
  const { id, frame } = active;
  get("back").disabled = true;
  frame.contentWindow.postMessage({ type: "windy-cave:puzzle-cancel", version: 1, requestId: id }, player.origin);
  active.cancelTimeout = setTimeout(() => finish({ requestId: id, outcome: "cancelled" }), 1500);
}

get("launch").addEventListener("submit", (event) => {
  event.preventDefault();
  const params = new URLSearchParams();
  for (const [key, value] of new FormData(event.currentTarget)) {
    if (value.trim()) params.set(key, value.trim());
  }
  const presetRules = event.submitter?.dataset.rules;
  if (presetRules) params.set("rules", presetRules);
  launchPuzzle(params);
});

function launchPuzzle(params) {
  if (active || startButton.disabled) return;
  const id = crypto.randomUUID();
  const url = new URL(player);
  url.search = params.toString();
  url.searchParams.set("embed", "1");
  url.searchParams.set("requestId", id);
  url.searchParams.set("resultOrigin", location.origin);

  const frame = document.createElement("iframe");
  frame.title = "퍼즐 플레이";
  frame.allow = "autoplay";
  frame.src = url.href;
  history.pushState({ puzzleRun: id }, "");
  active = {
    id,
    frame,
    timeout: setTimeout(() => finish({
      requestId: id,
      outcome: "error",
      message: "퍼즐을 불러오는 시간이 너무 길어요. 다시 시도해 주세요.",
    }), 30000),
  };
  get("loading").textContent = "퍼즐을 불러오는 중이에요.";
  get("back").disabled = false;
  get("lobby").hidden = true;
  get("session").hidden = false;
  get("frameSlot").replaceChildren(frame);
  get("back").focus();
}

if (preview) {
  get("launch").hidden = true;
  get("previewControls").hidden = false;
  const editor = window.opener;
  const unavailable = "편집 중인 레벨을 받지 못했어요. 맵툴에서 버튼을 다시 눌러 주세요.";
  if (!editor) {
    get("status").textContent = unavailable;
  } else {
    get("status").textContent = "맵툴에서 레벨을 받는 중이에요.";
    const timeout = setTimeout(() => {
      window.removeEventListener("message", receiveLevel);
      get("status").textContent = unavailable;
    }, 10000);
    function receiveLevel(event) {
      const data = event.data;
      if (event.origin !== location.origin || event.source !== editor ||
          data?.type !== "windy-cave:preview-map" || data.preview !== preview) return;
      clearTimeout(timeout);
      window.removeEventListener("message", receiveLevel);
      window.opener = null;
      const { project } = data;
      const cave = project?.caves?.[0];
      if (!cave?.id || cave.id !== project.activeCaveId) {
        get("status").textContent = unavailable;
        return;
      }
      const map = URL.createObjectURL(new Blob([JSON.stringify(project)], { type: "application/json" }));
      const params = new URLSearchParams({ map, level: cave.id, previewMap: "1" });
      get("previewLevelName").textContent = cave.name;
      startButton.disabled = false;
      startButton.addEventListener("click", () => launchPuzzle(params));
      launchPuzzle(params);
    }
    window.addEventListener("message", receiveLevel);
    editor.postMessage({ type: "windy-cave:preview-ready", preview }, location.origin);
  }
}

get("back").addEventListener("click", cancel);
window.addEventListener("popstate", () => {
  if (active && history.state?.puzzleRun !== active.id) cancel();
  if (!active) {
    if (history.state?.puzzleRun) history.replaceState(null, "");
    if (!preview || get("previewLevelName").textContent) {
      startButton.disabled = false;
      startButton.focus();
    }
  }
});
if (history.state?.puzzleRun) history.replaceState(null, "");

window.addEventListener("message", (event) => {
  const data = event.data;
  if (!active || event.origin !== player.origin || event.source !== active.frame.contentWindow ||
      data?.version !== 1 || data.requestId !== active.id) return;
  if (data.type === "windy-cave:puzzle-ready") {
    clearTimeout(active.timeout);
    get("loading").textContent = `레벨 ${data.level}`;
  } else if (data.type === "windy-cave:puzzle-error") {
    finish({ ...data, outcome: "error" });
  } else if (data.type === "windy-cave:puzzle-result" && Object.hasOwn(labels, data.outcome) &&
      Number.isInteger(data.stars) && data.stars >= 0 && data.stars <= 3) {
    finish(data);
  }
});
