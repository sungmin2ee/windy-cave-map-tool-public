// Presentation only: hit timing and shuffle permutations come from the shared engine.
export function animateBoosterEffect(grid, frame, duration, { makePiece, syncVisibility, holdBlocks = false }) {
  const actor = frame.turnActor;
  if (actor?.type !== 'booster') return;
  const cells = [...grid.querySelectorAll(':scope > .map-cell:not(.live-piece-actor)')];
  const run = (element, keyframes, options = {}) => {
    const animation = element.animate(keyframes, { duration, fill: 'both', easing: 'ease-in-out', ...options });
    const cleanup = () => { element.remove(); syncVisibility(); };
    animation.finished.then(cleanup, cleanup);
  };
  const pieceAt = (index) => {
    const cell = cells[index];
    if (!cell || !frame.cave.layers.block[index]) return null;
    const piece = makePiece(index);
    piece.classList.add('live-swap-actor', 'booster-piece-actor');
    piece.dataset.swapCell = index;
    Object.assign(piece.style, { left: `${cell.offsetLeft}px`, top: `${cell.offsetTop}px`,
      width: `${cell.offsetWidth}px`, height: `${cell.offsetHeight}px` });
    grid.append(piece);
    return piece;
  };
  const effect = (name, styles, text = '') => {
    const element = document.createElement('span');
    element.className = `booster-effect ${name}`;
    element.setAttribute('aria-hidden', 'true');
    element.textContent = text;
    Object.assign(element.style, styles);
    grid.append(element);
    return element;
  };
  const button = grid.parentElement.querySelector(`[data-booster="${actor.booster}"]`);
  button?.animate([{ transform: 'scale(1)' }, { transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 280 });

  if (actor.booster === 'shuffle') {
    const width = frame.cave.width;
    const first = cells[0], last = cells[width * frame.cave.height - 1];
    if (!first || !last) return;
    const centerX = (first.offsetLeft + last.offsetLeft + last.offsetWidth) / 2;
    const centerY = (first.offsetTop + last.offsetTop + last.offsetHeight) / 2;
    for (const { from, to } of frame.motions) {
      const source = cells[from], target = cells[to];
      if (!source || !target) continue;
      const piece = pieceAt(to);
      if (!piece) continue;
      piece.dataset.boosterMotion = 'shuffle';
      piece.dataset.fromCell = from;
      piece.dataset.toCell = to;
      const dx = source.offsetLeft - target.offsetLeft, dy = source.offsetTop - target.offsetTop;
      const cx = centerX - target.offsetLeft - target.offsetWidth / 2 + (from % 3 - 1) * target.offsetWidth * .15;
      const cy = centerY - target.offsetTop - target.offsetHeight / 2 + (from % 5 - 2) * target.offsetHeight * .08;
      run(piece, [
        { transform: `translate(${dx}px, ${dy}px) scale(1)`, opacity: 1 },
        { transform: `translate(${cx}px, ${cy}px) scale(.62) rotate(${from % 2 ? 12 : -12}deg)`, opacity: 1, offset: .44 },
        { transform: 'translate(0, 0) scale(1.08)', opacity: 1, offset: .9 },
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      ], { easing: 'cubic-bezier(.4,0,.2,1)' });
    }
  } else {
    // Keep the pre-hit pieces visible during the tool's approach. Logical damage
    // is already committed, so these actors never participate in board rules.
    if (holdBlocks) for (const index of actor.holdCells) {
      const piece = pieceAt(index);
      if (piece) run(piece, [{ opacity: 1 }, { opacity: 1 }]);
    }
    const target = cells[actor.index];
    if (!target) return;
    const size = target.offsetWidth;
    if (actor.booster === 'hammer') {
      const hammer = effect('booster-hammer', { left: `${target.offsetLeft + size * .2}px`,
        top: `${target.offsetTop - size * .65}px`, fontSize: `${size * 1.25}px` }, '🔨');
      run(hammer, [
        { transform: 'translate(35%, -45%) rotate(-65deg)', opacity: 0 },
        { transform: 'translate(25%, -35%) rotate(-65deg)', opacity: 1, offset: .2 },
        { transform: 'translate(-12%, 35%) rotate(15deg)', opacity: 1, offset: .82 },
        { transform: 'translate(-12%, 35%) rotate(15deg)', opacity: 0 },
      ]);
      const ring = effect('booster-impact-ring', { left: `${target.offsetLeft}px`, top: `${target.offsetTop}px`,
        width: `${size}px`, height: `${target.offsetHeight}px` });
      run(ring, [{ transform: 'scale(.25)', opacity: 0 }, { transform: 'scale(.5)', opacity: 1, offset: .2 },
        { transform: 'scale(1.65)', opacity: 0 }], { delay: duration * .8, duration: 260 });
    } else {
      const first = cells[actor.cells[0]], last = cells[actor.cells.at(-1)];
      if (!first || !last) return;
      const row = actor.booster === 'row';
      const length = row ? last.offsetLeft + last.offsetWidth - first.offsetLeft : last.offsetTop + last.offsetHeight - first.offsetTop;
      const beam = effect(`booster-beam booster-beam-${actor.booster}`, row
        ? { left: `${first.offsetLeft}px`, top: `${target.offsetTop + target.offsetHeight / 2 - 4}px`, width: `${length}px`, height: '8px' }
        : { left: `${target.offsetLeft + size / 2 - 4}px`, top: `${first.offsetTop}px`, width: '8px', height: `${length}px` });
      run(beam, [{ transform: row ? 'scaleX(0)' : 'scaleY(0)', opacity: 0 },
        { transform: row ? 'scaleX(.05)' : 'scaleY(.05)', opacity: 1, offset: .12 },
        { transform: 'scale(1)', opacity: 1, offset: .84 }, { transform: 'scale(1)', opacity: 0 }]);
      const spark = effect('booster-line-spark', { left: `${first.offsetLeft + first.offsetWidth / 2 - 9}px`,
        top: `${first.offsetTop + first.offsetHeight / 2 - 9}px` });
      run(spark, [{ transform: 'translate(0, 0) scale(.5)', opacity: 0 },
        { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: .12 },
        { transform: `translate(${row ? length - size : 0}px, ${row ? 0 : length - first.offsetHeight}px) scale(1)`, opacity: 1, offset: .86 },
        { transform: `translate(${row ? length - size : 0}px, ${row ? 0 : length - first.offsetHeight}px) scale(1.5)`, opacity: 0 }]);
    }
  }
  syncVisibility();
}
