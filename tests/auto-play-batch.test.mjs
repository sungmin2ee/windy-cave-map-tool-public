import test from 'node:test';
import assert from 'node:assert/strict';
import { runAutoPlayBatch, summarizeBatch, validAutoPlayRuns } from '../auto-play-batch.js';

test('requested integer counts are accepted, including counts outside the old presets', async () => {
  for (const count of [1, 2, 7, 30, 1000]) assert.equal(validAutoPlayRuns(count), true);
  for (const count of ['', 0, -1, 1.5, 1001, NaN, Infinity]) {
    assert.equal(validAutoPlayRuns(count), false);
    await assert.rejects(runAutoPlayBatch({}, count, () => {}), RangeError);
  }
});

test('runs the requested games and retains an unbiased first game for replay', async () => {
  const cave = { name: 'map' };
  const seen = [], progress = [];
  const batch = await runAutoPlayBatch(cave, 7, (board, runIndex) => {
    assert.equal(board, cave);
    seen.push(runIndex);
    return { runIndex, status: runIndex % 2 ? 'won' : 'lost', moves: runIndex + 1, shuffles: 1 };
  }, { yieldToUI: async () => {}, onProgress: (done, total) => progress.push([done, total]) });
  assert.deepEqual(seen, [0, 1, 2, 3, 4, 5, 6]);
  assert.equal(batch.runs, 7);
  assert.equal(batch.wins, 3);
  assert.equal(batch.clearRate, 42.9);
  assert.equal(batch.representative.status, 'lost');
  assert.equal(batch.representative.runIndex, 0);
  assert.equal(batch.average, 4);
  assert.equal(batch.shuffles, 7);
  assert.deepEqual(progress.at(-1), [7, 7]);
  assert.equal(summarizeBatch([{ status: 'won', runIndex: 0, moves: 1 }]).representative.status, 'won');
});

test('cancellation discards partial statistics and stops further games', async () => {
  let played = 0, canceled = false;
  const result = await runAutoPlayBatch({}, 100, (_, runIndex) => {
    played++;
    return { runIndex, status: 'won', moves: 1 };
  }, { yieldToUI: async () => {}, isCanceled: () => canceled,
    onProgress: (done) => { if (done === 3) canceled = true; } });
  assert.equal(result, null);
  assert.equal(played, 3);
});

test('limits and unsupported goals never inflate the success probability', () => {
  const batch = summarizeBatch(['won', 'lost', 'stuck', 'limit', 'unsupported'].map((status, runIndex) => ({ status, runIndex, moves: 2 })));
  assert.equal(batch.clearRate, 20);
  assert.equal(batch.lost, 1);
  assert.equal(batch.stuck, 1);
  assert.equal(batch.limited, 1);
  assert.equal(batch.unsupported, 1);
  assert.equal(summarizeBatch(Array.from({ length: 1000 }, (_, i) => ({ status: i === 0 ? 'won' : 'lost', moves: 1 }))).clearRate, 0.1);
});
