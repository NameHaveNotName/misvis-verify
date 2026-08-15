:# MisVis Verify — Data Schema

**Version:** schema-v1  
**Date:** 2026-08-15

All exported data is a single JSON object with two top-level keys: `session` and `trials`.

---

## 1. Session object

```json
{
  "participant_id": "MV-a1b2c3d4",
  "session_id": "S-1234567890123",
  "condition": "egvv",
  "counterbalance_list": "B",
  "started_at": "2026-08-15T09:00:00.000Z",
  "completed_at": "2026-08-15T09:18:32.000Z",
  "completed": true,
  "version": "study-v0.1",
  "stimulus_version": "stimuli-v0.1",
  "schema_version": "schema-v1",
  "consent": true,
  "mode": "pilot",
  "viewport_width": 1920,
  "viewport_height": 1080,
  "user_agent": "Mozilla/5.0 ...",
  "questionnaire": {
    "checks": ["axis", "values", "title"],
    "ai_influence": 45,
    "egvv_help": 78,
    "egvv_burden": 23,
    "strategy": "I started checking the axis start value and the data labels."
  },
  "pilot_feedback": "Some steps felt a bit long."
}
```

### Session fields

| Field | Type | Description |
|-------|------|-------------|
| `participant_id` | string | Random ID, format `MV-[8 hex chars]` |
| `session_id` | string | Unique session ID with timestamp |
| `condition` | string | `"control"` or `"egvv"` |
| `counterbalance_list` | string | `"A"`, `"B"`, `"C"`, or `"D"` |
| `started_at` | ISO string | Session start time |
| `completed_at` | ISO string | Session end time (null if incomplete) |
| `completed` | boolean | Whether participant reached completion screen |
| `version` | string | Study software version |
| `stimulus_version` | string | Stimulus set version |
| `schema_version` | string | Data schema version |
| `consent` | boolean | Whether consent checkbox was checked |
| `mode` | string | `"pilot"` or `"study"` |
| `viewport_width` | number | Browser viewport width in pixels |
| `viewport_height` | number | Browser viewport height in pixels |
| `user_agent` | string | Browser user agent string (for QA only) |
| `questionnaire` | object | Post-study questionnaire responses |
| `pilot_feedback` | string | Optional pilot feedback text |

---

## 2. Trial object

```json
{
  "participant_id": "MV-a1b2c3d4",
  "session_id": "S-1234567890123",
  "phase": "main",
  "trial_index": 4,
  "trial_index_global": 8,
  "pair_id": "TA-01",
  "stimulus_id": "S012",
  "mechanism": "truncated-axis",
  "integrity": "misleading",
  "provenance_condition": "ai-assisted",
  "trust_pre": 70,
  "misleading_pre": "no",
  "confidence_pre": 65,
  "trust_post": 35,
  "misleading_post": "yes",
  "confidence_post": 88,
  "initial_response_time_ms": 8432,
  "intervention_time_ms": 18500,
  "locate_time_ms": 3200,
  "explain_time_ms": 4100,
  "verify_time_ms": 5600,
  "compare_time_ms": 5600,
  "trial_total_time_ms": 32000,
  "timestamp_start": "2026-08-15T09:05:12.000Z",
  "timestamp_end": "2026-08-15T09:05:44.000Z"
}
```

### Trial fields

| Field | Type | Description |
|-------|------|-------------|
| `participant_id` | string | Links to session |
| `session_id` | string | Links to session |
| `phase` | string | `"baseline"`, `"main"`, or `"transfer"` |
| `trial_index` | number | 0-based index within phase |
| `trial_index_global` | number | 0-based index across entire experiment |
| `pair_id` | string | Matched pair identifier, e.g. `TA-01` |
| `stimulus_id` | string | Neutral stimulus ID shown to participant, e.g. `S012` |
| `mechanism` | string | Mechanism taxonomy key |
| `integrity` | string | `"accurate"` or `"misleading"` |
| `provenance_condition` | string | `"ai-assisted"`, `"none"`, or `null` for baseline/transfer |
| `trust_pre` | number | 0–100 trust rating before intervention |
| `misleading_pre` | string | `"yes"`, `"no"`, or `"unsure"` before intervention |
| `confidence_pre` | number | 0–100 confidence rating before intervention |
| `trust_post` | number | 0–100 trust rating after intervention (null for baseline/transfer) |
| `misleading_post` | string | `"yes"`, `"no"`, or `"unsure"` after intervention (null for baseline/transfer) |
| `confidence_post` | number | 0–100 confidence after intervention (null for baseline/transfer) |
| `initial_response_time_ms` | number | Time from stimulus to initial judgment |
| `intervention_time_ms` | number | Total time in intervention step (null for baseline/transfer) |
| `locate_time_ms` | number | Time on EGVV locate step (null if not EGVV) |
| `explain_time_ms` | number | Time on EGVV explain step (null if not EGVV) |
| `verify_time_ms` | number | Time on EGVV verify step (null if not EGVV) |
| `compare_time_ms` | number | Time on EGVV compare step (null if not EGVV) |
| `trial_total_time_ms` | number | Total time from trial start to end |
| `timestamp_start` | ISO string | Trial start time |
| `timestamp_end` | ISO string | Trial end time |

---

## 3. Mechanism taxonomy

Allowed values for `mechanism`:

| Key | Label |
|-----|-------|
| `truncated-axis` | Truncated Axis |
| `cherry-picked-time` | Cherry-Picked Time Range |
| `hidden-uncertainty` | Hidden Uncertainty |
| `area-distortion` | Area Encoding Distortion |
| `color-emphasis` | Arbitrary Color Emphasis |
| `misleading-title` | Misleading Title |

---

## 4. Derived variables for analysis

These are computed in `analysis/prepare_data.py`, not stored in the raw JSON.

| Variable | Definition |
|----------|------------|
| `detection_correct` | For accurate: `misleading == "no"`; for misleading: `misleading == "yes"`; else false |
| `false_positive` | `integrity == "accurate"` and `misleading == "yes"` |
| `false_negative` | `integrity == "misleading"` and `misleading != "yes"` |
| `belief_revision` | `trust_post - trust_pre` |
| `trust_discernment_p` | Per-participant: `mean(trust | accurate) - mean(trust | misleading)` |

---

## 5. Long-format CSV

For statistical analysis, each trial becomes one row. Participant-level variables are repeated.

Required columns:

```
participant_id, condition, counterbalance_list, phase, trial_index,
pair_id, stimulus_id, mechanism, integrity, provenance_condition,
trust_pre, misleading_pre, confidence_pre,
trust_post, misleading_post, confidence_post,
initial_response_time_ms, intervention_time_ms,
locate_time_ms, explain_time_ms, verify_time_ms, compare_time_ms,
trial_total_time_ms, detection_correct, false_positive, false_negative,
belief_revision
```

---

## 6. Data integrity rules

`scripts/validate_stimuli.py` and `analysis/prepare_data.py` should check:

1. `participant_id` matches pattern `MV-[0-9a-f]{8}`.
2. `condition` ∈ {`control`, `egvv`}.
3. `counterbalance_list` ∈ {`A`, `B`, `C`, `D`}.
4. `integrity` ∈ {`accurate`, `misleading`}.
5. `trust_*` and `confidence_*` values ∈ [0, 100].
6. RT values > 0.
7. No duplicate `trial_index_global` within a session.
8. No missing trials for completed sessions.
9. `provenance_condition` is null only in baseline/transfer.
10. `trust_post` etc. are null only in baseline/transfer.
