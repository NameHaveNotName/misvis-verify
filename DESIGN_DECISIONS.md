# MisVis Verify: Design Decisions

**Status:** Resolved by literature review + experimental logic. Subject to pilot revision.

---

## D1. AI provenance label placement

**Decision:** Place the label immediately above the chart title, in a neutral gray caption bar.

**Rationale:**
- Feng et al. (2023) tested multiple placements and found effects depend on salience. A caption bar is salient enough to be noticed but does not dominate the visual field.
- Keeping the label spatially close to the chart ties it to the stimulus rather than to the page as a whole.
- Neutral gray avoids the warning-red valence that could confound "AI-assisted" with "suspicious."
- Layout consistency between AI and No-Provenance trials is preserved: the No-Provenance condition shows an empty caption bar of the same height.

**Measurement implication:** Add a manipulation check asking participants what "AI-assisted visualization" meant to them.

---

## D2. Should EGVV appear for accurate charts or only misleading ones?

**Decision:** EGVV appears for both accurate and misleading charts, with content tailored to each.

**Rationale:**
- If EGVV only follows misleading charts, participants quickly learn that "EGVV trial = suspicious chart." This creates a demand characteristic and inflates false positives on accurate charts.
- For accurate charts, EGVV guides participants through a *verification* procedure that confirms the chart is faithful: Locate the axis → Explain why the encoding is appropriate → Verify key values → Compare with an alternative faithful view.
- This mirrors real-world visual fact-checking, where the goal is not to find problems but to confirm that the visual evidence supports the claim.
- The content differs, but the structure (Locate → Explain → Verify → Compare) stays identical, so the procedure itself remains learnable.

**Concrete example for accurate truncated-axis pair:**
- Locate: "Check the vertical axis. Where does it start?"
- Explain: "Bar charts rely on a common baseline, usually zero, so lengths are proportional to values."
- Verify: "A = 92, B = 83. The difference is 9 units."
- Compare: Show the same chart with an alternative neutral title or a second faithful encoding.

**Concrete example for misleading truncated-axis pair:**
- Locate: "Check the vertical axis. Where does it start?"
- Explain: "Bar charts rely on a common baseline. Changing the baseline can make small differences look large."
- Verify: "A = 92, B = 83. The actual difference is 9 units."
- Compare: Show a version with the axis restored to zero.

---

## D3. Misleading judgment response scale

**Decision:** Keep three response options: Yes / No / Unsure.

**Primary analysis:**
- Accurate chart + "No" = correct
- Misleading chart + "Yes" = correct
- Unsure = incorrect in the main model

**Sensitivity analysis:**
- Analyze Unsure as a separate category to check for response avoidance.
- Report false-positive rate (accurate judged misleading) and false-negative rate (misleading judged not misleading) separately.

**Rationale:**
- A 7-point Likert scale is common in the misinformation literature, but it complicates the definition of "detection accuracy."
- Binary + Unsure is easier for participants, maps directly to trust calibration, and matches the legal/ethical framing of "do you believe this chart is misleading?"
- Recording Unsure separately preserves information without complicating the primary model.

---

## D4. Control condition design

**Decision:** Keep the minimal 3-second passive re-inspection prompt.

**Rationale:**
- The control condition should be the weakest plausible intervention that still asks participants to look again.
- A textual warning ("This chart may be misleading") would blur the line between control and intervention.
- A corrected chart (Wijnker et al.'s strongest condition) would be an active intervention, not a control.
- The 3-second delay prevents participants from clicking through instantly while still allowing them to decide what to examine.
- If pilot data show the control is too weak to produce any pre-post change, we can add a generic "check axes, title, labels, and encoding" prompt without giving mechanism-specific guidance.

---

## D5. Number of open-response items

**Decision:** One optional open-response item at the end of the post-study questionnaire.

**Prompt:** "In your own words, what strategy did you use to decide whether a chart was trustworthy?"

**Rationale:**
- Multiple open responses increase attrition and complicate analysis.
- A single item captures self-reported strategy use, which can be coded to check whether EGVV participants mention evidence-based checks (axes, values, titles) more often than controls.
- Optional wording reduces perceived burden.

---

## D6. AI provenance label wording

**Decision:** Use "AI-assisted visualization" consistently.

**Rationale:**
- The experiment plan already specifies this wording; the literature review confirms it is the safest choice.
- "AI-generated" may imply the chart is fabricated; "AI-assisted" reflects that AI tools helped produce or refine a visualization based on data.
- Because all stimuli are in fact generated with code (and can plausibly be described as AI-assisted), the label is technically truthful and avoids a deception-by-source issue.

---

## D7. Handling Unsure in trust and confidence sliders

**Decision:** Sliders must be moved before continuing; there is no "Unsure" option on the slider.

**Rationale:**
- Forcing a numeric response on a 0–100 scale yields richer data than a midpoint option.
- The midpoint (50) is explicitly labeled "Uncertain" on the trust slider, giving participants a natural neutral anchor.
- Response time and pre-post change can be analyzed regardless of whether the final value is 50.

---

## D8. Whether to include attention checks

**Decision:** Include two lightweight attention checks embedded in trials.

**Rationale:**
- Online experiments benefit from attention checks, but heavy-handed checks can annoy participants.
- One check asks participants to click a specific response option (e.g., "Select 'No' here") in a masked way.
- A second check asks a question whose answer is visually obvious from the chart (e.g., "Which bar is taller, A or B?").
- These are excluded from primary analyses but used to flag careless responders in sensitivity analyses.

---

## D9. Pilot sample size target

**Decision:** Target N = 24–30 for the first pilot (12 Control, 12 EGVV).

**Rationale:**
- The goal of the pilot is flow debugging, item difficulty, and ceiling/floor checks, not precise effect-size estimation.
- A balanced 12/12 split allows initial comparison of Control vs. EGVV while keeping recruitment manageable.
- After pilot, we will revise the power plan based on observed effect sizes and completion rates.

---

## D10. Data export timing

**Decision:** Export is offered only at the end of the complete session; no mid-study download.

**Rationale:**
- Allowing download mid-study could encourage participants to inspect or edit their data.
- The completion page offers a single JSON download; researchers collect these files manually in the pilot phase.
- Remote storage remains a future adapter, not implemented in V1.
