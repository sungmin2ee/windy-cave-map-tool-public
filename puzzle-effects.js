const DEFAULT_VOLUME = 0.35;

export function createPuzzleEffects() {
  let settings = { volume: DEFAULT_VOLUME };
  let context;
  let customSound;
  let muted = false;
  let resumeRequest;
  let popPending = false;

  function unlockAudio() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext || muted) return;
    if (!context) {
      context = new AudioContext();
      if (settings.sound) {
        fetch(settings.sound)
          .then((response) => {
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.arrayBuffer();
          })
          .then((bytes) => context.decodeAudioData(bytes))
          .then((buffer) => { customSound = buffer; })
          .catch(() => {});
      }
    }
    if (context.state === "running" || resumeRequest) return;
    resumeRequest = context.resume().then(() => {
      if (popPending) playBurstSound();
    }).catch(() => {}).finally(() => {
      popPending = false;
      resumeRequest = null;
    });
  }

  function playBurstSound() {
    if (muted || settings.volume === 0 || !context) return;
    if (context.state !== "running") {
      popPending = Boolean(resumeRequest);
      return;
    }
    popPending = false;
    const time = context.currentTime;
    const gain = context.createGain();
    gain.connect(context.destination);

    if (customSound) {
      const source = context.createBufferSource();
      source.buffer = customSound;
      gain.gain.value = settings.volume;
      source.connect(gain);
      source.onended = () => gain.disconnect();
      source.start();
      return;
    }

    const pop = context.createOscillator();
    pop.type = "triangle";
    pop.frequency.setValueAtTime(660, time);
    pop.frequency.exponentialRampToValueAtTime(190, time + 0.09);
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(settings.volume * 0.75, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    pop.connect(gain);
    pop.onended = () => gain.disconnect();
    pop.start(time);
    pop.stop(time + 0.13);
  }

  function showBurst(grid, cells) {
    playBurstSound();
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
    setTheme(theme) { settings = { ...settings, ...theme }; },
    setMuted(value) {
      muted = value;
      if (muted) {
        popPending = false;
      } else {
        unlockAudio();
        playBurstSound();
      }
    },
    unlockAudio,
    showBurst,
  };
}
