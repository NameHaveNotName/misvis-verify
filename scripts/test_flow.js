#!/usr/bin/env node
/* End-to-end smoke test for study.html flow using a minimal DOM mock.
 *
 * Exercises: init → consent → setup → 8 baseline → 20 main (pre/intervention/post)
 * → 16 transfer → questionnaire → complete → download, for BOTH conditions
 * (control and egvv), and asserts 44 trials are saved and exportable.
 *
 * Usage: node scripts/test_flow.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

// mutable state used by the DOM mock
const S = {
  byId: {},
  radios: [],
  states: [],
  egvvOnlyEls: [],
  formData: {},
  downloads: [],
  localStorage: new Map(),
  clock: 0,
  cryptoSeed: 0x11111111,
  lastAlert: null
};

function makeEl(id) {
  const el = {
    id,
    value: '', checked: false, disabled: false, hidden: false,
    textContent: '', innerHTML: '', src: '', dataset: {},
    style: {},
    classList: { add() {}, remove() {}, toggle() {} },
    oninput: null, onchange: null, onclick: null,
    scrollIntoView() {},
    addEventListener() {}
  };
  S.byId[id] = el;
  return el;
}

function makeRadio(value) {
  const el = makeEl('radio-' + value);
  el.value = value;
  el.type = 'radio';
  S.radios.push(el);
  return el;
}

const ALL_IDS = [
  'mode-badge','consent-check','btn-consent','participant-id','debug-info','btn-setup',
  'trial-phase','trial-progress','provenance-bar','stimulus-image','trust-slider',
  'confidence-slider','btn-trial','control-stimulus-image','btn-control',
  'egvv-stimulus-image','egvv-compare-note','egvv-step','egvv-title','egvv-text',
  'btn-egvv-next','btn-egvv-prev','post-form','btn-questionnaire','btn-download',
  'pilot-feedback-area','btn-feedback','pilot-feedback','ai-influence','egvv-help',
  'egvv-burden','strategy'
];
const STATE_NAMES = ['consent','setup','trial','egvv','control','questionnaire','complete'];

function resetDom() {
  S.byId = {};
  S.radios = [];
  S.states = [];
  S.egvvOnlyEls = [];
  S.downloads = [];
  ALL_IDS.forEach(makeEl);
  ['yes','no','unsure'].forEach(makeRadio);
  STATE_NAMES.forEach(n => { S.states.push(makeEl('state-' + n)); });
  S.egvvOnlyEls.push(makeEl('egvv-only-1'), makeEl('egvv-only-2'));
}

const document = {
  querySelector(sel) {
    if (sel.startsWith('#')) return S.byId[sel.slice(1)] || null;
    if (sel === 'input[name="misleading"]:checked') return S.radios.find(r => r.checked) || null;
    if (sel === 'input[name="misleading"]') return S.radios[0] || null;
    return null;
  },
  querySelectorAll(sel) {
    if (sel === '.study-state') return S.states;
    if (sel === 'input[name="misleading"]') return S.radios;
    if (sel === '.egvv-only') return S.egvvOnlyEls;
    if (sel.startsWith('#')) { const e = S.byId[sel.slice(1)]; return e ? [e] : []; }
    return [];
  },
  addEventListener(ev, fn) { if (ev === 'DOMContentLoaded') S.domReady = fn; },
  body: { innerHTML: '' },
  activeElement: { tagName: 'BODY' },
  createElement(tag) {
    const el = makeEl('created-' + tag);
    el.click = () => { S.downloads.push({ href: el.href, download: el.download }); };
    return el;
  }
};

function FormData() {}
FormData.prototype.getAll = function(name) { return S.formData[name] || []; };
FormData.prototype.get = function(name) {
  return S.formData[name] !== undefined ? S.formData[name] : null;
};

const localStorage = {
  getItem(k) { return S.localStorage.has(k) ? S.localStorage.get(k) : null; },
  setItem(k, v) { S.localStorage.set(k, String(v)); },
  removeItem(k) { S.localStorage.delete(k); },
  key(i) { return [...S.localStorage.keys()][i] || null; },
  get length() { return S.localStorage.size; }
};

const windowMock = globalThis;
windowMock.innerWidth = 1920;
windowMock.innerHeight = 1080;
windowMock.crypto = { getRandomValues(arr) { arr[0] = S.cryptoSeed; arr[1] = 2; } };
windowMock.confirm = () => true;
windowMock.alert = (m) => { S.lastAlert = m; };

const history = { pushState() {} };
const location = { search: '?mode=pilot', href: 'file:///study.html', reload() {} };
const navigator = { userAgent: 'smoke-test' };
const performance = { now: () => { S.clock += 1; return S.clock; } };
const setTimeout = (fn) => { fn(); return 0; };
const Blob = class { constructor(parts, opts) { this.parts = parts; this.type = opts && opts.type; } };
const URL = { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} };
const confirm = () => true;
const alert = (m) => { S.lastAlert = m; };

const globalsToSet = {
  window: windowMock, document, localStorage, history, location, navigator,
  performance, setTimeout, Blob, URL, FormData, confirm, alert
};
for (const [k, v] of Object.entries(globalsToSet)) {
  Object.defineProperty(globalThis, k, { value: v, writable: true, configurable: true });
}

function loadScripts() {
  ['study/data/stimuli-data.js','study/js/storage.js','study/js/randomization.js',
   'study/js/trials.js','study/js/ui.js','study/js/experiment.js','study/js/app.js'
  ].forEach(rel => {
    eval(fs.readFileSync(path.join(ROOT, rel), 'utf8'));
  });

  // hook export to capture output
  const store = windowMock.MisVisVerifyStorage;
  const origExport = store.exportJSON;
  store.exportJSON = function() {
    const out = origExport.call(this);
    localStorage.setItem('__last_export', out);
    return out;
  };
}

function answer(trust, conf, misleading) {
  const ts = S.byId['trust-slider'];
  ts.value = String(trust); ts.dataset.touched = 'true';
  if (ts.oninput) ts.oninput();
  const cs = S.byId['confidence-slider'];
  cs.value = String(conf); cs.dataset.touched = 'true';
  if (cs.oninput) cs.oninput();
  S.radios.forEach(r => { r.checked = (r.value === misleading); });
  const radio = S.radios.find(r => r.checked);
  if (radio && radio.onchange) radio.onchange();
  if (S.byId['btn-trial'].disabled) throw new Error('btn-trial should be enabled after answering');
  S.byId['btn-trial'].onclick();
}

function runFlow() {
  S.domReady(); // init

  S.byId['consent-check'].checked = true;
  S.byId['consent-check'].onchange();
  if (S.byId['btn-consent'].disabled) throw new Error('consent button should be enabled');
  S.byId['btn-consent'].onclick();

  S.byId['btn-setup'].onclick();

  for (let i = 0; i < 8; i++) answer(50 + i, 60, 'no');

  const cond = JSON.parse(localStorage.getItem('misvis_verify_session')).condition;

  for (let i = 0; i < 20; i++) {
    answer(60, 60, 'no');
    if (cond === 'egvv') {
      for (let s = 0; s < 4; s++) S.byId['btn-egvv-next'].onclick();
    } else {
      S.byId['btn-control'].onclick();
    }
    answer(40, 70, 'yes');
  }

  for (let i = 0; i < 16; i++) answer(55, 65, 'unsure');

  S.formData = {
    'checks': ['axis', 'title'],
    'ai-influence': '60',
    'egvv-help': '70',
    'egvv-burden': '30',
    'strategy': 'test strategy'
  };
  S.byId['btn-questionnaire'].onclick();

  const session = JSON.parse(localStorage.getItem('misvis_verify_session'));
  if (!session.completed) throw new Error('session not completed');

  S.byId['btn-download'].onclick();
  if (S.downloads.length !== 1) throw new Error('download not triggered');

  const exported = JSON.parse(localStorage.getItem('__last_export'));
  if (!exported.session || !Array.isArray(exported.trials)) throw new Error('export structure wrong');
  if (exported.trials.length !== 44) throw new Error('expected 44 trials, got ' + exported.trials.length);

  const mainTrials = exported.trials.filter(t => t.phase === 'main');
  if (mainTrials.length !== 20) throw new Error('expected 20 main trials');
  if (!mainTrials.every(t => t.trust_post !== null && t.misleading_post !== null)) {
    throw new Error('main trials missing post responses');
  }
  if (!mainTrials.every(t => t.intervention_time_ms !== null)) {
    throw new Error('intervention time missing');
  }
  if (cond === 'egvv' && !mainTrials.every(t => t.locate_time_ms !== null)) {
    throw new Error('EGVV step times missing');
  }
  const b = exported.trials.filter(t => t.phase === 'baseline');
  const tr = exported.trials.filter(t => t.phase === 'transfer');
  if (b.length !== 8 || tr.length !== 16) throw new Error('baseline/transfer counts wrong');

  const aiAssisted = mainTrials.filter(t => t.provenance_condition === 'ai-assisted');
  if (!aiAssisted.every(t => t.ai_attitude === 'trust' || t.ai_attitude === 'distrust')) {
    throw new Error('ai-assisted trials missing ai_attitude');
  }
  const transferDerived = mainTrials.filter(t => t.transfer_type !== null);
  if (!transferDerived.every(t => t.provenance_condition === null && t.ai_attitude === null)) {
    throw new Error('transfer-derived main trials should have null provenance/ai_attitude');
  }

  return cond;
}

// ---------------- run both conditions
const conditions = new Set();
for (let pass = 0; pass < 40; pass++) {
  S.localStorage.clear();
  S.formData = {};
  S.clock = 0;
  S.cryptoSeed = 0x11111111 + pass * 0x12345;
  resetDom();
  for (const k of ['MisVisVerifyStorage','MisVisVerifyRandom','MisVisVerifyTrials',
                   'MisVisVerifyUI','MisVisVerifyExperiment','MISVIS_VERIFY_STIMULI',
                   'MISVIS_VERIFY_BASELINE','MISVIS_VERIFY_TRANSFER','MISVIS_VERIFY_STIMULUS_MAP']) {
    delete windowMock[k];
  }
  loadScripts();
  const cond = runFlow();
  conditions.add(cond);
  console.log(`Pass ${pass}: condition=${cond}, 44 trials exported OK`);
  if (conditions.size === 2) break;
}

if (conditions.size < 2) {
  console.error('WARNING: only one condition exercised:', [...conditions]);
}
console.log('Smoke test passed.');
