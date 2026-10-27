const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const source = fs.readFileSync(path.join(__dirname, '..', 'robo-voice.js'), 'utf8');

function fixture() {
  const calls = [];
  const speechSynthesis = {
    speaking: false,
    pending: false,
    speak(utterance) { calls.push(['speak', utterance]); },
    cancel() { calls.push(['cancel']); }
  };
  const window = { speechSynthesis, SpeechSynthesisUtterance: class {} };
  vm.runInNewContext(source, { window });
  return { voice: window.RoboVoice, window, calls };
}

test('voice controls tolerate browsers without speech synthesis', () => {
  const window = {};
  vm.runInNewContext(source, { window });
  assert.equal(window.RoboVoice.supported(), false);
  assert.equal(window.RoboVoice.speak('mentor', {}), false);
  assert.equal(window.RoboVoice.stop('mentor'), false);
});

test('closing an idle mentor preserves another activity voice', () => {
  const { voice, calls } = fixture();
  voice.speak('lesson', {});
  assert.equal(voice.stop('mentor'), false);
  assert.equal(voice.isOwner('lesson'), true);
  assert.deepEqual(calls.map(c => c[0]), ['speak']);
});

test('a new owned request interrupts once and ignores late callbacks from the old voice', () => {
  const { voice, calls } = fixture();
  let interrupted = 0, oldEvents = 0;
  const old = { onstart() { oldEvents++; }, onend() { oldEvents++; }, onerror() { oldEvents++; } };
  voice.speak('mentor', old, () => interrupted++);
  voice.speak('lesson', {});
  old.onstart({});
  old.onend({});
  old.onerror({});
  assert.equal(interrupted, 1);
  assert.equal(oldEvents, 0);
  assert.equal(voice.isOwner('lesson'), true);
  assert.deepEqual(calls.map(c => c[0]), ['speak', 'cancel', 'speak']);
});

test('stop clears ownership before synchronous browser cancellation events', () => {
  const { voice, window } = fixture();
  let ends = 0, interruptions = 0;
  const utterance = { onend() { ends++; } };
  voice.speak('mentor', utterance, () => interruptions++);
  window.speechSynthesis.cancel = () => utterance.onend({});
  assert.equal(voice.stop('mentor'), true);
  assert.equal(voice.isOwner('mentor'), false);
  assert.equal(ends, 0);
  assert.equal(interruptions, 1);
});

test('normal completion releases the owner and preserves the original callback', () => {
  const { voice, calls } = fixture();
  let ended = 0;
  const utterance = { onend() { ended++; } };
  voice.speak('mentor', utterance);
  utterance.onend({});
  assert.equal(ended, 1);
  assert.equal(voice.isOwner('mentor'), false);
  assert.equal(voice.stop('mentor'), false);
  assert.equal(calls.filter(c => c[0] === 'cancel').length, 0);
});

test('speech errors release ownership and are reported once', () => {
  const { voice } = fixture();
  let errors = 0;
  const utterance = { onerror() { errors++; } };
  voice.speak('mentor', utterance);
  utterance.onerror({ error: 'not-allowed' });
  utterance.onerror({ error: 'not-allowed' });
  assert.equal(errors, 1);
  assert.equal(voice.isOwner('mentor'), false);
});

test('audio outside the shared controller is left playing', () => {
  const { voice, window, calls } = fixture();
  window.speechSynthesis.speaking = true;
  assert.equal(voice.speak('mentor', {}), false);
  assert.equal(voice.stop('mentor'), false);
  window.speechSynthesis.speaking = false;
  window.speechSynthesis.pending = true;
  assert.equal(voice.speak('mentor', {}), false);
  assert.equal(calls.length, 0);
});

test('a blocked speak call releases ownership for a later retry', () => {
  const { voice, window } = fixture();
  window.speechSynthesis.speak = () => { throw new Error('blocked'); };
  assert.throws(() => voice.speak('mentor', {}), /blocked/);
  assert.equal(voice.isOwner('mentor'), false);
  window.speechSynthesis.speak = () => {};
  assert.equal(voice.speak('mentor', {}), true);
});

