import test from 'node:test';
import assert from 'node:assert/strict';
import { createPuzzleAudio, normalizeThemeSound } from '../puzzle-audio.js';

function fixture() {
  const starts = [], requests = [], decoded = [];
  const param = () => ({ setValueAtTime(){}, linearRampToValueAtTime(){}, exponentialRampToValueAtTime(){} });
  class Context {
    state = 'running'; currentTime = 0; destination = {};
    resume() { this.state = 'running'; return Promise.resolve(); }
    async decodeAudioData(bytes) { const buffer = { length: bytes.byteLength }; decoded.push(buffer); return buffer; }
    createGain() { return { gain: param(), connect(){}, disconnect(){} }; }
    source(kind) { return { kind, frequency: param(), connect(){}, start(){ starts.push(this); }, stop(){ this.stopped=true; this.onended?.(); } }; }
    createBufferSource() { return this.source('custom'); }
    createOscillator() { return this.source('default'); }
  }
  const audio = createPuzzleAudio({ AudioContext: Context, fetchSound: async (url) => {
    requests.push(url); return { ok: url !== 'missing', arrayBuffer: async () => new ArrayBuffer(8) };
  } });
  return { audio, starts, requests, decoded };
}

test('item sounds decode once and replay from the same buffer', async () => {
  const { audio, starts, requests, decoded } = fixture();
  await audio.setTheme({ boosterSounds: { hammer: 'hammer.wav' } });
  audio.playSound('hammer'); audio.playSound('hammer');
  assert.deepEqual(requests, ['hammer.wav']);
  assert.equal(decoded.length, 1);
  assert.equal(starts[0].buffer, starts[1].buffer);
  assert.equal(starts[0].kind, 'custom');
});

test('changing or resetting an item sound takes effect without retaining the old sound', async () => {
  const { audio, starts, requests } = fixture();
  await audio.setTheme({ boosterSounds: { hammer: 'first.wav' } }); audio.playSound('hammer');
  await audio.setTheme({ boosterSounds: { hammer: 'second.wav' } }); audio.playSound('hammer');
  assert.notEqual(starts[0].buffer, starts[1].buffer);
  await audio.setTheme({ boosterSounds: {} }); audio.playSound('hammer');
  assert.equal(starts[2].kind, 'default');
  assert.deepEqual(requests, ['first.wav','second.wav']);
});

test('failed audio uses a default; mute stops current playback and prevents new voices', async () => {
  const { audio, starts, requests } = fixture();
  await audio.setTheme({ boosterSounds: { row: 'missing' } });
  audio.playSound('row');
  assert.equal(starts[0].kind, 'default');
  audio.setMuted(true); assert.equal(starts[0].stopped, true);
  assert.equal(audio.playSound('row'), false); assert.equal(starts.length, 1);
  audio.setMuted(false); audio.playSound('row');
  assert.equal(starts.length, 2); assert.deepEqual(requests, ['missing']);
});

test('theme sound data accepts supported embedded audio and rejects active or oversized content', () => {
  assert.equal(normalizeThemeSound('data:audio/wav;base64,UklGRg=='), 'data:audio/wav;base64,UklGRg==');
  assert.equal(normalizeThemeSound('javascript:alert(1)'), null);
  assert.equal(normalizeThemeSound('data:text/html;base64,UklGRg=='), null);
  assert.equal(normalizeThemeSound('data:audio/wav;base64,'+'A'.repeat(5600000)), null);
});
