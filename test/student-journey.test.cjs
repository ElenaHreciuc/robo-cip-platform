const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { page, Storage, inlineScript } = require('./helpers/dom.cjs');

const root = path.join(__dirname, '..');
const journeyHTML = fs.readFileSync(path.join(root, 'student-journey.html'), 'utf8');
const summaryJS = fs.readFileSync(path.join(root, 'portfolio-summary.js'), 'utf8');
const portfolioHTML = fs.readFileSync(path.join(root, 'rezultate-portofolii.html'), 'utf8');
const key = 'roboCip:explore:student-journey.html';
const legacy = {
  student: 'Ștefan',
  0: { answer: 'Observație: apă și umbră.', checked: [true, false, true, false] },
  1: { answer: 'Măsurăm temperatura în °C.', checked: [true, true, true, true], finished: true }
};
const saved = p => JSON.parse(p.storage.getItem(key));
function journey(storage = new Storage(), search = '') {
  const p = page(journeyHTML, storage, search);
  p.run(inlineScript(journeyHTML));
  return p;
}
function complete(p) {
  p.input('answer', 'Măsurăm umbra în curtea școlii.');
  for (let i = 0; i < 4; i++) p.check(i);
  p.click('finish');
}
function portfolio(storage) {
  const p = page(portfolioHTML, storage);
  p.run(summaryJS);
  p.run(inlineScript(portfolioHTML));
  return p;
}
function descendants(node) { return node.children.flatMap(child => [child, ...descendants(child)]); }

test('legacy answers, checks and pseudonym are restored without migrating keys', () => {
  const p = journey(new Storage({ [key]: JSON.stringify(legacy) }));
  assert.equal(p.nodes.get('student').value, 'Ștefan');
  assert.equal(p.nodes.get('answer').value, legacy[0].answer);
  assert.deepEqual(p.nodes.get('steps').querySelectorAll('input').map(n => n.checked), legacy[0].checked);
  p.nodes.get('cards').children[1].click();
  assert.equal(p.nodes.get('answer').value, legacy[1].answer);
  assert.equal(p.nodes.get('result').hidden, false);
  assert.match(p.nodes.get('result').textContent, /Produs finalizat!/);
});

test('finished work survives saving, export, stage changes and reload', () => {
  const p = journey();
  complete(p);
  assert.equal(saved(p)[0].finished, true);
  p.click('save');
  p.click('download');
  p.nodes.get('cards').children[1].click();
  p.input('answer', 'A doua etapă rămâne distinctă.');
  const reloaded = journey(new Storage(p.storage.data));
  assert.equal(saved(reloaded)[0].finished, true);
  assert.equal(reloaded.nodes.get('result').hidden, false);
  reloaded.nodes.get('cards').children[1].click();
  assert.equal(reloaded.nodes.get('answer').value, 'A doua etapă rămâne distinctă.');
  assert.equal(reloaded.nodes.get('result').hidden, true);
});

test('editing a finished answer or a checkbox returns only that stage to a draft', () => {
  const p = journey(new Storage({ [key]: JSON.stringify(legacy) }), '?stage=1');
  p.input('answer', 'O ipoteză revizuită.');
  assert.equal(saved(p)[1].finished, false);
  assert.equal(p.nodes.get('result').hidden, true);
  assert.equal(saved(p)[0].answer, legacy[0].answer);
  p.click('finish');
  assert.equal(saved(p)[1].finished, true);
  p.check(0, false);
  assert.equal(saved(p)[1].finished, false);
  assert.equal(p.nodes.get('result').hidden, true);
});

test('changing the optional pseudonym preserves completion and refreshes the displayed product', () => {
  const p = journey();
  complete(p);
  p.input('student', 'Explorator Ș');
  assert.equal(saved(p)[0].finished, true);
  assert.match(p.nodes.get('result').textContent, /Explorator: Explorator Ș/);
});

test('blank answers and incomplete checklists cannot finish a product', () => {
  const p = journey();
  p.input('answer', '   ');
  for (let i = 0; i < 4; i++) p.check(i);
  p.click('finish');
  assert.notEqual(saved(p)[0].finished, true);
  assert.match(p.nodes.get('result').textContent, /Pentru finalizare/);
  p.input('answer', 'Date din observație.');
  p.check(3, false);
  p.click('finish');
  assert.notEqual(saved(p)[0].finished, true);
  assert.match(p.nodes.get('result').textContent, /Pentru finalizare/);
});

test('failed storage writes stay visible across stage changes and can be retried', () => {
  const p = journey();
  p.storage.failWrites = true;
  p.input('answer', 'O observație care trebuie exportată.');
  p.click('save');
  assert.match(p.nodes.get('progress').textContent, /Salvarea a eșuat/);
  assert.doesNotMatch(p.nodes.get('progress').textContent, /Progres salvat/);
  assert.equal(p.storage.getItem(key), null);
  p.nodes.get('cards').children[1].click();
  assert.match(p.nodes.get('progress').textContent, /Salvarea a eșuat/);
  p.storage.failWrites = false;
  p.click('save');
  assert.match(p.nodes.get('progress').textContent, /Progres salvat/);
  assert.equal(saved(p)[0].answer, 'O observație care trebuie exportată.');
});

test('finishing without storage reports the failure and still permits a UTF-8 text backup', async () => {
  const p = journey();
  p.storage.failWrites = true;
  complete(p);
  assert.equal(p.storage.getItem(key), null);
  assert.match(p.nodes.get('result').textContent, /salvarea a eșuat/);
  assert.doesNotMatch(p.nodes.get('result').textContent, /^Produs finalizat!/);
  p.click('download');
  assert.equal(p.downloads[0].filename, 'RoboCip_student-journey_produs.txt');
  assert.equal(p.blobs[0].type, 'text/plain;charset=utf-8');
  assert.match(await p.blobs[0].text(), /Măsurăm umbra în curtea școlii\./);
  p.storage.failWrites = false;
  p.click('save');
  assert.equal(saved(p)[0].finished, true);
  assert.match(p.nodes.get('result').textContent, /^Produs finalizat!/);
});

test('text export rejects blank content and preserves its existing header and filename', async () => {
  const p = journey();
  p.click('download');
  assert.equal(p.downloads.length, 0);
  p.input('student', 'Ștefan');
  p.input('answer', 'Aer curat, apă și 23 °C.');
  p.check(0);
  p.click('download');
  const content = await p.blobs[0].text();
  assert.match(content, /^ROBO-CIP · Călătoria lui ROBO-CIP\n/);
  assert.match(content, /Explorator: Ștefan/);
  assert.match(content, /Pași realizați: 1\/4/);
  assert.match(content, /Aer curat, apă și 23 °C\./);
  assert.equal(p.downloads[0].filename, 'RoboCip_student-journey_produs.txt');
});

test('stage links restore the specified stage and invalid query values fall back to the first', () => {
  for (const index of [0, 1, 2]) {
    const p = journey(new Storage({ [key]: JSON.stringify(legacy) }), '?stage=' + index);
    assert.match(p.nodes.get('challenge').textContent, new RegExp('Etapa ' + (index + 1)));
  }
  for (const value of ['-1', '3', '1.2', 'invalid', '']) {
    assert.match(journey(new Storage(), '?stage=' + value).nodes.get('challenge').textContent, /Etapa 1/);
  }
});

test('journey drafts and finished products appear alongside existing portfolio records and exports', () => {
  const storage = new Storage({
    [key]: JSON.stringify({ ...legacy, 2: { answer: '   ', checked: [] } }),
    roboCity: JSON.stringify([{ date: '2026-10-26', description: 'Un oraș construit.' }]),
    'roboCip:stories': JSON.stringify([{ description: 'Povestea noastră.' }])
  });
  const before = JSON.stringify(storage.data);
  const p = portfolio(storage);
  const all = p.context.RoboPortfolio.read(storage);
  const journeys = all.filter(item => item.key === key);
  assert.equal(all.length, 4);
  assert.equal(journeys.length, 2);
  assert.equal(journeys[0].record.description, legacy[0].answer);
  assert.equal(journeys[1].record.finished, true);
  assert.equal(journeys[0].url, '/student-journey.html?stage=0');
  assert.equal(journeys[1].url, '/student-journey.html?stage=1');
  assert.equal(JSON.stringify(storage.data), before);
  assert.equal(p.context.RoboPortfolio.exportData().format, 'robo-cip-portfolio-v1');
  assert.equal(p.context.RoboPortfolio.exportData().items.length, 4);
  assert.equal(p.nodes.get('portfolios').children.length, 4);
  const indicators=descendants(p.nodes.get('portfolios')).filter(n => n.className === 'indicator');
  assert.equal(indicators.filter(n => n.textContent === '1 produse salvate').length, 2);
  assert.equal(indicators.filter(n => n.textContent === 'În lucru').length, 2);
  assert.equal(p.nodes.get('journeyPortfolio').hidden, false);
  const journeyNodes = descendants(p.nodes.get('journeyList'));
  assert.equal(journeyNodes.filter(n => n.tagName === 'ARTICLE').length, 2);
  assert.ok(journeyNodes.some(n => /Stare: În lucru/.test(n.textContent)));
  assert.ok(journeyNodes.some(n => /Stare: Finalizat/.test(n.textContent)));
});

test('the third stage is exported once and its portfolio link reopens its own work', () => {
  const storage = new Storage({ [key]: JSON.stringify({
    student: 'Explorator',
    2: { answer: 'Construim un prototip și îl testăm.', checked: [true, true, true, true], finished: true }
  }) });
  const p = portfolio(storage);
  const products = p.context.RoboPortfolio.exportData().items;
  assert.equal(products.length, 1);
  assert.equal(products[0].title, 'Plan de prototip și prezentare');
  assert.equal(products[0].url, '/student-journey.html?stage=2');
  const reopened = journey(storage, '?stage=2');
  assert.equal(reopened.nodes.get('answer').value, products[0].record.description);
  assert.equal(reopened.nodes.get('result').hidden, false);
});

test('absent, corrupt or malformed journey data does not hide other portfolios', () => {
  for (const value of [undefined, 'invalid JSON', 'null', '[]', JSON.stringify({0: {answer: 5}})]) {
    const storage = new Storage({roboCity: JSON.stringify([{ description: 'Orașul meu.' }])});
    if (value !== undefined) storage.data[key] = value;
    const p = portfolio(storage);
    assert.equal(p.nodes.get('journeyPortfolio').hidden, true);
    assert.equal(p.context.RoboPortfolio.read(storage).length, 1);
    assert.equal(p.nodes.get('portfolios').children.length, 4);
  }
});
