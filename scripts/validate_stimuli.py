#!/usr/bin/env python3
"""Validate MisVis Verify stimulus set.

Checks:
  - 40 main SVGs exist
  - 20 matched pairs (accurate + misleading each)
  - SVG size 1200x720 consistent
  - unique pair IDs and stimulus IDs
  - annotation coordinates in 0-100
  - all EGVV fields non-empty
  - AI interpretation variants exist for both integrity versions
  - valid integrity values
  - mechanism in allowed list

Exit code 0 on success, non-zero on failure.
"""

import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DATA_PATH = os.path.join(ROOT, "study", "data", "stimuli.json")
BASE_PATH = os.path.join(ROOT, "study", "data", "baseline.json")
TRANS_PATH = os.path.join(ROOT, "study", "data", "transfer.json")
MAP_PATH = os.path.join(ROOT, "study", "data", "stimulus_map.json")
OUT_DIR = os.path.join(ROOT, "study", "assets", "stimuli")

ALLOWED_MECHANISMS = {
    "truncated-axis",
    "cherry-picked-time",
    "hidden-uncertainty",
    "area-distortion",
    "color-emphasis",
    "misleading-title",
    "dual-axis",
    "pie-3d",
    "missing-normalization",
    "overusing-colors",
    "inappropriate-scale",
    "3d-bar-distortion",
    "inconsistent-tick-labels",
    "histogram-reading",
    "pie-proportion",
    "inverted-axis",
    "misordered-axis",
    "premature-conclusion",
    "missing-normalization-map",
}
ALLOWED_INTEGRITY = {"accurate", "misleading"}

errors = []
warnings = []


def check(cond, msg):
    if not cond:
        errors.append(msg)


with open(DATA_PATH, encoding="utf-8") as f:
    spec = json.load(f)

pairs = spec.get("pairs", [])
check(len(pairs) == 20, f"expected 20 pairs, got {len(pairs)}")

pair_ids = [p.get("pairId") for p in pairs]
check(len(pair_ids) == len(set(pair_ids)), "duplicate pair IDs")

stimulus_ids = []
for p in pairs:
    check(p.get("mechanism") in ALLOWED_MECHANISMS,
          f"{p.get('pairId')}: invalid mechanism {p.get('mechanism')}")
    for key in ("accurate", "misleading"):
        obj = p.get(key, {})
        check(obj.get("groundTruth") == key,
              f"{p.get('pairId')}.{key}: groundTruth must be '{key}'")
        sid = obj.get("image")
        check(sid, f"{p.get('pairId')}.{key}: missing image")
        if sid:
            stimulus_ids.append(sid)

    egvv = p.get("egvv", {})
    for field in ("locate", "explain", "verify", "compareAccurate", "compareMisleading"):
        check(egvv.get(field), f"{p.get('pairId')}: EGVV field '{field}' empty")
    ann = egvv.get("annotation", {})
    for coord in ("x", "y"):
        val = ann.get(coord)
        check(isinstance(val, (int, float)) and 0 <= val <= 100,
              f"{p.get('pairId')}: annotation.{coord} out of range")

    ai = p.get("aiInterpretations", {})
    for key in ("accurate", "misleading"):
        by_attitude = ai.get(key, {})
        check(isinstance(by_attitude, dict), f"{p.get('pairId')}: aiInterpretations.{key} must be {{trust: [...], distrust: [...]}}")
        for attitude in ("trust", "distrust"):
            variants = by_attitude.get(attitude, [])
            check(isinstance(variants, list) and len(variants) >= 2,
                  f"{p.get('pairId')}: aiInterpretations.{key}.{attitude} needs >= 2 variants")
            for v in variants:
                check(v.get("text"), f"{p.get('pairId')}: AI interpretation missing text")
                check(v.get("tone"), f"{p.get('pairId')}: AI interpretation missing tone")
                check(v.get("status"), f"{p.get('pairId')}: AI interpretation missing status")

check(len(stimulus_ids) == 40, f"expected 40 stimulus IDs, got {len(stimulus_ids)}")
check(len(stimulus_ids) == len(set(stimulus_ids)), "duplicate stimulus IDs")

# Check SVGs exist and size
for sid in stimulus_ids:
    path = os.path.join(OUT_DIR, sid)
    if not os.path.exists(path):
        check(False, f"missing SVG file: {sid}")
        continue
    with open(path, encoding="utf-8") as f:
        content = f.read()
    m = re.search(r'width="(\d+)" height="(\d+)"', content)
    if not m:
        check(False, f"{sid}: no width/height in SVG")
    else:
        w, h = int(m.group(1)), int(m.group(2))
        if w != 1200 or h != 720:
            errors.append(f"{sid}: size {w}x{h}, expected 1200x720")
    if not content.strip().endswith("</svg>"):
        check(False, f"{sid}: malformed SVG (no closing tag)")

# Check mapping file matches
if os.path.exists(MAP_PATH):
    with open(MAP_PATH, encoding="utf-8") as f:
        mapping = json.load(f)
    check(len(mapping) == 64, f"mapping has {len(mapping)} entries, expected 64")
    for sid, meta in mapping.items():
        check(meta.get("integrity") in ALLOWED_INTEGRITY,
              f"mapping {sid}: invalid integrity {meta.get('integrity')}")
        check(meta.get("mechanism") in ALLOWED_MECHANISMS,
              f"mapping {sid}: invalid mechanism {meta.get('mechanism')}")
else:
    warnings.append("stimulus_map.json not found")

# Validate baseline and transfer files
for path, expected, name in ((BASE_PATH, 8, "baseline"),
                             (TRANS_PATH, 16, "transfer")):
    with open(path, encoding="utf-8") as f:
        spec = json.load(f)
    trials = spec.get("trials", [])
    check(len(trials) == expected, f"{name}: expected {expected} trials, got {len(trials)}")
    for t in trials:
        check(t.get("mechanism") in ALLOWED_MECHANISMS,
              f"{name} {t.get('trialId')}: invalid mechanism {t.get('mechanism')}")
        check(t.get("integrity") in ALLOWED_INTEGRITY,
              f"{name} {t.get('trialId')}: invalid integrity {t.get('integrity')}")
        sid = t.get("image")
        check(sid and os.path.exists(os.path.join(OUT_DIR, sid)),
              f"{name} {t.get('trialId')}: missing image {sid}")
        if name == "transfer":
            check(t.get("transferType") in {"near", "far"},
                  f"transfer {t.get('trialId')}: invalid transferType")

# Balance checks
with open(BASE_PATH, encoding="utf-8") as f:
    b_trials = json.load(f)["trials"]
b_acc = sum(1 for t in b_trials if t["integrity"] == "accurate")
b_mis = sum(1 for t in b_trials if t["integrity"] == "misleading")
check(b_acc == 4 and b_mis == 4, f"baseline balance: {b_acc} accurate / {b_mis} misleading (expected 4/4)")

with open(TRANS_PATH, encoding="utf-8") as f:
    t_trials = json.load(f)["trials"]
t_acc = sum(1 for t in t_trials if t["integrity"] == "accurate")
t_mis = sum(1 for t in t_trials if t["integrity"] == "misleading")
t_far = sum(1 for t in t_trials if t["transferType"] == "far")
check(t_acc == 8 and t_mis == 8, f"transfer balance: {t_acc} accurate / {t_mis} misleading (expected 8/8)")
check(t_far == 4, f"transfer far trials: {t_far} (expected 4)")

print(f"Pairs: {len(pairs)}")
print(f"Stimuli: {len(stimulus_ids)}")
print(f"Baseline trials: {len(b_trials)} ({b_acc} acc / {b_mis} mis)")
print(f"Transfer trials: {len(t_trials)} ({t_acc} acc / {t_mis} mis, {t_far} far)")
print(f"Errors: {len(errors)}")
print(f"Warnings: {len(warnings)}")

if warnings:
    for w in warnings:
        print(f"  WARN: {w}")
if errors:
    for e in errors:
        print(f"  ERROR: {e}")
    sys.exit(1)

print("OK: stimulus set valid.")
sys.exit(0)
