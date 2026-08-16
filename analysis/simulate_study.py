#!/usr/bin/env python3
"""Simulate the MisVis Verify study and produce summary statistics for the paper draft.

This generates a synthetic dataset (N=200) whose data-generating process encodes the
preregistered hypotheses (H1-H4) with realistic effect sizes, then computes the
descriptive and inferential statistics reported in the Results section of the paper.

IMPORTANT: All numbers produced here are PLACEHOLDERS derived from synthetic data.
They must be replaced with results from real collected data before submission.

Usage: python analysis/simulate_study.py
"""
import numpy as np
from scipy import stats

rng = np.random.default_rng(20260816)
N = 200  # 100 control, 100 egvv
n_base = 8
n_main = 20
n_trans = 16

# --- effect parameters (encoded hypotheses) ---
TRUST_ACC = 62.0
TRUST_MIS = 56.0
PROV_EFFECT = -7.0          # H1: AI label lowers trust
SD_TRUST = 14.0

EGVV_MIS_DROP = 18.0        # H3: EGVV selectively lowers misleading trust (post)
CTRL_MIS_DROP = 3.0
EGVV_ACC_GAIN = 2.0
CTRL_ACC_GAIN = 0.5

P_DET_ACC = 0.72            # detection accuracy for accurate charts
P_DET_MIS = 0.55            # detection accuracy for misleading charts
EGVV_DET_MIS_GAIN = 0.27    # H3/H4: EGVV raises misleading detection
EGVV_TRANS_MIS_GAIN = 0.17  # H4: transfer, smaller than assisted gain
EGVV_ACC_GAIN_DET = 0.06    # small accuracy improvement without false positives


def clip(v, lo=0, hi=100):
    return np.clip(v, lo, hi)


def run():
    rows = []
    for i in range(N):
        cond = "egvv" if i < N // 2 else "control"
        for b in range(n_base):
            integ = "accurate" if b % 2 == 0 else "misleading"
            p = P_DET_ACC if integ == "accurate" else P_DET_MIS
            rows.append(dict(phase="baseline", cond=cond, integrity=integ,
                             prov="none", trust=TRUST_ACC if integ == "accurate" else TRUST_MIS,
                             det=float(rng.random() < p)))
        for m in range(n_main):
            integ = "accurate" if m % 2 == 0 else "misleading"
            prov = "ai" if (m // 2) % 2 == 0 else "none"
            trust_pre = (TRUST_ACC if integ == "accurate" else TRUST_MIS) + \
                        (PROV_EFFECT if prov == "ai" else 0.0) + rng.normal(0, SD_TRUST)
            # detection pre (no provenance effect on detection; H2)
            p_pre = P_DET_ACC if integ == "accurate" else P_DET_MIS
            det_pre = float(rng.random() < p_pre)
            # post intervention
            if integ == "misleading":
                trust_post = trust_pre - (EGVV_MIS_DROP if cond == "egvv" else CTRL_MIS_DROP) + rng.normal(0, SD_TRUST)
                p_post = p_pre + (EGVV_DET_MIS_GAIN if cond == "egvv" else 0.03)
            else:
                trust_post = trust_pre + (EGVV_ACC_GAIN if cond == "egvv" else CTRL_ACC_GAIN) + rng.normal(0, SD_TRUST)
                p_post = p_pre + (EGVV_ACC_GAIN_DET if cond == "egvv" else 0.01)
            det_post = float(rng.random() < p_post)
            rows.append(dict(phase="main", cond=cond, integrity=integ, prov=prov,
                             trust_pre=clip(trust_pre), trust_post=clip(trust_post),
                             det_pre=det_pre, det_post=det_post))
        for t in range(n_trans):
            integ = "accurate" if t % 2 == 0 else "misleading"
            p = P_DET_ACC if integ == "accurate" else P_DET_MIS
            if integ == "misleading" and cond == "egvv":
                p += EGVV_TRANS_MIS_GAIN
            if integ == "accurate" and cond == "egvv":
                p += EGVV_ACC_GAIN_DET
            rows.append(dict(phase="transfer", cond=cond, integrity=integ,
                             prov="none", trust=TRUST_ACC if integ == "accurate" else TRUST_MIS,
                             det=float(rng.random() < p)))
    return rows


def mean_se(xs):
    xs = np.asarray(xs, dtype=float)
    return xs.mean(), xs.std(ddof=1) / np.sqrt(len(xs))


def ttest(a, b):
    t, p = stats.ttest_ind(a, b, equal_var=False)
    return t, p


def chi2_det(g1, g2):
    """g1, g2 are lists of 0/1 detection outcomes; returns (chi2, p)."""
    n1, n0 = len(g1), len(g2)
    c1, c0 = int(sum(g1)), int(sum(g2))
    table = [[c1, n1 - c1], [c0, n0 - c0]]
    chi2, p, _, _ = stats.chi2_contingency(table, correction=False)
    return chi2, p


def main():
    rows = run()
    print("=" * 70)
    print("SIMULATED RESULTS (PLACEHOLDER — replace with real data)")
    print("=" * 70)

    def grp(phase=None, cond=None, integrity=None, prov=None):
        return [r for r in rows
                if (phase is None or r["phase"] == phase)
                and (cond is None or r["cond"] == cond)
                and (integrity is None or r["integrity"] == integrity)
                and (prov is None or r["prov"] == prov)]

    # 1. Baseline
    print("\n## 1. Baseline detection accuracy")
    for integ in ("accurate", "misleading"):
        g = grp("baseline", integrity=integ)
        m, se = mean_se([r["det"] for r in g])
        print(f"   {integ}: M={m:.3f}, SE={se:.3f}, n={len(g)}")

    # 2. Main pre: provenance effect on trust (H1)
    print("\n## 2. Main pre trust (H1: provenance lowers trust)")
    for integ in ("accurate", "misleading"):
        ai = grp("main", integrity=integ, prov="ai")
        no = grp("main", integrity=integ, prov="none")
        m_ai, se_ai = mean_se([r["trust_pre"] for r in ai])
        m_no, se_no = mean_se([r["trust_pre"] for r in no])
        t, p = ttest([r["trust_pre"] for r in ai], [r["trust_pre"] for r in no])
        print(f"   {integ}: AI M={m_ai:.2f} (SE={se_ai:.2f}) vs none M={m_no:.2f} (SE={se_no:.2f}), t={t:.2f}, p={p:.4f}")

    # discernment pre
    acc = grp("main", integrity="accurate")
    mis = grp("main", integrity="misleading")
    disc_pre = np.mean([r["trust_pre"] for r in acc]) - np.mean([r["trust_pre"] for r in mis])
    print(f"   Pre discernment (acc - mis): {disc_pre:.2f}")

    # 3. Main pre detection by provenance (H2)
    print("\n## 3. Main pre detection (H2: provenance does NOT improve discernment)")
    for prov in ("ai", "none"):
        for integ in ("accurate", "misleading"):
            g = grp("main", integrity=integ, prov=prov)
            m, se = mean_se([r["det_pre"] for r in g])
            print(f"   {prov}/{integ}: M={m:.3f}, SE={se:.3f}")

    # 4. Main post trust + belief revision (H3)
    print("\n## 4. Main post trust & belief revision (H3: EGVV improves calibration)")
    for cond in ("egvv", "control"):
        for integ in ("accurate", "misleading"):
            g = grp("main", cond=cond, integrity=integ)
            m_pre, se_pre = mean_se([r["trust_pre"] for r in g])
            m_post, se_post = mean_se([r["trust_post"] for r in g])
            rev = [r["trust_post"] - r["trust_pre"] for r in g]
            m_rev, se_rev = mean_se(rev)
            print(f"   {cond}/{integ}: pre={m_pre:.2f} post={m_post:.2f} rev={m_rev:+.2f} (SE={se_rev:.2f})")

    # belief revision t-test (misleading, egvv vs control)
    egvv_mis = grp("main", cond="egvv", integrity="misleading")
    ctrl_mis = grp("main", cond="control", integrity="misleading")
    t, p = ttest([r["trust_post"] - r["trust_pre"] for r in egvv_mis],
                 [r["trust_post"] - r["trust_pre"] for r in ctrl_mis])
    print(f"   Belief revision (misleading) egvv vs control: t={t:.2f}, p={p:.4f}")

    # post discernment
    for cond in ("egvv", "control"):
        acc = grp("main", cond=cond, integrity="accurate")
        mis = grp("main", cond=cond, integrity="misleading")
        d = np.mean([r["trust_post"] for r in acc]) - np.mean([r["trust_post"] for r in mis])
        print(f"   Post discernment {cond}: {d:.2f}")

    # 5. Main post detection (H3)
    print("\n## 5. Main post detection (H3)")
    for cond in ("egvv", "control"):
        for integ in ("accurate", "misleading"):
            g = grp("main", cond=cond, integrity=integ)
            m, se = mean_se([r["det_post"] for r in g])
            print(f"   {cond}/{integ}: M={m:.3f}, SE={se:.3f}")
    chi2, p = chi2_det([r["det_post"] for r in grp("main", cond="egvv", integrity="misleading")],
                       [r["det_post"] for r in grp("main", cond="control", integrity="misleading")])
    print(f"   Misleading detection egvv vs control: chi2={chi2:.2f}, p={p:.4f}")

    # 6. Transfer detection (H4)
    print("\n## 6. Transfer detection (H4)")
    for cond in ("egvv", "control"):
        for integ in ("accurate", "misleading"):
            g = grp("transfer", cond=cond, integrity=integ)
            m, se = mean_se([r["det"] for r in g])
            print(f"   {cond}/{integ}: M={m:.3f}, SE={se:.3f}")
    chi2, p = chi2_det([r["det"] for r in grp("transfer", cond="egvv", integrity="misleading")],
                       [r["det"] for r in grp("transfer", cond="control", integrity="misleading")])
    print(f"   Transfer misleading detection egvv vs control: chi2={chi2:.2f}, p={p:.4f}")

    print("\n" + "=" * 70)
    print("END — all numbers are synthetic placeholders")


if __name__ == "__main__":
    main()
