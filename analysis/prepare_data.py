#!/usr/bin/env python3
"""Convert MisVis Verify participant JSON exports to analysis-ready CSVs.

Usage:
  python analysis/prepare_data.py <input> [--outdir DIR]

<input> may be a single JSON file or a directory of JSON files.

Outputs (in --outdir, default analysis/sample_output):
  trials.csv
  participants.csv
  validation_report.txt
"""

import argparse
import csv
import json
import os
import re
import sys

PARTICIPANT_RE = re.compile(r"^MV-[0-9a-f]{8}$")
VALID_CONDITIONS = {"control", "egvv"}
VALID_LISTS = {"A", "B", "C", "D"}
VALID_INTEGRITY = {"accurate", "misleading"}
VALID_MISLEADING = {"yes", "no", "unsure"}
VALID_PHASES = {"baseline", "main", "transfer"}

TRIAL_FIELDS = [
    "participant_id", "condition", "counterbalance_list", "phase",
    "trial_index", "trial_index_global", "pair_id", "stimulus_id",
    "mechanism", "integrity", "provenance_condition", "ai_attitude", "transfer_type",
    "trust_pre", "misleading_pre", "confidence_pre",
    "trust_post", "misleading_post", "confidence_post",
    "initial_response_time_ms", "intervention_time_ms",
    "locate_time_ms", "explain_time_ms", "verify_time_ms", "compare_time_ms",
    "trial_total_time_ms",
    "detection_correct", "false_positive", "false_negative", "belief_revision",
]

PARTICIPANT_FIELDS = [
    "participant_id", "session_id", "condition", "counterbalance_list",
    "started_at", "completed_at", "completed", "mode",
    "viewport_width", "viewport_height",
    "questionnaire_checks", "ai_influence", "egvv_help", "egvv_burden",
    "strategy", "pilot_feedback",
]


def load_input(path):
    """Return a list of participant JSON dicts."""
    if os.path.isfile(path):
        return [json.load(open(path, encoding="utf-8"))]
    docs = []
    for fn in sorted(os.listdir(path)):
        if fn.endswith(".json"):
            docs.append(json.load(open(os.path.join(path, fn), encoding="utf-8")))
    return docs


def derived(t):
    mis = t.get("misleading_post") if t.get("misleading_post") is not None else t.get("misleading_pre")
    integrity = t.get("integrity")
    if integrity == "accurate":
        correct = mis == "no"
    elif integrity == "misleading":
        correct = mis == "yes"
    else:
        correct = False
    false_positive = integrity == "accurate" and mis == "yes"
    false_negative = integrity == "misleading" and mis != "yes"

    trust_pre = t.get("trust_pre")
    trust_post = t.get("trust_post")
    revision = (trust_post - trust_pre) if (trust_pre is not None and trust_post is not None) else None

    return {
        "detection_correct": bool(correct) if mis is not None else None,
        "false_positive": bool(false_positive) if mis is not None else None,
        "false_negative": bool(false_negative) if mis is not None else None,
        "belief_revision": revision,
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--outdir", default=None)
    args = ap.parse_args()

    outdir = args.outdir or os.path.join(os.path.dirname(os.path.abspath(__file__)), "sample_output")
    os.makedirs(outdir, exist_ok=True)

    docs = load_input(args.input)
    if not docs:
        print("No JSON files found.")
        sys.exit(1)

    report = []
    trials_rows = []
    participants_rows = []
    duplicate_trials = 0
    incomplete_sessions = 0
    total_expected_trials = 0
    total_actual_trials = 0

    for doc in docs:
        session = doc.get("session", {})
        trials = doc.get("trials", [])
        seen_global = set()
        participant_duplicates = 0

        pid = session.get("participant_id", "")
        if not PARTICIPANT_RE.match(pid):
            report.append(f"[WARN] invalid participant_id: {pid}")

        cond = session.get("condition")
        if cond not in VALID_CONDITIONS:
            report.append(f"[WARN] {pid}: invalid condition {cond}")

        lst = session.get("counterbalance_list")
        if lst not in VALID_LISTS:
            report.append(f"[WARN] {pid}: invalid counterbalance_list {lst}")

        if not session.get("completed"):
            incomplete_sessions += 1
            report.append(f"[WARN] {pid}: incomplete session")
        else:
            total_expected_trials += 44

        q = session.get("questionnaire") or {}
        participants_rows.append({
            "participant_id": pid,
            "session_id": session.get("session_id", ""),
            "condition": cond,
            "counterbalance_list": lst,
            "started_at": session.get("started_at", ""),
            "completed_at": session.get("completed_at", ""),
            "completed": session.get("completed", False),
            "mode": session.get("mode", ""),
            "viewport_width": session.get("viewport_width", ""),
            "viewport_height": session.get("viewport_height", ""),
            "questionnaire_checks": ";".join(q.get("checks", []) or []),
            "ai_influence": q.get("ai_influence", ""),
            "egvv_help": q.get("egvv_help", ""),
            "egvv_burden": q.get("egvv_burden", ""),
            "strategy": q.get("strategy", ""),
            "pilot_feedback": session.get("pilot_feedback", ""),
        })

        for t in trials:
            t = dict(t)
            t["condition"] = cond
            t["counterbalance_list"] = lst

            g = t.get("trial_index_global")
            if g in seen_global:
                participant_duplicates += 1
                report.append(f"[WARN] {pid}: duplicate trial_index_global {g}")
            seen_global.add(g)

            # value checks
            for field in ("trust_pre", "trust_post", "confidence_pre", "confidence_post"):
                v = t.get(field)
                if v is not None and not (0 <= v <= 100):
                    report.append(f"[WARN] {pid} trial {g}: {field}={v} out of range")

            for field in ("initial_response_time_ms", "trial_total_time_ms"):
                v = t.get(field)
                if v is not None and v <= 0:
                    report.append(f"[WARN] {pid} trial {g}: {field}={v} <= 0")

            if t.get("phase") not in VALID_PHASES:
                report.append(f"[WARN] {pid} trial {g}: invalid phase {t.get('phase')}")

            if t.get("integrity") not in VALID_INTEGRITY:
                report.append(f"[WARN] {pid} trial {g}: invalid integrity {t.get('integrity')}")

            for field in ("misleading_pre", "misleading_post"):
                v = t.get(field)
                if v is not None and v not in VALID_MISLEADING:
                    report.append(f"[WARN] {pid} trial {g}: invalid {field}={v}")

            t.update(derived(t))
            trials_rows.append({k: t.get(k) for k in TRIAL_FIELDS})

        duplicate_trials += participant_duplicates
        total_actual_trials += len(trials)

    # write CSVs
    with open(os.path.join(outdir, "trials.csv"), "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=TRIAL_FIELDS)
        w.writeheader()
        w.writerows(trials_rows)

    with open(os.path.join(outdir, "participants.csv"), "w", newline="", encoding="utf-8-sig") as f:
        w = csv.DictWriter(f, fieldnames=PARTICIPANT_FIELDS)
        w.writeheader()
        w.writerows(participants_rows)

    # validation report
    total_trials = len(trials_rows)
    missing_trials = max(0, total_expected_trials - total_actual_trials)

    lines = [
        "MisVis Verify — Data Validation Report",
        "=" * 40,
        f"Participants: {len(docs)}",
        f"Trials: {total_trials}",
        f"Expected trials (complete sessions only): {total_expected_trials}",
        f"Incomplete sessions: {incomplete_sessions}",
        f"Duplicate trials: {duplicate_trials}",
        f"Missing trials: {missing_trials}",
        f"Warnings: {len(report)}",
        "",
    ]
    if report:
        lines.append("Details:")
        lines.extend(report)
    else:
        lines.append("No warnings.")
    lines.append("")
    lines.append("NOTE: no data rows were dropped. Review warnings and decide exclusions manually.")

    with open(os.path.join(outdir, "validation_report.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print(f"Wrote {total_trials} trial rows and {len(participants_rows)} participant rows to {outdir}")
    print(f"Validation: {len(report)} warnings, {incomplete_sessions} incomplete, "
          f"{duplicate_trials} duplicate, {missing_trials} missing trials")


if __name__ == "__main__":
    main()
