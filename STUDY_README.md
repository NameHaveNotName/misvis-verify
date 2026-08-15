# MisVis Verify — Study System README

**Version:** study-v0.1  
**Status:** Pilot skeleton; stimuli are placeholders.

---

## 1. What is this?

MisVis Verify is an HCI research module built on top of the MisVis public website. It runs a controlled experiment investigating how AI provenance cues and evidence-grounded visual verification (EGVV) affect trust calibration for data visualizations.

---

## 2. Quick start

1. Open `preview.html` in a browser to see the questionnaire and interface preview.
2. Open `study.html?mode=pilot` to run the pilot experiment locally.
3. Data is saved in browser `localStorage` and exported as JSON at the end.

Do **not** use `?mode=study`; formal study mode is disabled until ethics approval is confirmed.

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
study/assets/stimuli/       # SVG stimuli (placeholder only)
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

---

## 6. What is intentionally not implemented in V1?

- Remote data collection (Supabase, Firebase, etc.).
- Real controlled SVG stimuli (currently placeholders).
- Stimulus generator and validation scripts.
- Analysis pipeline (R / Python).
- Formal study mode (`?mode=study` is blocked).

---

## 7. Planned next phases

1. Stimulus generator (`scripts/build_stimuli.py`).
2. 24 main SVGs + baseline/transfer stimuli.
3. EGVV content for all six mechanisms.
4. Data validation and CSV export.
5. Counterbalancing test script.
6. Pilot data collection.
