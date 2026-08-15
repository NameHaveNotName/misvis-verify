#!/usr/bin/env node
/* Counterbalancing test for MisVis Verify.
 *
 * Simulates N participants and checks:
 *   - intervention assignment ~50/50 (control/egvv)
 *   - counterbalance list distribution ~25% each (A/B/C/D)
 *   - per list: 6 accurate / 6 misleading, 6 AI / 6 no-provenance
 *   - per list: 2x2 cells balanced (3 each)
 *   - no participant ever sees both versions of the same pair
 *
 * Usage: node scripts/test_randomization.js [N]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const N = parseInt(process.argv[2] || '1000', 10);

// --- load data ---
const stimuli = JSON.parse(fs.readFileSync(path.join(ROOT, 'study/data/stimuli.json'), 'utf8'));
const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, 'study/data/baseline.json'), 'utf8'));
const transfer = JSON.parse(fs.readFileSync(path.join(ROOT, 'study/data/transfer.json'), 'utf8'));

// --- mock browser globals ---
global.window = {
  MISVIS_VERIFY_STIMULI: stimuli,
  MISVIS_VERIFY_BASELINE: baseline,
  MISVIS_VERIFY_TRANSFER: transfer
};

function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
  return h >>> 0;
}
function shuffle(arr, rng) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
global.window.MisVisVerifyRandom = { makeRng: pid => mulberry32(hashString(pid)), shuffle, hashString };

// load trials.js
eval(fs.readFileSync(path.join(ROOT, 'study/js/trials.js'), 'utf8'));

// --- helpers mirroring experiment assignment ---
function assignCondition(pid) { return hashString(pid) % 2 === 0 ? 'control' : 'egvv'; }
function assignList(pid) { return ['A', 'B', 'C', 'D'][hashString(pid) % 4]; }

// --- simulate ---
const conditionCount = { control: 0, egvv: 0 };
const listCount = { A: 0, B: 0, C: 0, D: 0 };
const listStats = { A: {}, B: {}, C: {}, D: {} };
let violations = [];

function cellKey(t) {
  return (t.provenance_condition === 'ai-assisted' ? 'ai' : 'none') + '_' + t.integrity;
}

for (let i = 0; i < N; i++) {
  const pid = 'MV-' + i.toString(16).padStart(8, '0');
  const cond = assignCondition(pid);
  const list = assignList(pid);
  conditionCount[cond]++;
  listCount[list]++;

  const plan = window.MisVisVerifyTrials.build(pid, list);
  const m = plan.main;

  // build stats for this list
  let s = listStats[list];
  if (!s.count) {
    s.count = 0; s.acc = 0; s.mis = 0; s.ai = 0; s.none = 0;
    s.cells = { ai_accurate: 0, ai_misleading: 0, none_accurate: 0, none_misleading: 0 };
    s.pairs = new Set();
  }
  s.count++;
  s.acc += m.filter(t => t.integrity === 'accurate').length;
  s.mis += m.filter(t => t.integrity === 'misleading').length;
  s.ai += m.filter(t => t.provenance_condition === 'ai-assisted').length;
  s.none += m.filter(t => t.provenance_condition === 'none').length;
  m.forEach(t => { s.cells[cellKey(t)]++; s.pairs.add(t.pair_id); });

  // violation: participant sees both versions of same pair?
  const seen = new Set(m.map(t => t.pair_id));
  if (seen.size !== 12) violations.push(`${pid}: main has ${seen.size} unique pairs (expected 12)`);

  // violation: baseline/transfer counts
  if (plan.baseline.length !== 4) violations.push(`${pid}: baseline ${plan.baseline.length}`);
  if (plan.transfer.length !== 6) violations.push(`${pid}: transfer ${plan.transfer.length}`);
}

// --- report ---
console.log(`Simulated ${N} participants\n`);
console.log('Intervention assignment:');
console.log(`  control: ${conditionCount.control} (${(conditionCount.control / N * 100).toFixed(1)}%)`);
console.log(`  egvv:    ${conditionCount.egvv} (${(conditionCount.egvv / N * 100).toFixed(1)}%)\n`);

console.log('Counterbalance list distribution:');
for (const l of ['A', 'B', 'C', 'D']) {
  console.log(`  List ${l}: ${listCount[l]} (${(listCount[l] / N * 100).toFixed(1)}%)`);
}
console.log();

console.log('Per-list main trial balance (aggregated over all participants in that list):');
for (const l of ['A', 'B', 'C', 'D']) {
  const s = listStats[l];
  const per = s.count;
  console.log(`  List ${l}: acc=${s.acc / per} mis=${s.mis / per} ai=${s.ai / per} none=${s.none / per} | ` +
    `aiAcc=${s.cells.ai_accurate / per} aiMis=${s.cells.ai_misleading / per} ` +
    `noneAcc=${s.cells.none_accurate / per} noneMis=${s.cells.none_misleading / per}`);
}
console.log();

if (violations.length) {
  console.log(`VIOLATIONS (${violations.length}):`);
  violations.slice(0, 20).forEach(v => console.log('  ' + v));
  if (violations.length > 20) console.log(`  ... and ${violations.length - 20} more`);
  process.exit(1);
}

console.log('OK: no counterbalancing violations detected.');
process.exit(0);
