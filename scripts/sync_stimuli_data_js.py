#!/usr/bin/env python3
"""Sync study/data/stimuli-data.js from the source JSONs without regenerating SVGs.

Rebuilds all four globals: MISVIS_VERIFY_STIMULI, MISVIS_VERIFY_BASELINE,
MISVIS_VERIFY_TRANSFER, MISVIS_VERIFY_STIMULUS_MAP.
"""

import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STIMULI_JSON = os.path.join(ROOT, "study", "data", "stimuli.json")
BASELINE_JSON = os.path.join(ROOT, "study", "data", "baseline.json")
TRANSFER_JSON = os.path.join(ROOT, "study", "data", "transfer.json")
MAP_JSON = os.path.join(ROOT, "study", "data", "stimulus_map.json")
JS_PATH = os.path.join(ROOT, "study", "data", "stimuli-data.js")


def main():
    with open(STIMULI_JSON, "r", encoding="utf-8") as f:
        stimuli = json.load(f)
    with open(BASELINE_JSON, "r", encoding="utf-8") as f:
        baseline = json.load(f)
    with open(TRANSFER_JSON, "r", encoding="utf-8") as f:
        transfer = json.load(f)
    with open(MAP_JSON, "r", encoding="utf-8") as f:
        mapping = json.load(f)

    with open(JS_PATH, "w", encoding="utf-8") as f:
        f.write("window.MISVIS_VERIFY_STIMULI = ")
        f.write(json.dumps(stimuli, ensure_ascii=False, indent=2))
        f.write(";\n\nwindow.MISVIS_VERIFY_BASELINE = ")
        f.write(json.dumps(baseline, ensure_ascii=False, indent=2))
        f.write(";\n\nwindow.MISVIS_VERIFY_TRANSFER = ")
        f.write(json.dumps(transfer, ensure_ascii=False, indent=2))
        f.write(";\n\nwindow.MISVIS_VERIFY_STIMULUS_MAP = ")
        f.write(json.dumps(mapping, ensure_ascii=False, indent=2))
        f.write(";\n")

    print(f"Synced {JS_PATH}")


if __name__ == "__main__":
    main()
