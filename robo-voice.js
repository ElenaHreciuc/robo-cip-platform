/* Shared speech ownership for ROBO-CIP pages. */
(() => {
  'use strict';
  if (window.RoboVoice) return;
  let active = null;
  const supported = () => 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  function stop(owner) {
    if (!active || active.owner !== owner) return false;
    const previous = active;
    active = null;
    // Clear ownership before cancel(), which may dispatch events synchronously.
    try { window.speechSynthesis.cancel(); }
    finally { previous.onInterrupt?.(); }
    return true;
  }

  function speak(owner, utterance, onInterrupt) {
    if (!supported()) return false;
    if (!active && (window.speechSynthesis.speaking || window.speechSynthesis.pending)) return false;
    if (active) stop(active.owner);
    const record = { owner, utterance, onInterrupt };
    const started = utterance.onstart;
    const ended = utterance.onend;
    const failed = utterance.onerror;
    utterance.onstart = event => {
      if (active === record) started?.call(utterance, event);
    };
    utterance.onend = event => {
      if (active !== record) return;
      active = null;
      ended?.call(utterance, event);
    };
    utterance.onerror = event => {
      if (active !== record) return;
      active = null;
      failed?.call(utterance, event);
    };
    active = record;
    try { window.speechSynthesis.speak(utterance); }
    catch (error) { if (active === record) active = null; throw error; }
    return true;
  }

  window.RoboVoice = Object.freeze({
    supported,
    speak,
    stop,
    isOwner: owner => active?.owner === owner
  });
})();

