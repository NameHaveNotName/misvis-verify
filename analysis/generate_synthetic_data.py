#!/usr/bin/env python3
"""Generate synthetic participant data for testing the analysis pipeline.

Output files are explicitly marked SYNTHETIC TEST DATA and must never be
confused with real participant data.

Usage: python analysis/generate_synthetic_data.py [N] [--outdir DIR]
"""

import json
import os
import random
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STIMULI = json.load(open(os.path.join(ROOT, "study/data/stimuli.json"), encoding="utf-8"))
BASELINE = json.load(open(os.path.join(ROOT, "study/data/baseline.json"), encoding="utf-8"))
TRANSFER = json.load(open(os.path.join(ROOT, "study/data/transfer.json"), encoding="utf-8"))

CELLS = [
    {"integrity": "accurate", "provenance": "ai-assisted"},
    {"integrity": "accurate", "provenance": "none"},
    {"integrity": "misleading", "provenance": "ai-assisted"},
    {"integrity": "misleading", "provenance": "none"},
]


def hash_string(s):
    h = 0
    for c in s:
        h = (h * 31 + ord(c)) & 0xFFFFFFFF
    return h


def build_main(pairs, list_index):
    out = []
    for i, pair in enumerate(pairs):
        cell = CELLS[(i + list_index) % len(CELLS)]
        shown = pair[cell["integrity"]]
        out.append({
            "pair_id": pair["pairId"],
            "stimulus_id": shown["image"],
            "mechanism": pair["mechanism"],
            "integrity": cell["integrity"],
            "provenance_condition": cell["provenance"],
            "title": shown["title"],
            "compare_image": pair["accurate"]["image"],
        })
    return out


def build_phase(trials, phase):
    return [{
        "pair_id": t["trialId"],
        "stimulus_id": t["image"],
        "mechanism": t["mechanism"],
        "integrity": t["integrity"],
        "provenance_condition": None,
        "transfer_type": t.get("transferType"),
        "title": t["title"],
    } for t in trials]


def response_for(integrity, rng):
    """Return (trust_pre, misleading_pre, confidence_pre)."""
    if integrity == "accurate":
        trust = rng.randint(55, 90)
        misleading = rng.choices(["no", "unsure", "yes"], weights=[80, 15, 5])[0]
    else:
        trust = rng.randint(40, 85)
        misleading = rng.choices(["yes", "unsure", "no"], weights=[60, 20, 20])[0]
    confidence = rng.randint(40, 90)
    return trust, misleading, confidence


def generate(n, outdir, seed=42):
    rng = random.Random(seed)
    pairs = STIMULI["pairs"]
    baseline_trials = BASELINE["trials"]
    transfer_trials = TRANSFER["trials"]

    for i in range(n):
        pid = "MV-" + f"{i:08x}"
        cond = "control" if hash_string(pid) % 2 == 0 else "egvv"
        lst = ["A", "B", "C", "D"][hash_string(pid) % 4]
        list_index = {"A": 0, "B": 1, "C": 2, "D": 3}[lst]

        # inject one deliberate issue to exercise validation (participant 7)
        incomplete = (i == 7)

        main = build_main(pairs, list_index)
        rng.shuffle(main)
        base = build_phase(baseline_trials, "baseline")
        rng.shuffle(base)
        trans = build_phase(transfer_trials, "transfer")
        rng.shuffle(trans)

        trials = []
        g = 0

        def add_trial(phase, spec, idx):
            nonlocal g
            trust, mis, conf = response_for(spec["integrity"], rng)
            post_trust = post_mis = post_conf = None
            rt = rng.randint(3000, 15000)

            if phase == "main":
                # post responses (only if not incomplete)
                if not incomplete or idx < 6:
                    if cond == "egvv":
                        if spec["integrity"] == "misleading":
                            post_trust = max(0, trust - rng.randint(15, 45))
                            post_mis = rng.choices(["yes", "yes", "yes", "unsure", "no"], weights=[1, 1, 1, 1, 1])[0] if False else "yes"
                        else:
                            post_trust = min(100, trust + rng.randint(-5, 10))
                            post_mis = "no"
                        post_conf = rng.randint(50, 95)
                    else:
                        if spec["integrity"] == "misleading":
                            post_trust = max(0, trust - rng.randint(0, 15))
                        else:
                            post_trust = min(100, trust + rng.randint(0, 5))
                        post_mis = mis
                        post_conf = rng.randint(40, 90)

            trial = {
                "participant_id": pid,
                "session_id": "S-" + str(1600000000000 + i),
                "phase": phase,
                "trial_index": idx,
                "trial_index_global": g,
                "pair_id": spec["pair_id"],
                "stimulus_id": spec["stimulus_id"],
                "mechanism": spec["mechanism"],
                "integrity": spec["integrity"],
                "provenance_condition": spec.get("provenance_condition"),
                "transfer_type": spec.get("transfer_type"),
                "trust_pre": trust,
                "misleading_pre": mis,
                "confidence_pre": conf,
                "trust_post": post_trust,
                "misleading_post": post_mis,
                "confidence_post": post_conf,
                "initial_response_time_ms": rt,
                "intervention_time_ms": rng.randint(4000, 20000) if phase == "main" else None,
                "locate_time_ms": rng.randint(2000, 6000) if (phase == "main" and cond == "egvv") else None,
                "explain_time_ms": rng.randint(2000, 6000) if (phase == "main" and cond == "egvv") else None,
                "verify_time_ms": rng.randint(2000, 6000) if (phase == "main" and cond == "egvv") else None,
                "compare_time_ms": rng.randint(2000, 6000) if (phase == "main" and cond == "egvv") else None,
                "trial_total_time_ms": rng.randint(8000, 40000),
                "timestamp_start": None,
                "timestamp_end": None,
            }

            # inject one out-of-range value in participant 3
            if i == 3 and g == 5:
                trial["trust_pre"] = 150

            trials.append(trial)
            g += 1

        for idx, spec in enumerate(base):
            add_trial("baseline", spec, idx)
        for idx, spec in enumerate(main):
            add_trial("main", spec, idx)
        for idx, spec in enumerate(trans):
            add_trial("transfer", spec, idx)

        session = {
            "participant_id": pid,
            "session_id": "S-" + str(1600000000000 + i),
            "condition": cond,
            "counterbalance_list": lst,
            "started_at": "2026-08-15T09:00:00.000Z",
            "completed_at": None if incomplete else "2026-08-15T09:18:00.000Z",
            "completed": not incomplete,
            "version": "study-v0.1",
            "stimulus_version": "stimuli-v0.1",
            "schema_version": "schema-v1",
            "consent": True,
            "mode": "pilot",
            "viewport_width": rng.choice([1920, 1440, 1280]),
            "viewport_height": rng.choice([1080, 900, 720]),
            "user_agent": "Synthetic/1.0",
            "questionnaire": {
                "checks": rng.sample(["axis", "values", "title", "color", "data-source"], 3),
                "ai_influence": rng.randint(0, 100),
                "egvv_help": rng.randint(0, 100) if cond == "egvv" else None,
                "egvv_burden": rng.randint(0, 100) if cond == "egvv" else None,
                "strategy": "synthetic strategy note",
            },
            "pilot_feedback": "synthetic feedback",
        }

        doc = {
            "_comment": "SYNTHETIC TEST DATA — NOT REAL PARTICIPANT DATA",
            "session": session,
            "trials": trials,
            "exported_at": "2026-08-15T09:18:00.000Z",
        }

        fn = os.path.join(outdir, f"misvis-study-{pid}.json")
        with open(fn, "w", encoding="utf-8") as f:
            json.dump(doc, f, ensure_ascii=False, indent=2)

    print(f"Generated {n} synthetic participant files in {outdir}")


if __name__ == "__main__":
    n = int(sys.argv[1]) if len(sys.argv) > 1 else 10
    outdir = sys.argv[2] if len(sys.argv) > 2 else os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "sample_output", "synthetic_input")
    os.makedirs(outdir, exist_ok=True)
    generate(n, outdir)
