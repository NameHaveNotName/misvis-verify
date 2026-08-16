#!/usr/bin/env python3
"""Simple descriptive analysis of the existing pilot/synthetic data.

Reads analysis/sample_output/trials.csv (produced by prepare_data.py from the
existing participant JSON files) and prints descriptive statistics. This is the
honest, small-sample analysis used in the paper draft as a placeholder.

Usage: python analysis/simple_analysis.py
"""
import csv
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "analysis", "sample_output", "trials.csv")


def load():
    rows = list(csv.DictReader(open(CSV, encoding="utf-8-sig")))
    return rows


def grp(rows, phase=None, cond=None, integrity=None, prov=None):
    out = []
    for r in rows:
        if phase and r["phase"] != phase:
            continue
        if cond and r["condition"] != cond:
            continue
        if integrity and r["integrity"] != integrity:
            continue
        if prov is not None and r["provenance_condition"] != prov:
            continue
        out.append(r)
    return out


def tof(v):
    if v in (None, "", "None"):
        return None
    if isinstance(v, str) and v.lower() == "true":
        return 1.0
    if isinstance(v, str) and v.lower() == "false":
        return 0.0
    return float(v)


def mean(xs):
    vals = [tof(x) for x in xs]
    vals = [x for x in vals if x is not None]
    return sum(vals) / len(vals) if vals else float("nan")


def n(xs):
    return len(xs)


def main():
    rows = load()
    print("=" * 66)
    print("EXISTING DATA (10 synthetic participants — pipeline test data)")
    print("=" * 66)
    print("participants =", len(set(r["participant_id"] for r in rows)),
          "| trials =", len(rows))

    print("\n## 1. Baseline detection (integrity)")
    for integ in ("accurate", "misleading"):
        g = grp(rows, "baseline", integrity=integ)
        print("   {}: {:.3f} (n={})".format(integ, mean([r["detection_correct"] for r in g]), n(g)))

    print("\n## 2. Main PRE trust (provenance x integrity)")
    for integ in ("accurate", "misleading"):
        for prov in ("ai-assisted", "none"):
            g = grp(rows, "main", integrity=integ, prov=prov)
            print("   {}/{}: {:.1f} (n={})".format(integ, prov, mean([r["trust_pre"] for r in g]), n(g)))

    print("\n## 3. Main PRE detection (provenance x integrity)")
    for integ in ("accurate", "misleading"):
        for prov in ("ai-assisted", "none"):
            g = grp(rows, "main", integrity=integ, prov=prov)
            print("   {}/{}: {:.3f} (n={})".format(integ, prov, mean([r["detection_correct"] for r in g]), n(g)))

    print("\n## 4. Main POST trust & belief revision (condition x integrity)")
    for cond in ("egvv", "control"):
        for integ in ("accurate", "misleading"):
            g = grp(rows, "main", cond=cond, integrity=integ)
            print("   {}/{}: pre={:.1f} post={:.1f} rev={:+.1f} (n={})".format(
                cond, integ,
                mean([r["trust_pre"] for r in g]),
                mean([r["trust_post"] for r in g]),
                mean([r["belief_revision"] for r in g]),
                n(g)))

    print("\n## 5. Main POST detection (condition x integrity)")
    for cond in ("egvv", "control"):
        for integ in ("accurate", "misleading"):
            g = grp(rows, "main", cond=cond, integrity=integ)
            correct = 0
            tot = 0
            for r in g:
                mis = r["misleading_post"] if r["misleading_post"] not in (None, "", "None") else r["misleading_pre"]
                c = (mis == "no") if integ == "accurate" else (mis == "yes")
                correct += c
                tot += 1
            print("   {}/{}: {:.3f} (n={})".format(cond, integ, correct / tot, tot))

    print("\n## 6. Transfer detection (condition x integrity)")
    for cond in ("egvv", "control"):
        for integ in ("accurate", "misleading"):
            g = grp(rows, "transfer", cond=cond, integrity=integ)
            print("   {}/{}: {:.3f} (n={})".format(cond, integ, mean([r["detection_correct"] for r in g]), n(g)))

    print("\nNOTE: 5 participants per condition; descriptive only, no inferential tests.")


if __name__ == "__main__":
    main()
