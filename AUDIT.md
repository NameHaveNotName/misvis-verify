# MisVis Verify — Repository Audit

**Date:** 2026-08-15  
**Reference project:** `D:\.pogget\user_storage\u_461180\c1bf2\misvis-local-site`  
**Current project:** `D:\.pogget\user_storage\u_461180\6f562`

---

## 1. Current directory structure

### 1.1 Reference MisVis website (c1bf2)

```
misvis-local-site/
├── index.html              # Public website entry
├── styles.css              # Main site styles
├── app.js                  # Search, filters, case dialog, quiz
├── data.js                 # Built-in demo cases (8 pairs)
├── custom-data.js          # Extension point (currently empty)
├── editor.html / editor.js / editor.css
│                           # Local case editor
├── library-manager.html / library-manager.js / library-manager.css
│                           # 85-image corpus workbench
├── library.csv / library.json / library.js
│                           # Corpus metadata
├── assets/
│   ├── logo.svg
│   ├── cases/              # 8 demo SVG pairs (original + corrected)
│   └── library/            # 85 corpus images (PNG)
├── downloads/              # Packaged tools
├── tools/                  # Batch importer (Python + templates)
└── README.md
```

### 1.2 Current MisVis Verify project (6f562)

```
6f562/
├── .git/                   # Initialized, one commit
├── LITERATURE_REVIEW.md
├── DESIGN_DECISIONS.md
├── literature_search_openalex*.json
└── literature_search_summary*.txt
```

No website code, no study code, no analysis code yet.

---

## 2. Existing pages and features

| Page | Purpose | Reuse for Study? |
|------|---------|------------------|
| `index.html` | Public landing, framework, case library, AI section, quiz, about | No direct reuse; may link to `study.html` |
| `editor.html` | Add/edit cases with annotations | No; study stimuli are controlled, not editable |
| `library-manager.html` | Manage 85 corpus images | No; corpus remains separate from controlled stimuli |
| `data.js` / `custom-data.js` | Case data structures | Conceptual reuse only (stimulus schema is different) |

---

## 3. Existing data files

### 3.1 Demo case schema (`data.js`)

```javascript
{
  id, title, stage, substage, category, tags,
  summary, mechanism, truth, source, reference,
  image, correctedImage, annotations:[{x,y,text}]
}
```

**Relevance to study:** The public case schema is a useful reference, but experiment stimuli need a stricter schema:

- `pairId` linking accurate and misleading versions
- `integrity`: "accurate" | "misleading"
- `mechanism`: controlled taxonomy
- `provenanceCondition`: "ai-assisted" | "none"
- `egvv`: Locate / Explain / Verify / Compare content
- No `correctedImage` exposure during trial (only in Compare step for EGVV)

### 3.2 Corpus metadata (`library.json` / `library.csv`)

Contains ~85 real-world examples used for literature grounding.

**Role in study:**
- Provides examples for `study/data/corpus-grounding.json`
- Must **not** be used as controlled stimuli (per experimental plan)

---

## 4. Existing JS architecture

### 4.1 Public site (`app.js`)

- IIFE module pattern
- Vanilla JS, no build step
- Uses `window.MISVIS_CASES` and `window.MISVIS_CUSTOM_CASES`
- Search, filter, sort, dialog-based case detail
- Quiz with immediate feedback

**Study implications:**
- We can reuse the IIFE + global config pattern for consistency.
- We must **not** load `data.js` / `custom-data.js` into `study.html` to avoid exposing public cases during the experiment.
- The study needs a state machine, not event-driven page rendering.

### 4.2 Editor and library manager

- File-based saving via exported `.js` files
- Browser `localStorage` for library-manager draft state

**Study implications:**
- `localStorage` is acceptable for study session persistence (resume feature).
- Export as JSON is acceptable for pilot data collection.

---

## 5. CSS reuse assessment

### 5.1 What can be reused

- CSS variables (`--ink`, `--paper`, `--accent`, `--muted`, `--line`, `--radius`, `--max`)
- Font stack (`Inter`, `PingFang SC`, `Microsoft YaHei`)
- Basic button styles (`.button`, `.button.primary`, `.button.secondary`)
- Card / panel aesthetics
- Focus / accessibility helpers (`.sr-only`, `.skip-link`)

### 5.2 What must be new

- Trial layout: centered stimulus, fixed max-width, slider styling
- EGVV step cards with progress indicator
- Provenance caption bar component
- Timer / RT feedback (hidden from participant)
- Responsive rules for 1280×720 minimum viewport

### 5.3 CSS isolation strategy

Create `study/css/study.css` and keep it independent of `styles.css`. Link only `study.css` from `study.html`. This avoids accidental style leakage and keeps the public site untouched.

---

## 6. GitHub Pages relative path risks

### 6.1 Current project root

If deployed to GitHub Pages at `https://user.github.io/repo-name/`, all resources must use relative paths.

### 6.2 Risks

- Absolute paths like `/study/css/study.css` will break.
- `fetch()` calls to local JSON must use relative paths.
- SVG stimulus paths must be relative.

### 6.3 Mitigation

- Use `./study/...` or `study/...` for all local resources.
- Avoid `file://` assumptions; test by opening `study.html` directly in browser and via a local server.
- Do not use `import` with bare module specifiers.

---

## 7. Potential conflicts between public site and study module

| Risk | Mitigation |
|------|------------|
| Public quiz feedback colors leak into study | Use isolated `study.css` |
| Public case data loaded in study | Study loads only `study/data/stimuli.json` |
| Global namespace collision | Study uses `window.MisVisVerify` namespace |
| Shared `localStorage` keys | Study prefixes keys: `misvis_verify_*` |
| Navigation between public site and study | Single link from About page; study has no public nav |

---

## 8. Recommended V1 file plan

```
6f562/
├── index.html                    # Existing public site (copy from c1bf2 when ready)
├── styles.css                    # Public styles (copy from c1bf2)
├── app.js, data.js, ...          # Public site files (copy from c1bf2)
├── study.html                    # New experiment entry
├── study/
│   ├── css/
│   │   └── study.css
│   ├── js/
│   │   ├── app.js                # Study bootstrap + state router
│   │   ├── experiment.js         # State machine
│   │   ├── randomization.js      # Counterbalancing + seeded shuffle
│   │   ├── storage.js            # localStorage adapter
│   │   ├── metrics.js            # RT + scoring helpers
│   │   └── ui.js                 # DOM rendering helpers
│   ├── data/
│   │   ├── stimuli.json          # 20 main pairs
│   │   ├── baseline.json         # 8 baseline trials
│   │   ├── transfer.json         # 16 transfer trials
│   │   ├── corpus-grounding.json # Literature grounding mapping
│   │   └── schema.md             # Data schema documentation
│   └── assets/
│       └── stimuli/              # SVG files (neutral IDs)
├── scripts/
│   ├── build_stimuli.py
│   └── validate_stimuli.py
├── analysis/
│   ├── README.md
│   ├── POWER_PLAN.md
│   ├── codebook.csv
│   ├── prepare_data.py
│   ├── analysis.R
│   └── sample_output/            # Synthetic test data only
├── AUDIT.md                      # This file
├── STUDY_README.md               # To be written
├── LITERATURE_REVIEW.md
├── DESIGN_DECISIONS.md
└── literature_search_*           # Raw search outputs
```

---

## 9. Audit conclusions

1. The reference project is a well-structured static site that can coexist with the study module.
2. The study module must be isolated in `study/` and `study.html` to avoid coupling.
3. CSS can borrow the visual language but should be independent.
4. No backend is needed for V1; localStorage + JSON export is sufficient.
5. GitHub Pages deployment is feasible if all paths are relative.
6. The 85-image corpus must remain a separate grounding resource, not experimental stimuli.
