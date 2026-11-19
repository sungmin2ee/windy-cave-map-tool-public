export const MAX_AUTO_PLAY_RUNS = 1000;

export function validAutoPlayRuns(value) {
  const runs = Number(value);
  return Number.isInteger(runs) && runs >= 1 && runs <= MAX_AUTO_PLAY_RUNS;
}

export function summarizeBatch(results) {
  const runs = results.length;
  const wins = results.filter((result) => result.status === "won");
  const moves = wins.map((result) => result.moves).sort((a, b) => a - b);
  const average = moves.length ? moves.reduce((sum, value) => sum + value, 0) / moves.length : 0;
  const percentile = (ratio) => moves.length ? moves[Math.min(moves.length - 1, Math.floor((moves.length - 1) * ratio))] : 0;
  const clearRate = runs ? Math.round(wins.length / runs * 1000) / 10 : 0;
  const label = clearRate >= 80 ? "Easy" : clearRate >= 55 ? "Normal" : clearRate >= 30 ? "Hard" : clearRate > 0 ? "Expert" : "미클리어";
  return {
    runs,
    representative: results[0] ?? null,
    examples: ["lost", "stuck"].map((status) => results.find((result) => result.status === status)).filter(Boolean),
    wins: wins.length,
    lost: results.filter((result) => result.status === "lost").length,
    stuck: results.filter((result) => result.status === "stuck").length,
    limited: results.filter((result) => result.status === "limit").length,
    unsupported: results.filter((result) => result.status === "unsupported").length,
    shuffles: results.reduce((total, result) => total + (result.shuffles || 0), 0),
    clearRate,
    average: Number(average.toFixed(1)),
    median: percentile(0.5), p90: percentile(0.9), label,
  };
}

// Yield between games so progress, cancellation, and dialog close stay responsive.
export async function runAutoPlayBatch(cave, runs, runGame, {
  isCanceled = () => false, onProgress = () => {},
  yieldToUI = () => new Promise((resolve) => setTimeout(resolve, 0)),
} = {}) {
  if (!validAutoPlayRuns(runs)) throw new RangeError("자동 플레이 횟수는 1~1000 사이의 정수로 입력하세요.");
  const results = [];
  for (let index = 0; index < runs; index++) {
    await yieldToUI();
    if (isCanceled()) return null;
    results.push(runGame(cave, index));
    onProgress(results.length, runs);
  }
  return isCanceled() ? null : summarizeBatch(results);
}
