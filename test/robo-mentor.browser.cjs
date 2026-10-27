const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { chromium } = require('playwright');

const root = path.join(__dirname, '..');
const cdn = 'https://ajax.googleapis.com/ajax/libs/model-viewer/4.1.0/model-viewer.min.js';
let browser, server, origin;
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
function mockSpeech() {
  const speech = new EventTarget();
  speech.calls = [];
  speech.speaking = false;
  speech.pending = false;
  speech.voices = [{ lang: 'ro-RO', name: 'Test RO' }];
  speech.getVoices = () => speech.voices;
  speech.cancel = () => { speech.calls.push({ kind: 'cancel' }); speech.speaking = false; };
  speech.speak = utterance => {
    speech.calls.push({ kind: 'speak', text: utterance.text });
    window.lastUtterance = utterance;
    if (!window.delaySpeech) {
      speech.speaking = true;
      setTimeout(() => utterance.onstart?.({}), 0);
    }
  };
  Object.defineProperty(window, 'speechSynthesis', { value: speech, configurable: true });
  window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
}
before(async () => {
  const args = ['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
  browser = await chromium.launch({ headless: true, args, ...(process.env.ROBO_TEST_BROWSER ? { executablePath: process.env.ROBO_TEST_BROWSER } : {}) });
  // Reserve a test-only port, without inheriting database or mail credentials.
  const net = require('node:net');
  const listener = net.createServer();
  await new Promise(resolve => listener.listen(0, '127.0.0.1', resolve));
  const port = listener.address().port;
  await new Promise(resolve => listener.close(resolve));
  origin = 'http://127.0.0.1:' + port;
  server = spawn(process.execPath, ['app.js'], {
    cwd: root, env: { PATH: process.env.PATH, PORT: String(port), NODE_ENV: 'test' }, stdio: ['ignore', 'pipe', 'pipe']
  });
  let logs = '';
  server.stderr.on('data', data => { logs += data; });
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(origin + '/robo-mentor-demo.html')).ok) return; } catch (_) {}
    if (server.exitCode !== null) throw new Error('Test server failed: ' + logs);
    await pause(100);
  }
  throw new Error('Test server did not become ready: ' + logs);
});
after(async () => { if (browser) await browser.close(); server?.kill(); });

async function open({ size = { width: 1280, height: 800 }, init = [], mode = '', url = '/robo-mentor-demo.html', inject = false } = {}) {
  const context = await browser.newContext({ viewport: size });
  await context.addInitScript(mockSpeech);
  for (const script of init) await context.addInitScript(script);
  await context.route(cdn, route => {
    if (mode === 'cdn-blocked') return route.abort('failed');
    if (mode === 'cdn-tampered') return route.fulfill({ body: 'window.untrustedModuleExecuted=true;', contentType: 'text/javascript', headers: { 'access-control-allow-origin': '*' } });
    if (process.env.ROBO_TEST_MODEL_VIEWER) return route.fulfill({
      path: process.env.ROBO_TEST_MODEL_VIEWER,
      contentType: 'text/javascript',
      headers: { 'access-control-allow-origin': '*' }
    });
    return route.continue();
  });
  if (mode === 'model-404') await context.route('**/Robo.glb', route => route.fulfill({ status: 404, body: 'missing' }));
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin + url);
  if (inject) await page.addScriptTag({ url: origin + '/robo-mentor.js' });
  if (url === '/robo-mentor-demo.html' || inject) await page.locator('#roboTrigger').waitFor();
  return { page, context, errors };
}
async function loaded(page) {
  await page.waitForFunction(() => document.querySelector('[data-robo-mentor]').shadowRoot.querySelector('model-viewer')?.loaded, {}, { timeout: 20000 });
}
async function state(page) {
  return page.evaluate(() => {
    const shadow = document.querySelector('[data-robo-mentor]').shadowRoot;
    const model = shadow.querySelector('model-viewer');
    return {
      fallback: !shadow.querySelector('.fallback').hidden,
      modelHidden: model?.hidden,
      modelState: shadow.getElementById('modelState').textContent,
      audioState: shadow.getElementById('audioState').textContent,
      age: shadow.getElementById('age').textContent,
      expanded: shadow.getElementById('roboTrigger').getAttribute('aria-expanded'),
      focus: shadow.activeElement?.id
    };
  });
}
async function run(options, check) {
  const fixture = await open(options);
  try { await check(fixture); } finally { await fixture.context.close(); }
}

test('demo CSP allows the pinned CDN module and same-origin model', () => run({}, async ({ page, errors }) => {
  await loaded(page);
  assert.deepEqual(errors, []);
  assert.equal((await state(page)).fallback, false);
  const headers = await (await fetch(origin + '/robo-mentor-demo.html')).headers;
  const csp = headers.get('content-security-policy');
  assert.ok(csp.includes(cdn));
  assert.ok(!csp.split(';').find(directive => directive.trim().startsWith('script-src')).includes("'unsafe-inline'"));
  assert.ok(csp.includes("'wasm-unsafe-eval'"));
  assert.ok(!csp.includes("'unsafe-eval'"));
  assert.equal((await fetch(origin + '/resources/robo-mentor-demo.html')).headers.get('content-security-policy'), csp);
  assert.equal(headers.get('x-content-type-options'), 'nosniff');
  assert.equal(headers.get('referrer-policy'), 'no-referrer');
  assert.deepEqual(await page.evaluate(url => {
    const script = [...document.scripts].find(element => element.src === url);
    return { integrity: script.integrity.startsWith('sha384-'), crossOrigin: script.crossOrigin, referrerPolicy: script.referrerPolicy };
  }, cdn), { integrity: true, crossOrigin: 'anonymous', referrerPolicy: 'no-referrer' });
}));

for (const size of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 568, height: 320 }, { width: 320, height: 568 }]) {
  test('panel and close button fit ' + size.width + 'x' + size.height, () => run({ size }, async ({ page }) => {
    await page.locator('#roboTrigger').click();
    const rects = await page.evaluate(() => {
      const shadow = document.querySelector('[data-robo-mentor]').shadowRoot;
      return ['panel', 'close', 'roboTrigger'].map(id => {
        const r = shadow.getElementById(id).getBoundingClientRect();
        return { id, top: r.top, bottom: r.bottom, left: r.left, right: r.right };
      });
    });
    for (const r of rects) {
      assert.ok(r.top >= 0 && r.bottom <= size.height, r.id + ' vertical: ' + JSON.stringify(r));
      assert.ok(r.left >= 0 && r.right <= size.width, r.id + ' horizontal: ' + JSON.stringify(r));
    }
    await page.locator('#panel').evaluate(element => { element.scrollTop = element.scrollHeight; });
    assert.ok((await page.locator('#close').boundingBox()).y >= 0);
  }));
}

test('Escape and the close button return keyboard focus to Robo', () => run({}, async ({ page }) => {
  for (const action of ['escape', 'close']) {
    await page.locator('#roboTrigger').click();
    await page.locator('#hint').focus();
    if (action === 'escape') await page.keyboard.press('Escape');
    else await page.locator('#close').click();
    assert.equal((await state(page)).focus, 'roboTrigger');
    assert.equal((await state(page)).expanded, 'false');
  }
}));

test('decorative 3D is static and adds no keyboard stop', () => run({}, async ({ page }) => {
  await loaded(page);
  assert.deepEqual(await page.locator('model-viewer').evaluate(model => ({
    inert: model.inert, hidden: model.getAttribute('aria-hidden'), rotating: model.hasAttribute('auto-rotate')
  })), { inert: true, hidden: 'true', rotating: false });
  await page.locator('#roboTrigger').focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => {
    let e = document.activeElement;
    while (e?.shadowRoot?.activeElement) e = e.shadowRoot.activeElement;
    return e?.classList.contains('userInput');
  }), false);
}));

for (const mode of ['cdn-blocked', 'cdn-tampered', 'model-404']) {
  test(mode + ' preserves textual help and reports 3D fallback', () => run({ mode }, async ({ page, errors }) => {
    await page.locator('#roboTrigger').click();
    await page.waitForFunction(() => document.querySelector('[data-robo-mentor]').shadowRoot.getElementById('modelState').textContent.includes('Ajutorul text'));
    assert.equal((await state(page)).fallback, true);
    await page.locator('#hint').click();
    assert.ok((await page.locator('#tip').innerText()).length > 10);
    assert.equal(await page.evaluate(() => !!window.untrustedModuleExecuted), false);
    assert.deepEqual(errors, []);
  }));
}
test('WebGL context loss restores the icon and ignores a late load event', () => run({}, async ({ page }) => {
  await loaded(page);
  await page.locator('model-viewer').evaluate(model => {
    model.dispatchEvent(new CustomEvent('error', { detail: { type: 'webglcontextlost' } }));
    model.dispatchEvent(new Event('load'));
  });
  const result = await state(page);
  assert.equal(result.fallback, true);
  assert.equal(result.modelHidden, true);
  assert.match(result.modelState, /întrerupt/);
}));
test('failed WebGL2 context creation keeps textual help', () => run({
  init: [() => {
    const native = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      return /^webgl|experimental-webgl/.test(type) ? null : native.call(this, type, ...args);
    };
  }]
}, async ({ page }) => {
  assert.equal((await state(page)).fallback, true);
  assert.match((await state(page)).modelState, /nu este disponibilă/);
  assert.equal(await page.locator('model-viewer').count(), 0);
}));

test('storage denial is tolerated without a write', () => run({
  init: [() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('blocked', 'SecurityError'); } })]
}, async ({ page, errors }) => {
  await page.locator('#roboTrigger').click();
  assert.match((await state(page)).age, /singur pas/);
  assert.deepEqual(errors, []);
}));
test('in-page age selection overrides stale URL and updates the visible mentor', () => run({
  url: '/parser-propozitii.html?age=7-8', inject: true
}, async ({ page }) => {
  await page.locator('#roboTrigger').click();
  await page.locator('[data-age="9-10"]').click();
  assert.match((await state(page)).age, /excepție/);
  assert.equal(await page.evaluate(() => localStorage.getItem('roboCip:ageTrack')), '9-10');
}));

test('missing voice API keeps an explicit written fallback', () => run({
  init: [() => { delete window.speechSynthesis; delete window.SpeechSynthesisUtterance; }]
}, async ({ page, errors }) => {
  await page.locator('#roboTrigger').click();
  await page.locator('#sample').click();
  await page.waitForFunction(() => document.querySelector('[data-robo-mentor]').shadowRoot.getElementById('audioState').textContent.includes('rămâne în scris'));
  assert.deepEqual(errors, []);
}));
test('missing Romanian voice is explained before default-voice playback', () => run({
  init: [() => { window.speechSynthesis.voices = [{ lang: 'en-US' }]; }]
}, async ({ page }) => {
  await page.locator('#roboTrigger').click();
  await page.locator('#sample').click();
  await page.waitForFunction(() => document.querySelector('[data-robo-mentor]').shadowRoot.getElementById('audioState').textContent.includes('Pronunția'));
}));
test('stop cancels startup warning and ignores late audio events', () => run({
  init: [() => { window.delaySpeech = true; }]
}, async ({ page }) => {
  await page.locator('#roboTrigger').click();
  await page.locator('#sample').click();
  await page.waitForFunction(() => !!window.lastUtterance);
  await page.locator('#stop').click();
  await page.evaluate(() => {
    window.lastUtterance.onstart?.({});
    window.lastUtterance.onerror?.({ error: 'canceled' });
    window.lastUtterance.onend?.({});
  });
  await page.waitForTimeout(3600);
  assert.equal((await state(page)).audioState, '');
}));

test('closing mentor preserves the active clinic voice, including after an interruption', () => run({
  url: '/clinica-mesaje.html?age=7-8', inject: true
}, async ({ page }) => {
  await page.locator('#roboExplain').click();
  await page.waitForFunction(() => window.RoboVoice.isOwner('clinica-mesaje'));
  const before = await page.evaluate(() => speechSynthesis.calls.filter(c => c.kind === 'cancel').length);
  await page.locator('#roboTrigger').click();
  await page.locator('#close').click();
  assert.equal(await page.evaluate(() => speechSynthesis.calls.filter(c => c.kind === 'cancel').length), before);
  await page.locator('#roboTrigger').click();
  await page.locator('#sample').click();
  await page.waitForFunction(() => window.RoboVoice.isOwner('robo-mentor'));
  await page.locator('#roboExplain').click();
  await page.waitForFunction(() => window.RoboVoice.isOwner('clinica-mesaje'));
  const replacements = await page.evaluate(() => speechSynthesis.calls.filter(c => c.kind === 'cancel').length);
  await page.locator('#close').click();
  assert.equal(await page.evaluate(() => speechSynthesis.calls.filter(c => c.kind === 'cancel').length), replacements);
}));
test('story stop leaves an injected mentor explanation playing', () => run({
  url: '/constructor-povesti.html', inject: true
}, async ({ page }) => {
  await page.locator('#roboTrigger').click();
  await page.locator('#sample').click();
  await page.waitForFunction(() => window.RoboVoice.isOwner('robo-mentor'));
  await page.locator('#pause').click();
  assert.equal(await page.evaluate(() => window.RoboVoice.isOwner('robo-mentor')), true);
}));
test('existing voiced pages still load without speech support', async () => {
  for (const url of ['/', '/clinica-mesaje.html', '/constructor-povesti.html']) {
    await run({ url, init: [() => { delete window.speechSynthesis; delete window.SpeechSynthesisUtterance; }] }, async ({ errors }) => {
      assert.deepEqual(errors, []);
    });
  }
});
test('existing routes remain usable and mentor stays on the demo page', async () => {
  for (const url of ['/modules.html', '/css/styles.css', '/js/robo-menu-button.js', '/js/home.js', '/robo-voice.js', '/Robo.glb']) {
    const response = await fetch(origin + url);
    assert.equal(response.status, 200, url);
    await response.arrayBuffer();
  }
  await run({ url: '/modules.html' }, async ({ page }) => {
    assert.equal(await page.locator('[data-robo-mentor]').count(), 0);
  });
});

