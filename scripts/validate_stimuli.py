#!/usr/bin/env python3
"""Validate MisVis Verify stimulus set.

Checks:
  - 24 main SVGs exist
  - 12 matched pairs (accurate + misleading each)
  - SVG size 1200x720 consistent
  - unique pair IDs and stimulus IDs
  - annotation coordinates in 0-100
  - all EGVV fields non-empty
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
MAP_PATH = os.path.join(ROOT, "study", "data", "stimulus_map.json")
OUT_DIR = os.path.join(ROOT, "study", "assets", "stimuli")

ALLOWED_MECHANISMS = {
    "truncated-axis",
    "cherry-picked-time",
    "hidden-uncertainty",
    "area-distortion",
    "color-emphasis",
    "misleading-title",
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
check(len(pairs) == 12, f"expected 12 pairs, got {len(pairs)}")

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

check(len(stimulus_ids) == 24, f"expected 24 stimulus IDs, got {len(stimulus_ids)}")
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
    check(len(mapping) == 24, f"mapping has {len(mapping)} entries, expected 24")
    for sid, meta in mapping.items():
        check(meta.get("integrity") in ALLOWED_INTEGRITY,
              f"mapping {sid}: invalid integrity {meta.get('integrity')}")
        check(meta.get("mechanism") in ALLOWED_MECHANISMS,
              f"mapping {sid}: invalid mechanism {meta.get('mechanism')}")
else:
    warnings.append("stimulus_map.json not found")

print(f"Pairs: {len(pairs)}")
print(f"Stimuli: {len(stimulus_ids)}")
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
