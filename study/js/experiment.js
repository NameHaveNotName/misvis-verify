(function() {
  'use strict';

  const STATES = {
    CONSENT: 'consent',
    SETUP: 'setup',
    BASELINE: 'baseline',
    MAIN_PRE: 'main_pre',
    MAIN_INTERVENTION: 'main_intervention',
    MAIN_POST: 'main_post',
    TRANSFER: 'transfer',
    QUESTIONNAIRE: 'questionnaire',
    COMPLETE: 'complete'
  };

  let session = null;
  let state = STATES.CONSENT;
  let trialIndex = 0;
  let egvvStepIndex = 0;
  let trialStartTime = 0;

  const egvvTemplate = {
    locate: { title: 'Locate', text: '请检查纵轴的起始位置。' },
    explain: { title: 'Explain', text: '柱状图主要依赖长度比较。改变共同基线可能放大视觉差异。' },
    verify: { title: 'Verify', text: 'A = 92，B = 83。两者实际相差 9 个单位。' },
    compare: { title: 'Compare', text: '下面是恢复从零开始的纵轴后的版本。请自行比较两张图的差异。', compareHtml: '<p>[此处将显示 faithful alternative 图表]</p>' }
  };

  function init() {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode') === 'study' ? 'study' : 'pilot';

    if (mode === 'study') {
      // Formal study mode is disabled until ethics approval is in place.
      document.body.innerHTML = '<div style="padding:40px;text-align:center;"><h1>Formal study mode is not yet enabled.</h1><p>Please use <code>study.html?mode=pilot</code> for internal piloting.</p></div>';
      return;
    }

    $('#mode-badge').textContent = 'Pilot 模式';
    bindGlobal();

    // Resume check
    const saved = MisVisVerifyStorage.getSession();
    if (saved && !saved.completed) {
      if (confirm('检测到未完成实验。是否继续？')) {
        session = saved;
        state = saved.state || STATES.CONSENT;
        trialIndex = saved.trialIndex || 0;
        enterState(state);
        return;
      } else {
        MisVisVerifyStorage.clearSession();
      }
    }

    enterState(STATES.CONSENT);
  }

  function enterState(newState) {
    state = newState;
    MisVisVerifyUI.showState(state.replace(/_/g, '-'));

    if (state === STATES.CONSENT) setupConsent();
    if (state === STATES.SETUP) setupSetup();
    if (state === STATES.BASELINE || state === STATES.MAIN_PRE || state === STATES.TRANSFER) setupTrial();
    if (state === STATES.MAIN_INTERVENTION) setupIntervention();
    if (state === STATES.MAIN_POST) setupTrial(true);
    if (state === STATES.QUESTIONNAIRE) setupQuestionnaire();
    if (state === STATES.COMPLETE) setupComplete();

    saveProgress();
  }

  function setupConsent() {
    const check = $('#consent-check');
    const btn = $('#btn-consent');
    check.checked = false;
    btn.disabled = true;
    check.onchange = () => { btn.disabled = !check.checked; };
    btn.onclick = () => {
      session = {
        participant_id: MisVisVerifyRandom.generateParticipantId(),
        session_id: 'S-' + Date.now(),
        condition: null,
        counterbalance_list: null,
        started_at: new Date().toISOString(),
        completed: false,
        version: 'study-v0.1',
        consent: true,
        mode: 'pilot'
      };
      session.condition = MisVisVerifyRandom.assignCondition(session.participant_id);
      session.counterbalance_list = MisVisVerifyRandom.assignList(session.participant_id);
      enterState(STATES.SETUP);
    };
  }

  function setupSetup() {
    $('#participant-id').textContent = session.participant_id;
    $('#btn-setup').onclick = () => enterState(STATES.BASELINE);
  }

  function setupTrial(isPost) {
    const phase = state === STATES.BASELINE ? 'Baseline' : state === STATES.TRANSFER ? 'Transfer' : isPost ? 'Main (post)' : 'Main';
    $('#trial-phase').textContent = phase;
    $('#trial-progress').textContent = (trialIndex + 1) + ' / 12';

    // Placeholder stimulus
    $('#stimulus-image').src = 'study/assets/stimuli/placeholder.svg';

    // Provenance only in main trials
    const hasProvenance = (state === STATES.MAIN_PRE || state === STATES.MAIN_POST) && trialIndex % 2 === 0;
    MisVisVerifyUI.setProvenance(hasProvenance);

    MisVisVerifyUI.resetSliders();
    $$('input[name="misleading"]').forEach(r => r.checked = false);

    const btn = $('#btn-trial');
    btn.disabled = true;
    trialStartTime = performance.now();

    function checkReady() {
      btn.disabled = !MisVisVerifyUI.validateTrialResponses();
    }

    $('#trust-slider').oninput = function() { this.dataset.touched = 'true'; checkReady(); };
    $('#confidence-slider').oninput = function() { this.dataset.touched = 'true'; checkReady(); };
    $$('input[name="misleading"]').forEach(r => r.onchange = checkReady);

    btn.onclick = () => {
      const responses = MisVisVerifyUI.getTrialResponses();
      responses.rt_ms = Math.round(performance.now() - trialStartTime);
      responses.trial_index = trialIndex;
      responses.state = state;
      responses.timestamp = new Date().toISOString();
      MisVisVerifyStorage.saveTrial(responses);

      if (state === STATES.MAIN_PRE) {
        enterState(STATES.MAIN_INTERVENTION);
      } else if (state === STATES.MAIN_POST) {
        trialIndex++;
        if (trialIndex >= 12) enterState(STATES.TRANSFER);
        else enterState(STATES.MAIN_PRE);
      } else if (state === STATES.BASELINE) {
        trialIndex++;
        if (trialIndex >= 4) {
          trialIndex = 0;
          enterState(STATES.MAIN_PRE);
        } else {
          enterState(STATES.BASELINE);
        }
      } else if (state === STATES.TRANSFER) {
        trialIndex++;
        if (trialIndex >= 6) enterState(STATES.QUESTIONNAIRE);
        else enterState(STATES.TRANSFER);
      }
    };
  }

  function setupIntervention() {
    egvvStepIndex = 0;
    const steps = ['locate', 'explain', 'verify', 'compare'];
    const isEgvv = session.condition === 'egvv';

    if (!isEgvv) {
      // Control: simple re-inspection with 3-second delay
      MisVisVerifyUI.showState('control');
      const btn = $('#btn-control');
      btn.disabled = true;
      setTimeout(() => { btn.disabled = false; }, 3000);
      btn.onclick = () => enterState(STATES.MAIN_POST);
      return;
    }

    MisVisVerifyUI.showState('egvv');
    renderEgvvStep(steps);

    $('#btn-egvv-next').onclick = () => {
      egvvStepIndex++;
      if (egvvStepIndex >= steps.length) {
        enterState(STATES.MAIN_POST);
      } else {
        renderEgvvStep(steps);
      }
    };

    $('#btn-egvv-prev').onclick = () => {
      if (egvvStepIndex > 0) {
        egvvStepIndex--;
        renderEgvvStep(steps);
      }
    };
  }

  function renderEgvvStep(steps) {
    const key = steps[egvvStepIndex];
    MisVisVerifyUI.renderEgvv(
      { index: egvvStepIndex + 1, total: steps.length },
      egvvTemplate[key]
    );
  }

  function setupQuestionnaire() {
    // Show/hide EGVV-only items
    $$('.egvv-only').forEach(el => {
      el.style.display = session.condition === 'egvv' ? 'block' : 'none';
    });

    $('#btn-questionnaire').onclick = () => {
      const form = $('#post-form');
      const data = new FormData(form);
      const checks = data.getAll('checks');
      const questionnaire = {
        checks,
        ai_influence: parseInt(data.get('ai-influence') || '50', 10),
        egvv_help: session.condition === 'egvv' ? parseInt(data.get('egvv-help') || '50', 10) : null,
        egvv_burden: session.condition === 'egvv' ? parseInt(data.get('egvv-burden') || '50', 10) : null,
        strategy: data.get('strategy') || ''
      };
      session.questionnaire = questionnaire;
      enterState(STATES.COMPLETE);
    };
  }

  function setupComplete() {
    session.completed = true;
    session.completed_at = new Date().toISOString();
    saveProgress();

    $('#btn-download').onclick = () => {
      const blob = new Blob([MisVisVerifyStorage.exportJSON()], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `misvis-study-${session.participant_id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const feedbackArea = $('#pilot-feedback-area');
    feedbackArea.hidden = false;
    $('#btn-feedback').onclick = () => {
      const txt = $('#pilot-feedback').value.trim();
      if (txt) {
        session.pilot_feedback = txt;
        saveProgress();
        alert('反馈已保存到本地数据。');
      }
    };
  }

  function saveProgress() {
    if (!session) return;
    session.state = state;
    session.trialIndex = trialIndex;
    MisVisVerifyStorage.saveSession(session);
  }

  function bindGlobal() {
    // Prevent accidental back button
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
      alert('实验过程中请使用页面内的按钮，不要使用浏览器返回键。');
    };
  }

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return [...document.querySelectorAll(sel)]; }

  // Expose state names for app.js
  window.MisVisVerifyExperiment = {
    STATES,
    init,
    enterState
  };
})();
