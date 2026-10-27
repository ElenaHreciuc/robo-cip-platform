/* Robo Mentor 3D: standalone demonstration with accessible text fallback. */
(() => {
  'use strict';
  if (document.querySelector('[data-robo-mentor]')) return;
  const assetBase = new URL('.', document.currentScript?.src || location.href).href;
  const ageValues = ['7-8', '8-9', '9-10'];
  const HELP = {
    default: {
      title: 'Cu ce te pot ajuta?',
      intro: 'Salut! Sunt Robo, mentorul tău. Îți pot explica pașii activității și îți pot oferi un indiciu.',
      hint: 'Citește cerința, rezolvă un pas și verifică rezultatul.'
    },
    'parser-propozitii.html': {
      title: 'Construim propoziții',
      intro: 'O propoziție exprimă un gând și are un sens complet.',
      hint: 'Alege cuvintele potrivite. La început folosește majusculă, iar la sfârșit un semn de punctuație.'
    },
    'eticheteaza-lumea.html': {
      title: 'Clasificăm obiecte',
      intro: 'Clasificăm atunci când grupăm obiecte după o regulă clară.',
      hint: 'Citește criteriul și caută proprietatea comună a fiecărui grup.'
    },
    'clinica-mesaje.html': {
      title: 'Reparăm mesajele',
      intro: 'Un mesaj bun este clar, corect și respectuos.',
      hint: 'Verifică sensul, diacriticele, majuscula și semnele de punctuație. Poți folosi tastatura virtuală.'
    }
  };
  const ageHint = {
    '7-8': 'Începem cu un singur pas și un exemplu simplu.',
    '8-9': 'Explică regula și verifică dacă ai aplicat-o consecvent.',
    '9-10': 'Gândește-te la o excepție și argumentează alegerea.'
  };
  function detectAge() {
    // Read the activity's current selection before the initial URL parameter.
    const selected = document.querySelector('[data-age][aria-pressed="true"]')?.dataset.age;
    const selector = document.querySelector('#age-track, #start-age')?.value;
    for (const value of [selected, selector]) if (ageValues.includes(value)) return value;
    const query = new URLSearchParams(location.search).get('age');
    if (ageValues.includes(query)) return query;
    try {
      const stored = localStorage.getItem('roboCip:ageTrack');
      if (ageValues.includes(stored)) return stored;
    } catch (_) {}
    return '7-8';
  }
  let file = location.pathname.split('/').pop() || '';
  try { file = decodeURIComponent(file); } catch (_) {}
  const content = HELP[file] || HELP.default;
  let opened = false;
  let speakingAttempt = 0;
  let startupTimer = null;
  const voiceOwner = 'robo-mentor';
  const host = document.createElement('aside');
  host.dataset.roboMentor = '';
  host.setAttribute('aria-label', 'Mentorul Robo');
  host.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:2147483000;font:15px system-ui,Arial,sans-serif;color:#173954;max-width:calc(100vw - 28px)';
  const shadow = host.attachShadow({ mode: 'open' });
  shadow.innerHTML = String.raw`<style>
    :host{--trigger-height:140px;--viewport-height:100vh}
    @supports(height:100dvh){:host{--viewport-height:100dvh}}
    *{box-sizing:border-box}
    .wrap{display:flex;align-items:flex-end;flex-direction:column;gap:8px}
    #roboTrigger{position:relative;flex:none;width:116px;height:var(--trigger-height);border:0;background:linear-gradient(160deg,#daf5ff,#e8efff);border-radius:25px;box-shadow:0 6px 22px #19578355;cursor:pointer;overflow:hidden;touch-action:manipulation}
    button:focus-visible{outline:3px solid #ff9d20;outline-offset:3px}
    #roboTrigger .fallback{font-size:65px;position:absolute;inset:20px 0 auto;text-align:center}
    model-viewer{height:120px;width:116px;position:relative;z-index:1;--poster-color:transparent;pointer-events:none}
    #label{position:absolute;bottom:3px;left:2px;right:2px;background:#fffdfcdd;border-radius:9px;color:#17587d;padding:3px;font-weight:750;font-size:12px;z-index:2}
    #panel{width:min(355px,calc(100vw - 28px));max-height:min(480px,calc(var(--viewport-height) - var(--trigger-height) - 36px));overflow:auto;overscroll-behavior:contain;background:#fff;border:2px solid #b7daf5;box-shadow:0 9px 35px #14436950;border-radius:19px;padding:16px}
    [hidden]{display:none!important}
    .panel-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:8px;position:sticky;top:-16px;background:#fff;z-index:2}
    h2{font-size:20px;margin:0 0 8px;color:#164f80}
    p{line-height:1.45;margin:7px 0}button{cursor:pointer;font:inherit}
    .actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
    .action{border:0;border-radius:11px;padding:9px 12px;min-height:44px;background:#176da9;color:white;font-weight:650}
    .secondary{background:#e6f2fb;color:#16527c}
    .note{background:#eef7ff;border-radius:10px;padding:10px;margin-top:8px}
    #close{flex:none;min-height:44px;min-width:44px;border:0;background:#edf4fa;border-radius:9px;color:#14496f}
    small[role=status]{display:block;line-height:1.45;margin-top:8px}
    @media(max-width:420px),(max-height:420px){
      :host{--trigger-height:98px}
      #roboTrigger{width:86px}model-viewer{height:82px;width:86px}
      #roboTrigger .fallback{font-size:48px;top:10px}#label{font-size:10px}
    }
  </style>
  <div class="wrap">
    <section id="panel" hidden role="dialog" aria-modal="false" aria-labelledby="title" aria-describedby="intro">
      <div class="panel-heading"><h2 id="title"></h2><button type="button" id="close" aria-label="Închide ajutorul">✕</button></div>
      <p id="intro"></p><p id="age"></p>
      <p class="note">🎙️ Profil vocal de test: Robo tânăr, jucăuș și energic. Vocea depinde de dispozitiv.</p>
      <div class="actions">
        <button type="button" class="action" id="hint">💡 Arată indiciul</button>
        <button type="button" class="action" id="sample">🎵 Testează vocea</button>
        <button type="button" class="action" id="speak">🔊 Ascultă explicația</button>
        <button type="button" class="action secondary" id="stop">Oprește vocea</button>
      </div>
      <p class="note" id="tip" hidden></p>
      <small id="audioState" role="status" aria-live="polite"></small>
      <small id="modelState" role="status" aria-live="polite"></small>
    </section>
    <button type="button" id="roboTrigger" aria-label="Deschide ajutorul mentorului Robo" aria-expanded="false" aria-haspopup="dialog" aria-controls="panel">
      <span class="fallback" aria-hidden="true">🤖</span><span id="modelAnchor"></span><span id="label">Robo · Ajutor</span>
    </button>
  </div>`;
  document.body.appendChild(host);
  const $ = id => shadow.getElementById(id);
  const ageText = () => ageHint[detectAge()];
  const updateAge = () => { $('age').textContent = ageText(); };
  $('title').textContent = content.title;
  $('intro').textContent = content.intro;
  updateAge();

  // The demo and voiced activities preload this; injected use can load it locally.
  const voiceReady = window.RoboVoice ? Promise.resolve(window.RoboVoice) : new Promise(resolve => {
    const script = document.createElement('script');
    script.src = new URL('robo-voice.js', assetBase).href;
    script.onload = () => resolve(window.RoboVoice || null);
    script.onerror = () => resolve(null);
    document.head.appendChild(script);
  });
  function clearStartupTimer() { clearTimeout(startupTimer); startupTimer = null; }
  function stopVoice() {
    speakingAttempt++;
    clearStartupTimer();
    window.RoboVoice?.stop(voiceOwner);
    $('audioState').textContent = '';
  }
  function close() {
    opened = false;
    $('panel').hidden = true;
    $('roboTrigger').setAttribute('aria-expanded', 'false');
    stopVoice();
    $('roboTrigger').focus({ preventScroll: true });
  }
  $('roboTrigger').addEventListener('click', () => {
    if (opened) { close(); return; }
    opened = true;
    $('panel').hidden = false;
    $('roboTrigger').setAttribute('aria-expanded', 'true');
    updateAge();
    $('close').focus({ preventScroll: true });
  });
  $('close').addEventListener('click', close);
  $('hint').addEventListener('click', () => {
    $('tip').textContent = content.hint;
    $('tip').hidden = false;
  });
  $('stop').addEventListener('click', stopVoice);
  shadow.addEventListener('keydown', event => {
    if (event.key === 'Escape' && opened) {
      event.preventDefault();
      event.stopPropagation();
      close();
    }
  });
  document.addEventListener('click', event => {
    if (event.target.closest?.('[data-age]')) updateAge();
  });
  document.addEventListener('change', updateAge);
  window.addEventListener('storage', event => {
    if (event.key === 'roboCip:ageTrack') updateAge();
  });
  window.addEventListener('pagehide', stopVoice);

  function availableVoices() {
    try { return window.speechSynthesis.getVoices() || []; } catch (_) { return []; }
  }
  function waitForVoices() {
    const current = availableVoices();
    if (current.length) return Promise.resolve(current);
    return new Promise(resolve => {
      let timer;
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        window.speechSynthesis.removeEventListener?.('voiceschanged', changed);
        resolve(availableVoices());
      };
      const changed = () => { if (availableVoices().length) finish(); };
      window.speechSynthesis.addEventListener?.('voiceschanged', changed);
      timer = setTimeout(finish, 1800);
      changed();
    });
  }
  async function playRoboVoice(spokenText) {
    const attempt = ++speakingAttempt;
    clearStartupTimer();
    const controller = await voiceReady;
    if (attempt !== speakingAttempt) return;
    if (!controller?.supported()) {
      $('audioState').textContent = 'Acest browser nu permite redarea vocală. Explicația rămâne în scris.';
      return;
    }
    controller.stop(voiceOwner);
    $('audioState').textContent = 'Robo pregătește vocea…';
    const voices = await waitForVoices();
    if (attempt !== speakingAttempt) return;
    const voice = voices.find(v => String(v.lang).toLowerCase() === 'ro-ro') ||
      voices.find(v => String(v.lang).toLowerCase().startsWith('ro'));
    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = 'ro-RO';
    utterance.rate = 1.08;
    utterance.pitch = 1.35;
    utterance.volume = 1;
    if (voice) utterance.voice = voice;
    let began = false;
    const current = () => attempt === speakingAttempt;
    utterance.onstart = () => {
      if (!current()) return;
      began = true;
      clearStartupTimer();
      $('audioState').textContent = voice ? 'Robo vorbește cu voce românească.' :
        'Nu există voce românească; încerc vocea implicită. Pronunția poate fi incorectă.';
    };
    utterance.onend = () => {
      if (!current()) return;
      clearStartupTimer();
      $('audioState').textContent = 'Redarea audio s-a încheiat.';
    };
    utterance.onerror = event => {
      if (!current()) return;
      clearStartupTimer();
      $('audioState').textContent = 'Nu se poate reda vocea (' + (event.error || 'eroare necunoscută') + '). Explicația rămâne în scris.';
    };
    if (!voice) $('audioState').textContent = 'Nu am detectat o voce românească. Încerc vocea implicită; explicația rămâne în scris.';
    try {
      const started = controller.speak(voiceOwner, utterance, () => {
        if (!current()) return;
        speakingAttempt++;
        clearStartupTimer();
        $('audioState').textContent = '';
      });
      if (!started) {
        $('audioState').textContent = 'O altă explicație audio este în curs. Încearcă din nou după încheierea ei.';
        return;
      }
    } catch (_) {
      $('audioState').textContent = 'Browserul a blocat redarea audio. Explicația rămâne în scris.';
      return;
    }
    startupTimer = setTimeout(() => {
      if (current() && !began && controller.isOwner(voiceOwner) && !window.speechSynthesis.speaking) {
        controller.stop(voiceOwner);
        $('audioState').textContent = 'Sunetul nu a pornit. Verifică volumul și vocile instalate; explicația rămâne în scris.';
      }
    }, 3500);
  }
  $('sample').addEventListener('click', () => playRoboVoice('Salut! Eu sunt Robo, prietenul tău digital! Astăzi descoperim ceva extraordinar. Ești pregătit? Hai să începem!'));
  $('speak').addEventListener('click', () => playRoboVoice([content.intro, ageText(), $('tip').hidden ? '' : content.hint].filter(Boolean).join(' ')));

  function modelFallback(message, model) {
    if (model) model.hidden = true;
    shadow.querySelector('.fallback').hidden = false;
    $('modelState').textContent = message + ' Ajutorul text rămâne disponibil.';
  }
  function mountModel() {
    const model = document.createElement('model-viewer');
    model.inert = true;
    model.setAttribute('aria-hidden', 'true');
    model.setAttribute('src', new URL('Robo.glb', assetBase).href);
    model.setAttribute('alt', '');
    model.setAttribute('camera-orbit', '0deg 75deg auto');
    model.setAttribute('interaction-prompt', 'none');
    model.setAttribute('shadow-intensity', '0');
    model.setAttribute('disable-zoom', '');
    // Keep this decorative model still and out of the keyboard sequence.
    let failed = false;
    model.addEventListener('load', () => {
      if (failed) return;
      shadow.querySelector('.fallback').hidden = true;
      $('modelState').textContent = '';
    });
    model.addEventListener('error', event => {
      failed = true;
      modelFallback(event.detail?.type === 'webglcontextlost' ?
        'Afișarea 3D s-a întrerupt.' : 'Modelul 3D nu s-a putut încărca.', model);
    });
    $('modelAnchor').appendChild(model);
  }
  function load3D() {
    try {
      if (!('customElements' in window)) throw new Error('custom-elements-unavailable');
      const context = document.createElement('canvas').getContext('webgl2');
      if (!context) throw new Error('webgl2-unavailable');
      context.getExtension('WEBGL_lose_context')?.loseContext();
    } catch (_) {
      modelFallback('Afișarea 3D nu este disponibilă pe acest dispozitiv.');
      return;
    }
    if (customElements.get('model-viewer')) { mountModel(); return; }
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js';
    script.integrity = 'sha384-T4vc5AP9W2o3EVVQC6Is5mbKqFE2eysxg1XHwaZLquK0SjtY+4cLHoN3j1mK/MmB';
    script.crossOrigin = 'anonymous';
    script.referrerPolicy = 'no-referrer';
    script.onload = () => {
      if (customElements.get('model-viewer')) mountModel();
      else modelFallback('Componenta 3D nu este disponibilă.');
    };
    script.onerror = () => modelFallback('Biblioteca 3D nu s-a putut încărca.');
    document.head.appendChild(script);
  }
  load3D();
})();
