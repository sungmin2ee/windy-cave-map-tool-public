const get = (id) => document.getElementById(id);
const player = new URL("./play.html", location.href);
const labels = { won: "클리어", lost: "실패", cancelled: "중간 종료" };
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
  get("start").disabled = history.state?.puzzleRun === session.id;
  if (get("start").disabled) history.back();
  else get("start").focus();
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
  if (active || get("start").disabled) return;
  const id = crypto.randomUUID();
  const url = new URL(player);
  for (const [key, value] of new FormData(event.currentTarget)) {
    if (value.trim()) url.searchParams.set(key, value.trim());
  }
  const presetRules = event.submitter?.dataset.rules;
  if (presetRules) url.searchParams.set("rules", presetRules);
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
});

get("back").addEventListener("click", cancel);
window.addEventListener("popstate", () => {
  if (active && history.state?.puzzleRun !== active.id) cancel();
  if (!active) {
    if (history.state?.puzzleRun) history.replaceState(null, "");
    get("start").disabled = false;
    get("start").focus();
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
