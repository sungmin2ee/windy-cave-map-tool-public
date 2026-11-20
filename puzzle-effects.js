import { createPuzzleAudio } from './puzzle-audio.js?v=1';
export function createPuzzleEffects() {
  let settings = { volume: .45 };
  const audio = createPuzzleAudio();
  function showBurst(grid, cells) {
    audio.playSound('burst');
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const board = grid.getBoundingClientRect();
    for (const { index, color } of cells.slice(0, 24)) {
      const cell = grid.children[index];
      if (!cell) continue;
      const box = cell.getBoundingClientRect();
      const radius = box.width * 0.48;
      for (let i = 0; i < 6; i += 1) {
        const particle = document.createElement(settings.particle ? "img" : "span");
        particle.className = "puzzle-burst-particle";
        particle.setAttribute("aria-hidden", "true");
        particle.style.left = `${box.left - board.left + box.width / 2}px`;
        particle.style.top = `${box.top - board.top + box.height / 2}px`;
        if (settings.particle) {
          particle.alt = "";
          particle.draggable = false;
          particle.src = settings.particle;
        } else {
          particle.style.backgroundColor = color;
        }
        grid.appendChild(particle);

        const angle = i * Math.PI / 3 + Math.random() * 0.4;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const motion = particle.animate([
          { transform: "translate(-50%, -50%) scale(0.8)", opacity: 1 },
          { transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(0.35)`, opacity: 0 },
        ], { duration: 270, easing: "ease-out" });
        motion.finished.then(() => particle.remove(), () => particle.remove());
      }
    }
  }

  return {
    setTheme(theme) { settings = { ...settings, ...theme }; return audio.setTheme(theme); },
    setMuted: audio.setMuted, unlockAudio: audio.unlockAudio,
    playBooster: audio.playSound, showBurst,
  };
}