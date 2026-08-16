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

---

## D11. AI interpretation panel (operationalizing provenance cue content)

**Decision:** For `ai-assisted` trials, show an "AI 解读" card below the provenance label containing an AI-styled interpretive statement, with 2 pre-written variants per pair × integrity (neutral / authoritative / enthusiastic / confident tones; status wording; confidence percentage). A variant is randomly selected per trial via the seeded RNG.

**Rationale:**
- A bare "AI-assisted visualization" label is a weak cue. Adding interpretive content turns the provenance manipulation into a substantive inducement: for accurate charts the AI confirms the chart, for misleading charts the AI reinforces the misleading reading.
- Pre-written variants keep full experimental control (no live LLM variability or API cost) while tone/status variation increases ecological validity.
- Variant assignment is seeded, so analyses can recover which variant each participant saw from `session.trialPlan[].ai_interpretation`.
- Debriefing must disclose that AI interpretations were scripted study materials.

---

## D12. Expanded stimulus set

**Decision:** Main phase expanded from 12 to 20 matched pairs by adding four mechanisms: `missing-normalization` (raw counts vs. base-rate metrics, MN-01/MN-02), `overusing-colors` (sequential vs. rainbow palettes, OC-01/OC-02), `inappropriate-scale` (linear scale on exponential data, IS-01/IS-02), `3d-bar-distortion` (3D perspective bars distorting height perception, TD-01), and `inconsistent-tick-labels` (non-uniform tick spacing distorting slope, IT-01). Baseline expanded from 6 to 8 by adding `histogram-reading` (B-07) and `pie-proportion` (B-08). Transfer expanded from 8 to 16 by adding `inverted-axis` (T-11), `misordered-axis` (T-12), `premature-conclusion` (T-13, T-15), and `missing-normalization-map` (T-14, T-16), balancing the set at 8 accurate / 8 misleading with 4 far-transfer items.

**Rationale:**
- Broader mechanism coverage reduces item-specific effects and matches the taxonomy breadth of Lo et al. (2022) and the flawviz corpus.
- 20 main pairs preserve the 4-cell Latin-square rotation (5 trials per cell per list) and keep list balance at 10 accurate / 10 misleading.
- The final study has 8 baseline + 20 main + 16 transfer = 44 participant-facing trials.
- Added participant time is acceptable for pilot; watch completion time and fatigue markers.
