# MisVis Verify — Study System README

**Version:** study-v0.2  
**Status:** Ready for formal data collection; 40 main + 8 baseline + 16 transfer controlled SVG stimuli.

---

## 1. What is this?

MisVis Verify is an HCI research module built on top of the MisVis public website. It runs a controlled experiment investigating how AI provenance cues and evidence-grounded visual verification (EGVV) affect trust calibration for data visualizations.

---

## 2. Quick start

1. Open `preview.html` in a browser to see the questionnaire and interface preview.
2. Open `study.html?mode=pilot` to run the pilot experiment locally.
3. Open `study.html?mode=study` to run formal data collection (ethics approval granted).
4. Data is saved in browser `localStorage`, exported as JSON at the end, and optionally auto-submitted to the configured backend (see `SUBMISSION_SETUP.md`).

---

## 3. File map

```
study.html                  # Experiment entry
preview.html                # Static preview of all screens
study/css/study.css         # Experiment styles (isolated from public site)
study/js/
  app.js                    # Bootstrap
  experiment.js             # State machine
  ui.js                     # Rendering helpers
  randomization.js          # Participant ID, condition, list assignment
  storage.js                # localStorage adapter
study/assets/stimuli/       # Controlled SVG stimuli
scripts/
  build_stimuli.py          # SVG generator
  validate_stimuli.py       # Stimulus validation
  test_randomization.js     # Counterbalancing test
  test_flow.js              # End-to-end smoke test
```

---

## 4. Random assignment

- `participant_id` is randomly generated (`MV-XXXXXXXX`).
- `condition` (Control / EGVV) is derived from `hash(participant_id) % 2`.
- `counterbalance_list` (A/B/C/D) is derived from `hash(participant_id) % 4`.
- Refreshing the page preserves assignment and trial order.

---

## 5. Data export

At the end of the experiment, participants can download:

```
misvis-study-MVXXXXXXXX.json
```

The JSON contains `session` and `trials` arrays.

See `study/data/schema.md` for the full data schema and `analysis/DATA_ANALYSIS_PLAN.md` for the analysis plan.

---

## 6. Data analysis workflow

1. Collect JSON files from participants into a directory.
2. Run `analysis/prepare_data.py` to generate:
   - `trials.csv` — long-format trial data
   - `participants.csv` — session-level data
   - `validation_report.txt` — data quality flags
3. Run `analysis/analysis.R` to fit mixed-effects models and produce figures.
4. See `analysis/codebook.csv` for variable definitions.

---

## 7. What is intentionally not implemented in V1?

- Remote data collection adapter is optional (see `SUBMISSION_SETUP.md`; Formspree recommended).

---

## 8. Completed / next phases

- [x] Stimulus generator (`scripts/build_stimuli.py`).
- [x] 40 main SVGs + 8 baseline + 16 transfer stimuli.
- [x] EGVV content for all mechanisms.
- [x] AI interpretation variants per pair × integrity.
- [x] Data validation, CSV export, counterbalancing, and smoke tests.
- [x] Ethics approval; formal study mode (`?mode=study`) enabled.
- [x] Remote submission backend (Tencent SCF + COS) deployed and configured.
- [ ] Host the study page for participants.
- [ ] Pilot data collection.
