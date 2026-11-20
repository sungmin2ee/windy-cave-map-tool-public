// Effect metadata comes from the same expansion that decides the actual hits.
export function animateSpecialEffects(grid, cave, events = [], duration = 360) {
  const cells = [...grid.querySelectorAll(':scope > .map-cell:not(.live-piece-actor)')];
  const add = (effect, style, keys) => {
    const node = document.createElement('span');
    node.className = `special-effect special-effect-${effect}`;
    node.setAttribute('aria-hidden', 'true');
    Object.assign(node.style, style);
    grid.append(node);
    const animation = node.animate(keys, { duration: Math.max(180, duration), easing: 'ease-out', fill: 'both' });
    animation.finished.then(() => node.remove(), () => node.remove());
  };
  const pulse = [{ transform: 'scale(.15)', opacity: 1 }, { transform: 'scale(1.5)', opacity: 0 }];
  for (const event of events.slice(0, 40)) {
    const cell = cells[event.index];
    if (!cell) continue;
    const x = cell.offsetLeft + cell.offsetWidth / 2, y = cell.offsetTop + cell.offsetHeight / 2;
    const row = Math.floor(event.index / cave.width), col = event.index % cave.width;
    if (['row', 'column', 'cross'].includes(event.effect)) {
      for (const axis of event.effect === 'cross' ? ['row','column'] : [event.effect]) {
        const horizontal = axis === 'row';
        const first = cells[horizontal ? row * cave.width : col];
        const last = cells[horizontal ? (row + 1) * cave.width - 1 : (cave.height - 1) * cave.width + col];
        if (!first || !last) continue;
        add(axis, horizontal ? { left: `${first.offsetLeft}px`, top: `${y - 5}px`, width: `${last.offsetLeft + last.offsetWidth - first.offsetLeft}px`, height: '10px' }
          : { left: `${x - 5}px`, top: `${first.offsetTop}px`, height: `${last.offsetTop + last.offsetHeight - first.offsetTop}px`, width: '10px' },
        [{ opacity: 0, transform: horizontal ? 'scaleX(.05)' : 'scaleY(.05)' }, { opacity: 1, transform: 'scale(1)', offset: .25 }, { opacity: 0, transform: 'scale(1.15)' }]);
      }
    } else if (event.effect === 'area') {
      const size = cell.offsetWidth * (2 * event.radius + 1);
      add('area', { left: `${x-size/2}px`, top: `${y-size/2}px`, width: `${size}px`, height: `${size}px` }, pulse);
    } else if (event.effect === 'fish' || event.effect === 'target') {
      add('fish', { left: `${cell.offsetLeft}px`, top: `${cell.offsetTop}px`, width: `${cell.offsetWidth}px`, height: `${cell.offsetHeight}px` }, pulse);
    } else if (event.effect === 'color') {
      add('color', { left: `${cell.offsetLeft}px`, top: `${cell.offsetTop}px`, width: `${cell.offsetWidth}px`, height: `${cell.offsetHeight}px` }, pulse);
      for (const index of event.targets.slice(0, 32)) {
        const target = cells[index];
        if (!target || index === event.index) continue;
        const dx = target.offsetLeft + target.offsetWidth / 2 - x, dy = target.offsetTop + target.offsetHeight / 2 - y;
        add('color-ray', { left: `${x}px`, top: `${y}px`, width: `${Math.hypot(dx,dy)}px`, height: '3px', transformOrigin: 'left center', rotate: `${Math.atan2(dy,dx)}rad` },
          [{ transform: 'scaleX(0)', opacity: 0 }, { transform: 'scaleX(1)', opacity: 1, offset: .35 }, { transform: 'scaleX(1)', opacity: 0 }]);
      }
    }
  }
}
