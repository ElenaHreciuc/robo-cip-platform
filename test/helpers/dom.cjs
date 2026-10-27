const vm = require('node:vm');

class Element {
  constructor(tag = 'div') {
    this.tagName = tag.toUpperCase();
    this.children = [];
    this.dataset = {};
    this.attributes = {};
    this.value = '';
    this.checked = false;
    this.hidden = false;
    this.textContent = '';
    this.className = '';
    this.style = { setProperty() {} };
    this.classList = { toggle() {} };
  }
  append(...nodes) { this.children.push(...nodes); }
  appendChild(node) { this.append(node); return node; }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute(key, value) { this.attributes[key] = value; }
  querySelectorAll(selector) {
    return this.children.flatMap(child => [child, ...child.querySelectorAll(selector)])
      .filter(child => selector === 'input' && child.tagName === 'INPUT');
  }
  scrollIntoView() {}
  click() {
    if (this.onclick) this.onclick();
    if (this.onClickCapture) this.onClickCapture(this);
  }
}

class Storage {
  constructor(seed = {}) { this.data = { ...seed }; this.failWrites = false; }
  getItem(key) { return Object.hasOwn(this.data, key) ? this.data[key] : null; }
  setItem(key, value) {
    if (this.failWrites) throw Object.assign(new Error('Storage full'), { name: 'QuotaExceededError' });
    this.data[key] = String(value);
  }
}

// Runs the real page scripts with only their DOM/storage boundary substituted.
// Browser layout and the native download UI require a separate browser check.
function page(html, storage = new Storage(), search = '') {
  const nodes = new Map();
  for (const match of html.matchAll(/<([a-z0-9]+)\b[^>]*\bid="([^"]+)"[^>]*>/gi)) {
    const node = new Element(match[1]);
    node.hidden = /\bhidden\b/.test(match[0]);
    nodes.set(match[2], node);
  }
  const downloads = [], blobs = [];
  const document = {
    getElementById: id => nodes.get(id),
    createElement: tag => {
      const node = new Element(tag);
      if (tag === 'a') node.onClickCapture = a => downloads.push({ filename: a.download, url: a.href });
      return node;
    }
  };
  const context = {
    document, localStorage: storage, Blob, URLSearchParams, location: { search },
    URL: { createObjectURL(blob) { blobs.push(blob); return 'blob:test-' + blobs.length; }, revokeObjectURL() {} },
    setTimeout() {}, console
  };
  context.window = context;
  vm.createContext(context);
  return {
    context, nodes, downloads, blobs, storage,
    run: source => vm.runInContext(source, context),
    click: id => nodes.get(id).click(),
    input(id, value) { const node = nodes.get(id); node.value = value; node.oninput(); },
    check(index, checked = true) {
      const node = nodes.get('steps').querySelectorAll('input')[index];
      node.checked = checked;
      node.onchange();
    }
  };
}

function inlineScript(html) { return html.match(/<script>([\s\S]*?)<\/script>/)[1]; }
module.exports = { page, Storage, inlineScript };
