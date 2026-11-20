// Decoded sounds are cached by URL; playback never fetches a file again.
export function createPuzzleAudio({ AudioContext = globalThis.AudioContext || globalThis.webkitAudioContext, fetchSound = globalThis.fetch } = {}) {
  let context, resumeRequest, muted = false;
  let settings = { volume: .45, boosterSounds: {}, specialSounds: {} };
  const loads = new Map(), buffers = new Map(), pending = new Set(), voices = new Set();
  const ensureContext = () => context ??= AudioContext ? new AudioContext() : null;
  async function load(source) {
    if (!source || !ensureContext()) return;
    if (!loads.has(source)) loads.set(source, (async () => {
      try {
        const response = await fetchSound(source);
        if (!response.ok) throw new Error('audio unavailable');
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        buffers.set(source, buffer);
      } catch { /* use the synthesized default */ }
    })());
    return loads.get(source);
  }
  function unlockAudio() {
    if (muted || !ensureContext() || context.state === 'running' || resumeRequest) return;
    resumeRequest = context.resume().then(() => {
      const queue = [...pending]; pending.clear();
      queue.forEach(playSound);
    }).catch(() => pending.clear()).finally(() => { resumeRequest = null; });
  }
  function playSound(kind = 'burst') {
    if (muted || settings.volume === 0 || !ensureContext()) return false;
    unlockAudio();
    if (context.state !== 'running') { pending.add(kind); return false; }
    const time = context.currentTime;
    const gain = context.createGain();
    gain.connect(context.destination);
    const url = kind === 'burst' ? settings.sound : kind.startsWith('special:')
      ? settings.specialSounds[kind.slice(8)] : settings.boosterSounds[kind];
    const buffer = buffers.get(url);
    const source = buffer ? context.createBufferSource() : context.createOscillator();
    if (voices.size >= 12) { try { voices.values().next().value.stop(); } catch {} }
    voices.add(source);
    source.connect(gain);
    source.onended = () => { voices.delete(source); gain.disconnect(); };
    if (buffer) {
      source.buffer = buffer;
      gain.gain.value = settings.volume;
      source.start();
    } else {
      const tones = { hammer: [180, 48, .25, 'triangle'], row: [280, 1250, .32, 'sawtooth'],
        column: [1050, 160, .32, 'sawtooth'], shuffle: [330, 880, .55, 'sine'], burst: [880, 300, .23, 'triangle'],
        'special:row': [220, 1800, .38, 'triangle'], 'special:column': [1800, 220, .38, 'triangle'],
        'special:area': [125, 35, .45, 'triangle'], 'special:fish': [480, 1400, .3, 'sine'],
        'special:color': [400, 2000, .65, 'sine'] };
      const [start, end, duration, shape] = tones[kind] || tones.burst;
      source.type = shape;
      source.frequency.setValueAtTime(start, time);
      source.frequency.exponentialRampToValueAtTime(end, time + duration);
      gain.gain.setValueAtTime(.001, time);
      gain.gain.linearRampToValueAtTime(settings.volume * .65, time + .012);
      gain.gain.exponentialRampToValueAtTime(.001, time + duration);
      source.start(time); source.stop(time + duration + .02);
    }
    return true;
  }
  return {
    unlockAudio, playSound,
    async prepareSound(source) { await load(source); return buffers.has(source); },
    setTheme(theme = {}) {
      settings = { ...settings, ...theme, boosterSounds: theme.boosterSounds ?? settings.boosterSounds,
        specialSounds: theme.specialSounds ?? settings.specialSounds };
      settings.volume = Math.max(0, Math.min(1, Number.isFinite(settings.volume) ? settings.volume : .45));
      return Promise.all([settings.sound, ...Object.values(settings.boosterSounds), ...Object.values(settings.specialSounds)].filter(Boolean).map(load));
    },
    setMuted(value) {
      muted = value;
      if (muted) { pending.clear(); for (const voice of voices) { try { voice.stop(); } catch {} } }
      else unlockAudio();
    },
  };
}

export function normalizeThemeSound(value) {
  if (typeof value !== 'string' || value.length > 5600000) return null;
  return /^data:audio\/(?:wav|x-wav|wave|mpeg|mp3|ogg|mp4|aac|webm);base64,[A-Za-z0-9+/]+={0,2}$/.test(value) ? value : null;
}

export function specialSoundTypes(events = []) {
  return [...new Set(events.flatMap(({ effect }) => effect === 'cross' ? ['row','column'] : [effect === 'target' ? 'fish' : effect])
    .filter(type => ['row','column','area','fish','color'].includes(type)))];
}
