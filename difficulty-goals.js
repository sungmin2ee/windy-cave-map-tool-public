// Required mission objects are placed before optional difficulty decorations.
export function populateDifficultyGoals(cave, source, engine, {
  random, preferredSlots = (slots) => slots, place, difficulty = null, keepPlacement = true,
} = {}) {
  for (let i = 0; i < cave.layers.gimmick.length; i++) {
    if (engine.isEventOnlyGimmick(cave.layers.gimmick[i])) cave.layers.gimmick[i] = null;
  }
  // New candidate boards receive collection pieces through refill sources.
  for (const layer of ['item', 'block']) cave.layers[layer].forEach((id, index) => {
    if (engine.isDdungTreasure(id)) cave.layers[layer][index] = null;
  });
  const goals = cave.scoreTarget == null ? cave.objectives : [];
  const isPlacedGoal = (goal) => goal.layer !== 'block' || goal.targetId === 'ddung-dust-piece';
  const adaptive = Number.isFinite(difficulty);
  const autoGoals = goals.filter((goal) => isPlacedGoal(goal) && goal.countMode === 'auto-map');
  if (adaptive && !keepPlacement) {
    // Rebuild automatic quantities instead of retaining a previous harder board.
    for (const goal of autoGoals) {
      if (goal.targetId === 'ddung-jelly') cave.generatedJellyLayout = true;
      for (const [layer, cells] of Object.entries(cave.layers)) {
        if (layer !== goal.layer && !(goal.layer === 'item' && layer === 'block')) continue;
        cells.forEach((id, index) => {
          if (engine.matchesObjectiveAsset(goal, id)) {
            cells[index] = layer === 'terrain' ? 'floor' : null;
            if (layer === 'block' && cave.initialPieceTypes) cave.initialPieceTypes[index] = null;
          }
        });
      }
    }
  }
  const effort = (goal) => {
    const id = goal.targetId;
    const footprint = ['ddung-mayor-large', 'ddung-feng-large-row', 'ddung-feng-large-column'].includes(id) ? 4 : 1;
    const durability = goal.layer === 'terrain' ? cave.terrainRules?.[id]?.durability :
      goal.layer === 'gimmick' ? cave.gimmickRules?.[id]?.durability ||
        engine.ddungGimmickDurability({ layers: { gimmick: [id] } }, 0) : 1;
    return { footprint, cost: engine.isDdungTreasure(id) ? Math.max(2, cave.height / 2) : footprint * Math.sqrt(Math.max(1, durability || 1)) };
  };
  const activeArea = cave.layers.terrain.filter((id, index) =>
    !engine.isExcluded(cave, index) && id !== 'wall' && id !== 'pit').length;
  const moveScale = cave.moveLimitEnabled === false ? 1 :
    Math.max(0.5, Math.min(1.6, Math.sqrt((cave.moveLimit || 20) / 20)));
  const manualWork = goals.filter((goal) => isPlacedGoal(goal) && goal.countMode !== 'auto-map')
    .reduce((total, goal) => total + goal.count * effort(goal).cost, 0);
  const workload = adaptive ? Math.max(autoGoals.length,
    activeArea * (0.12 + 0.60 * Math.max(1, Math.min(100, difficulty)) / 100) * moveScale *
      (0.85 + random() * 0.3) - manualWork) : 0;
  const requirements = [];
  // Reserve explicitly entered quantities before sharing free cells among auto goals.
  const ordered = [...goals.filter((goal) => goal.countMode !== 'auto-map'), ...goals.filter((goal) => goal.countMode === 'auto-map')];
  for (const goal of ordered) {
    if (!isPlacedGoal(goal)) continue;
    if (engine.isEventOnlyGimmick(goal.targetId)) return { ok: false, error: '쥐·거미는 레벨 이벤트로 설정하세요. 배치형 클리어 목표로 생성할 수 없습니다.' };
    const available = Array.from({ length: cave.width * cave.height }, (_, i) => i).filter((i) => {
      if (engine.isExcluded(cave, i) || engine.isBarrier(cave, i)) return false;
      if (goal.layer === 'terrain') return !cave.layers.terrain[i] || cave.layers.terrain[i] === 'floor';
      return !cave.layers[goal.layer][i] && !cave.layers.item[i] &&
        (goal.layer !== 'item' || !cave.layers.gimmick[i] || cave.layers.gimmick[i] === engine.SPAWNER_ID);
    });
    const automatic = goal.countMode === 'auto-map';
    const existing = engine.countObjectiveAssets(cave, goal);
    const { footprint, cost } = effort(goal);
    let target = automatic ? (adaptive
      ? Math.max(1, Math.round(workload / autoGoals.length / cost))
      : Math.max(1, engine.resolvedObjectiveCount(source, goal))) : goal.count;
    if (engine.isDdungTreasure(goal.targetId)) {
      goal.count = target;
      requirements.push({ goal, target, spawned: true });
      continue;
    }
    if (automatic && adaptive) target = Math.max(1, existing,
      Math.min(target, existing + Math.floor(available.length / footprint)));
    const preferred = preferredSlots(available);
    const first = new Set(preferred);
    const pools = [preferred.slice(), available.filter((i) => !first.has(i))];
    for (const pool of pools) {
      while (pool.length && engine.countObjectiveAssets(cave, goal) < target) {
        const [index] = pool.splice(Math.floor(random() * pool.length), 1);
        place(cave, goal.layer, index, goal.targetId);
      }
    }
    const actual = engine.countObjectiveAssets(cave, goal);
    if (automatic && adaptive && actual > 0) {
      target = actual;
      goal.count = actual;
    }
    if (actual < target || (automatic && actual === 0)) {
      return { ok: false, error: `${goal.targetId} 목표 ${target}개를 배치할 공간이 부족합니다. 보드 크기나 목표 수량을 조정하세요.` };
    }
    requirements.push({ goal, target });
  }
  engine.prepareCollectionLayout(cave);
  return { ok: true, requirements };
}
