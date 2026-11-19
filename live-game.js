// Deterministic live clock shared by editor Playtest and the puzzle player.
// No DOM, timers, future-board replay or queued user actions.
export function createLiveGame(state, engine, { effects = () => {}, changed = () => {} } = {}) {
  const cave = state.cave;
  state.liveMode = true;
  state.liveTurns = [];
  state.liveNextPieceId = 0;
  cave.livePieceIds = cave.layers.block.map((block) => block ? ++state.liveNextPieceId : null);
  const motions = new Map();
  const locks = new Map();
  const speeds = new Map();
  let clock = 0;
  let dirty = false;
  let active = false;
  let physics = false;
  let globalUntil = 0;
  let waves = 0;
  let stopped = false;

  function normalize() {
    const seen = new Set();
    cave.layers.block.forEach((block, index) => {
      if (!block) cave.livePieceIds[index] = null;
      else if (!cave.livePieceIds[index] || seen.has(cave.livePieceIds[index])) cave.livePieceIds[index] = ++state.liveNextPieceId;
      if (block) seen.add(cave.livePieceIds[index]);
    });
    // An explosion can hit a moving piece. Its actor must disappear with its ID.
    for (const [id, motion] of motions) {
      if (cave.livePieceIds[motion.to] !== id) { motions.delete(id); speeds.delete(id); }
    }
  }

  function blockedCells() {
    const result = new Set(locks.keys());
    for (const motion of motions.values()) {
      result.add(motion.from); result.add(motion.to);
    }
    return result;
  }

  function fallBlockedCells() {
    // Final targets prevent two fall planners borrowing the same donor/path.
    // They are not CurrentItem/NextItem occupancy for touch or match checks.
    const result = blockedCells();
    for (const motion of motions.values()) {
      if (motion.target !== undefined) result.add(motion.target);
    }
    return result;
  }

  function acceptsInput() {
    // Goal damage is committed before its flight/collection visuals finish.
    // Stop new moves at that point, while allowing the live clock to finish.
    return !stopped && state.status === "playing" && state.movesLeft !== 0 &&
      clock >= globalUntil && !engine.clearConditionMet(state);
  }

  function canTap(index) {
    return acceptsInput() &&
      !locks.has(index) && !engine.isBarrier(cave, index) &&
      Boolean(cave.layers.block[index] && engine.specialEffect(cave, cave.playtestPieces[index]));
  }

  function canSwap(index, empty = false) {
    if (!acceptsInput() ||
        blockedCells().has(index) || engine.isSwapBlocked(cave, index)) return false;
    return empty || Boolean(cave.layers.block[index]);
  }

  function captureOperation(operation) {
    const frames = [];
    const capture = (label, cells, kind, delay = 320, moves = [], turnActor = null, burst = null, cleared = []) => {
      frames.push({ label, cells: [...cells], kind, delay, motions: moves, turnActor, burst, cleared,
        cave: { ...cave, layers: Object.fromEntries(Object.entries(cave.layers).map(([k, v]) => [k, [...v]])),
          playtestPieces: [...cave.playtestPieces] } });
    };
    state.liveBlockedCells = blockedCells();
    operation(capture);
    delete state.liveBlockedCells;
    normalize();
    if (frames.length) {
      // Durations belong to this committed operation only, never a future cascade.
      let delay = 0;
      for (const frame of frames) {
        frame.at = delay;
        if (frame.label === "매치 결과" || frame.label === "특수 피스 생성") frame.delay = 0;
        if (frame.label === "특수 피스 발동") frame.delay = 0;
        const until = clock + (delay + frame.delay) / 1000;
        for (const index of frame.cells) locks.set(index, Math.max(locks.get(index) ?? 0, until));
        if (frame.turnActor?.flights) {
          for (const { from, to } of frame.turnActor.flights) {
            locks.set(from, Math.max(locks.get(from) ?? 0, until));
            locks.set(to, Math.max(locks.get(to) ?? 0, until));
          }
        }
        if (frame.label === "보드 셔플") globalUntil = until;
        delay += frame.delay;
      }
      effects(frames);
      state.message = engine.clearConditionMet(state) ? "목표 달성 · 마무리 중입니다."
        : frames.find((frame) => frame.delay)?.label || frames[0].label;
    }
    dirty = true;
  }

  function submit(action) {
    if (!action || !acceptsInput()) return false;
    const { first, second } = action;
    if (second === undefined) {
      if (action.bombPanel) {
        if (blockedCells().has(first) || !engine.bombPanelReady(state, first)) return false;
      } else if (!canTap(first)) return false;
    } else {
      if (!engine.neighborsOf(cave, first).includes(second) || !canSwap(first) || !canSwap(second, true)) return false;
      action = { first, second, combo: engine.canCombineSpecials(cave, first, second) };
      if (!action.combo) {
        engine.swapPlaytestBlocks(cave, first, second);
        const matches = engine.findMatches(cave, undefined, blockedCells());
        engine.swapPlaytestBlocks(cave, first, second);
        action.invalid = !matches.has(first) && !matches.has(second);
      }
    }
    state.selectedIndex = null;
    state.hint = null;
    state.comboMode = false;
    active = true;
    waves = 0;
    const used = state.movesUsed;
    captureOperation((capture) => engine.playSimulationTurn(state, action, capture));
    if (action.invalid) state.message = "매치가 만들어지지 않아 교환을 되돌렸습니다.";
    physics ||= state.movesUsed !== used || Boolean(action.bombPanel);
    state.animating = true;
    changed();
    return true;
  }

  function startMotions(moves) {
    const payloads = moves.map((move) => ({ ...move, block: cave.layers.block[move.from],
      piece: cave.playtestPieces[move.from], id: cave.livePieceIds[move.from] }));
    for (const move of payloads) {
      cave.layers.block[move.from] = null;
      cave.playtestPieces[move.from] = null;
      cave.livePieceIds[move.from] = null;
    }
    for (const move of payloads) {
      cave.layers.block[move.to] = move.block;
      cave.playtestPieces[move.to] = move.piece;
      cave.livePieceIds[move.to] = move.id;
      motions.set(move.id, { ...move, progress: 0, speed: speeds.get(move.id) ?? 4 });
    }
    if (moves.length) dirty = true;
    if (moves.length) state.message = engine.clearConditionMet(state) ? "목표 달성 · 마무리 중입니다."
      : "블록 낙하 중 · 멈춘 블록은 계속 조작할 수 있어요.";
  }

  function advanceBoard() {
    const blocked = fallBlockedCells();
    const falls = engine.planLiveFalls(state, blocked);
    if (falls.length) startMotions(falls);
    const spawned = engine.refillLiveSources(state, fallBlockedCells());
    for (const move of spawned) {
      motions.set(move.id, { ...move, progress: 0, speed: 4,
        block: cave.layers.block[move.to], piece: cave.playtestPieces[move.to] });
    }
    if (spawned.length) dirty = true;
    const excluded = blockedCells();
    if (engine.findMatches(cave, undefined, excluded).size) {
      if (++waves > 300) { state.status = "stuck"; state.message = "연쇄 안전 제한에 도달했습니다."; return; }
      captureOperation((capture) => engine.resolveMatches(state, capture));
      return;
    }
    if (motions.size || locks.size || clock < globalUntil) return;
    if (engine.collectDdungTreasure(state)) { dirty = true; return; }
    // Turn-end obstacles/events run once per accepted move, only after the shared
    // board is stable. Results and move exhaustion are also reported only here.
    if (state.liveTurns.length) {
      captureOperation((capture) => engine.finishLiveTurns(state, capture));
      return;
    }
    captureOperation((capture) => engine.finishLiveState(state, capture));
    if (locks.size || state.liveTurns.length) return;
    active = false;
    physics = false;
    state.animating = false;
    state.message = state.status === "playing" ? "교환할 블록을 선택하세요." : state.message;
    dirty = true;
  }

  function step(dt) {
    clock += dt;
    for (const [index, until] of locks) if (until <= clock) { locks.delete(index); dirty = true; }
    for (const [id, motion] of motions) {
      motion.speed = Math.min(20, motion.speed + 30 * dt);
      const distance = motion.spawned || motion.warp ? 1 : Math.hypot(
        motion.from % cave.width - motion.to % cave.width,
        Math.floor(motion.from / cave.width) - Math.floor(motion.to / cave.width));
      motion.progress = Math.min(1, motion.progress + motion.speed * dt / distance);
      if (motion.progress >= 1) {
        speeds.set(id, motion.speed);
        motions.delete(id);
        dirty = true;
      }
    }
    if (!physics && !locks.size && !motions.size) { active = false; state.animating = false; dirty = true; }
    else if (state.status === "playing" && physics) advanceBoard();
    else if (!motions.size && !locks.size) { active = false; state.animating = false; dirty = true; }
    for (const id of speeds.keys()) if (!motions.has(id)) speeds.delete(id);
  }

  function tick(seconds) {
    let remaining = Math.max(0, Math.min(seconds, 0.25));
    while (!stopped && active && remaining > 0) {
      const dt = Math.min(remaining, 1 / 120);
      step(dt);
      remaining -= dt;
    }
    if (dirty) { dirty = false; changed(); }
  }

  return {
    submit, tick, canTap, canSwap, blockedCells, fallBlockedCells, motions,
    get active() { return active; },
    get clock() { return clock; },
    stop() { stopped = true; active = false; state.animating = false; motions.clear(); locks.clear(); },
  };
}
