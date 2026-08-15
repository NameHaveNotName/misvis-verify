# MisVis Verify — Data Analysis Plan

**Version:** study-v0.1  
**Status:** Plan; models to be specified after pilot.

---

## 1. Data flow

```text
Participant browser
        ↓
misvis-study-MVXXXXXXXX.json
        ↓
analysis/prepare_data.py
        ↓
trials.csv + participants.csv + validation_report.txt
        ↓
analysis.R
        ↓
Results / figures / tables
```

---

## 2. Data preprocessing

### 2.1 Input

One JSON file per participant, exported from `study.html`.

### 2.2 `prepare_data.py` steps

1. Load all JSON files from a directory.
2. Validate each file against `study/data/schema.md`.
3. Combine `session` objects into `participants.csv`.
4. Combine `trials` arrays into `trials.csv` (long format).
5. Compute derived variables:
   - `detection_correct`
   - `false_positive`
   - `false_negative`
   - `belief_revision`
6. Generate `validation_report.txt` listing:
   - Total participants
   - Incomplete sessions
   - Duplicate trials
   - Missing trials
   - Out-of-range values
   - Negative RTs
   - Attention-check failures (if implemented)
7. Do **not** automatically drop rows; flag them for researcher review.

---

## 3. Exclusion criteria

Define before analysis:

1. **Incomplete session:** Participant did not reach completion screen.
2. **Extremely fast responder:** Median trial RT < 2 seconds across main trials.
3. **All-same responses:** Trust or confidence slider set to the same value for >80% of trials.
4. **Failed attention checks:** Both attention checks incorrect (if implemented).
5. **Mobile viewport:** viewport_width < 800 px.

Report the number and proportion of excluded participants in the paper.

---

## 4. Primary analyses

### 4.1 RQ1: Effect of AI provenance on trust and discernment

**Model for trust:**

```r
library(lme4)
model_trust <- lmer(trust_pre ~ provenance_condition * integrity +
                    (1 | participant_id) + (1 | stimulus_id),
                    data = trials_main)
```

**Model for detection accuracy:**

```r
model_acc <- glmer(detection_correct ~ provenance_condition * integrity +
                   (1 | participant_id) + (1 | stimulus_id),
                   family = binomial,
                   data = trials_main)
```

**Interpretation:**
- If provenance reduces trust for both accurate and misleading charts equally → general skepticism (supports H1 and H2).
- If provenance reduces trust more for misleading than accurate → improved discernment.

### 4.2 RQ2: EGVV reduces provenance heuristic and improves calibration

Use the full 2×2×2 design on main trials:

```r
model_trust2 <- lmer(trust_pre ~ provenance_condition * integrity * condition +
                     (1 | participant_id) + (1 | stimulus_id),
                     data = trials_main)

model_acc2 <- glmer(detection_correct ~ provenance_condition * integrity * condition +
                    (1 | participant_id) + (1 | stimulus_id),
                    family = binomial,
                    data = trials_main)
```

Also test belief revision:

```r
model_revision <- lmer(belief_revision ~ integrity * condition +
                       (1 | participant_id) + (1 | stimulus_id),
                       data = trials_main)
```

**Interpretation:**
- If EGVV increases the Provenance × Integrity interaction → evidence verification moderates source heuristic.
- If EGVV increases trust_discernment → supports H3.

### 4.3 RQ3: Transfer to unseen charts

Use transfer trials only:

```r
model_transfer_acc <- glmer(detection_correct ~ integrity * condition +
                            (1 | participant_id) + (1 | stimulus_id),
                            family = binomial,
                            data = trials_transfer)

model_transfer_trust <- lmer(trust_pre ~ integrity * condition +
                             (1 | participant_id) + (1 | stimulus_id),
                             data = trials_transfer)
```

**Interpretation:**
- If condition effect persists without provenance cues and without EGVV assistance → supports H4 (transfer).

---

## 5. Secondary / exploratory analyses

### 5.1 Mechanism-specific effects

Split by `mechanism` to see which misleader types are most affected by EGVV:

```r
model_by_mechanism <- glmer(detection_correct ~ integrity * condition * mechanism +
                            (1 | participant_id) + (1 | stimulus_id),
                            family = binomial,
                            data = trials_main)
```

### 5.2 Response time

```r
model_rt <- lmer(log(initial_response_time_ms) ~ phase * condition +
                 (1 | participant_id),
                 data = trials)
```

### 5.3 EGVV step times

Analyze whether longer time on Verify/Compare predicts better post judgment.

### 5.4 Far-transfer exploratory analysis

Label 2 transfer trials as `exploratory`. Analyze separately and report as exploratory, not confirmatory.

### 5.5 Self-reported strategy

Code open responses into categories:
- Axis/baseline checking
- Value/label checking
- Title checking
- Source checking
- Uncertainty checking
- Generic / vague

Compare frequency distributions between Control and EGVV groups.

---

## 6. Visualization

Produce the following figures:

1. **Trust by condition and integrity:** Grouped bar chart with error bars.
2. **Discernment score by condition:** Boxplot or violin plot of `trust_discernment_p`.
3. **Belief revision density:** Histogram of `belief_revision` split by integrity and condition.
4. **Detection accuracy heatmap:** Provenance × Integrity × Intervention.
5. **Transfer performance:** Accuracy by condition and integrity in transfer phase.
6. **RT by phase:** Boxplot of trial RT across phases.

---

## 7. Reporting standards

- Pre-register hypotheses and analysis plan before main data collection.
- Report all exclusions and model specifications.
- Report Bayes factors or confidence intervals where appropriate.
- Distinguish confirmatory analyses (main + transfer) from exploratory analyses (mechanism-specific, far-transfer, strategy coding).
