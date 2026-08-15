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

  const PHASE_ORDER = ['baseline', 'main', 'transfer'];
  const MAIN_TOTAL = 12;
  const BASE_TOTAL = 4;
  const TRANS_TOTAL = 6;

  let session = null;
  let state = STATES.CONSENT;
  let currentTrial = null;      // the trial object currently displayed
  let judgmentStart = 0;        // performance.now() at judgment display
  let currentTrialTotalStart = 0; // performance.now() at trial start
  let interventionStart = 0;
  let egvvStepIndex = 0;
  let egvvStepStart = 0;
  let egvvStepTimes = {};       // key -> accumulated ms

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return [...document.querySelectorAll(sel)]; }

  function phaseLabel(state) {
    if (state === STATES.BASELINE) return 'Baseline';
    if (state === STATES.MAIN_PRE) return 'Main';
    if (state === STATES.MAIN_POST) return 'Main (复核)';
    if (state === STATES.TRANSFER) return 'Transfer';
    return '';
  }

  function phaseProgress() {
    const p = session.phaseIndex;
    if (session.phase === 'baseline') return (p + 1) + ' / ' + BASE_TOTAL;
    if (session.phase === 'main') return (p + 1) + ' / ' + MAIN_TOTAL;
    if (session.phase === 'transfer') return (p + 1) + ' / ' + TRANS_TOTAL;
    return '';
  }

  function init() {
    const params = new URLSearchParams(location.search);
    const mode = params.get('mode') === 'study' ? 'study' : 'pilot';

    if (mode === 'study') {
      document.body.innerHTML = '<div style="padding:40px;text-align:center;"><h1>Formal study mode is not yet enabled.</h1><p>Please use <code>study.html?mode=pilot</code> for internal piloting.</p></div>';
      return;
    }

    $('#mode-badge').textContent = 'Pilot 模式';
    bindGlobal();

    const saved = MisVisVerifyStorage.getSession();
    if (saved && !saved.completed) {
      if (confirm('检测到未完成实验。是否继续？')) {
        session = saved;
        state = saved.state || STATES.CONSENT;
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

    if (state === STATES.CONSENT) { MisVisVerifyUI.showState('consent'); setupConsent(); }
    else if (state === STATES.SETUP) { MisVisVerifyUI.showState('setup'); setupSetup(); }
    else if (state === STATES.BASELINE) { MisVisVerifyUI.showState('trial'); showJudgment('baseline', false); }
    else if (state === STATES.MAIN_PRE) { MisVisVerifyUI.showState('trial'); showJudgment('main', false); }
    else if (state === STATES.MAIN_INTERVENTION) { showIntervention(); }
    else if (state === STATES.MAIN_POST) { MisVisVerifyUI.showState('trial'); showJudgment('main', true); }
    else if (state === STATES.TRANSFER) { MisVisVerifyUI.showState('trial'); showJudgment('transfer', false); }
    else if (state === STATES.QUESTIONNAIRE) { MisVisVerifyUI.showState('questionnaire'); setupQuestionnaire(); }
    else if (state === STATES.COMPLETE) { MisVisVerifyUI.showState('complete'); setupComplete(); }

    saveProgress();
  }

  function setupConsent() {
    const check = $('#consent-check');
    const btn = $('#btn-consent');
    check.checked = false;
    btn.disabled = true;
    check.onchange = () => { btn.disabled = !check.checked; };
    btn.onclick = () => {
      const participantId = MisVisVerifyRandom.generateParticipantId();
      session = {
        participant_id: participantId,
        session_id: 'S-' + Date.now(),
        condition: MisVisVerifyRandom.assignCondition(participantId),
        counterbalance_list: MisVisVerifyRandom.assignList(participantId),
        started_at: new Date().toISOString(),
        completed: false,
        version: 'study-v0.1',
        stimulus_version: 'stimuli-v0.1',
        schema_version: 'schema-v1',
        consent: true,
        mode: 'pilot',
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        user_agent: navigator.userAgent,
        phase: 'baseline',
        phaseIndex: 0,
        mainStage: 'pre',
        trialPlan: MisVisVerifyTrials.build(participantId, session.counterbalance_list)
      };
      enterState(STATES.SETUP);
    };
  }

  function setupSetup() {
    $('#participant-id').textContent = session.participant_id;
    $('#btn-setup').onclick = () => {
      session.phase = 'baseline';
      session.phaseIndex = 0;
      enterState(STATES.BASELINE);
    };
  }

  function currentTrialFor(phase) {
    const list = session.trialPlan[phase];
    return list[session.phaseIndex];
  }

  function showJudgment(phase, isPost) {
    const t = currentTrialFor(phase);
    currentTrial = t;
    session.phase = phase;

    $('#trial-phase').textContent = phaseLabel(state);
    $('#trial-progress').textContent = phaseProgress();

    const hasProvenance = phase === 'main' && t.provenance_condition === 'ai-assisted';
    MisVisVerifyUI.setProvenance(hasProvenance);

    $('#stimulus-image').src = 'study/assets/stimuli/' + t.stimulus_id;

    MisVisVerifyUI.resetSliders();
    $$('input[name="misleading"]').forEach(r => { r.checked = false; });

    const btn = $('#btn-trial');
    btn.disabled = true;
    judgmentStart = performance.now();
    if (phase !== 'main' || !isPost) {
      currentTrialTotalStart = performance.now();
    }

    function checkReady() {
      btn.disabled = !MisVisVerifyUI.validateTrialResponses();
    }

    $('#trust-slider').oninput = function() { this.dataset.touched = 'true'; checkReady(); };
    $('#confidence-slider').oninput = function() { this.dataset.touched = 'true'; checkReady(); };
    $$('input[name="misleading"]').forEach(r => { r.onchange = checkReady; });

    btn.onclick = () => {
      const rt = Math.round(performance.now() - judgmentStart);
      const resp = MisVisVerifyUI.getTrialResponses();
      submitJudgment(phase, isPost, resp, rt);
    };
  }

  function globalIndexOf(phase) {
    if (phase === 'baseline') return session.phaseIndex;
    if (phase === 'main') return BASE_TOTAL + session.phaseIndex;
    return BASE_TOTAL + MAIN_TOTAL + session.phaseIndex;
  }

  function submitJudgment(phase, isPost, resp, rt) {
    const t = currentTrial;

    if (phase === 'main' && !isPost) {
      // save pre, then go to intervention
      const trial = {
        participant_id: session.participant_id,
        session_id: session.session_id,
        phase: 'main',
        trial_index: session.phaseIndex,
        trial_index_global: globalIndexOf('main'),
        pair_id: t.pair_id,
        stimulus_id: t.stimulus_id,
        mechanism: t.mechanism,
        integrity: t.integrity,
        provenance_condition: t.provenance_condition,
        trust_pre: resp.trust,
        misleading_pre: resp.misleading,
        confidence_pre: resp.confidence,
        trust_post: null, misleading_post: null, confidence_post: null,
        initial_response_time_ms: rt,
        intervention_time_ms: null,
        locate_time_ms: null, explain_time_ms: null,
        verify_time_ms: null, compare_time_ms: null,
        trial_total_time_ms: null,
        timestamp_start: new Date().toISOString(),
        timestamp_end: null
      };
      MisVisVerifyStorage.saveTrial(trial);
      session.mainStage = 'intervention';
      enterState(STATES.MAIN_INTERVENTION);
      return;
    }

    if (phase === 'main' && isPost) {
      const trial = MisVisVerifyStorage.getTrialByGlobalIndex(globalIndexOf('main'));
      trial.trust_post = resp.trust;
      trial.misleading_post = resp.misleading;
      trial.confidence_post = resp.confidence;
      trial.trial_total_time_ms = Math.round(performance.now() - currentTrialTotalStart);
      trial.timestamp_end = new Date().toISOString();
      MisVisVerifyStorage.saveTrial(trial);

      session.phaseIndex++;
      if (session.phaseIndex >= MAIN_TOTAL) {
        session.phase = 'transfer';
        session.phaseIndex = 0;
        enterState(STATES.TRANSFER);
      } else {
        session.mainStage = 'pre';
        enterState(STATES.MAIN_PRE);
      }
      return;
    }

    // baseline / transfer: single judgment
    const trial = {
      participant_id: session.participant_id,
      session_id: session.session_id,
      phase: phase,
      trial_index: session.phaseIndex,
      trial_index_global: globalIndexOf(phase),
      pair_id: t.pair_id,
      stimulus_id: t.stimulus_id,
      mechanism: t.mechanism,
      integrity: t.integrity,
      provenance_condition: null,
      transfer_type: t.transfer_type || null,
      trust_pre: resp.trust,
      misleading_pre: resp.misleading,
      confidence_pre: resp.confidence,
      trust_post: null, misleading_post: null, confidence_post: null,
      initial_response_time_ms: rt,
      intervention_time_ms: null,
      locate_time_ms: null, explain_time_ms: null,
      verify_time_ms: null, compare_time_ms: null,
      trial_total_time_ms: Math.round(performance.now() - currentTrialTotalStart),
      timestamp_start: new Date().toISOString(),
      timestamp_end: new Date().toISOString()
    };
    MisVisVerifyStorage.saveTrial(trial);

    session.phaseIndex++;
    if (phase === 'baseline' && session.phaseIndex >= BASE_TOTAL) {
      session.phase = 'main';
      session.phaseIndex = 0;
      session.mainStage = 'pre';
      enterState(STATES.MAIN_PRE);
    } else if (phase === 'transfer' && session.phaseIndex >= TRANS_TOTAL) {
      enterState(STATES.QUESTIONNAIRE);
    } else {
      enterState(state);
    }
  }

  function showIntervention() {
    const t = currentTrialFor('main');
    currentTrial = t;
    interventionStart = performance.now();

    if (session.condition === 'control') {
      $('#control-stimulus-image').src = 'study/assets/stimuli/' + t.stimulus_id;
      MisVisVerifyUI.showState('control');
      const btn = $('#btn-control');
      btn.disabled = true;
      setTimeout(() => { btn.disabled = false; }, 3000);
      btn.onclick = () => finishIntervention();
      return;
    }

    // EGVV
    MisVisVerifyUI.showState('egvv');
    egvvStepIndex = 0;
    egvvStepTimes = { locate: 0, explain: 0, verify: 0, compare: 0 };
    renderEgvvStep();
  }

  function egvvStepsFor(t) {
    const e = t.egvv;
    const compareText = t.integrity === 'misleading' ? e.compareMisleading : e.compareAccurate;
    return [
      { key: 'locate', title: 'Locate', text: e.locate, showCompare: false },
      { key: 'explain', title: 'Explain', text: e.explain, showCompare: false },
      { key: 'verify', title: 'Verify', text: e.verify, showCompare: false },
      { key: 'compare', title: 'Compare', text: compareText, showCompare: true }
    ];
  }

  function renderEgvvStep() {
    const t = currentTrial;
    const steps = egvvStepsFor(t);
    const step = steps[egvvStepIndex];

    const img = step.showCompare ? t.compare_image : t.stimulus_id;
    $('#egvv-stimulus-image').src = 'study/assets/stimuli/' + img;
    $('#egvv-compare-note').style.display = step.showCompare ? 'block' : 'none';
    $('#egvv-compare-note').textContent = step.showCompare
      ? '这是忠实还原的对照版本，请自行比较。' : '';

    $('#egvv-step').textContent = 'Step ' + (egvvStepIndex + 1) + ' / ' + steps.length;
    $('#egvv-title').textContent = step.title;
    $('#egvv-text').textContent = step.text;
    $('#btn-egvv-prev').hidden = egvvStepIndex === 0;
    $('#btn-egvv-next').textContent = egvvStepIndex === steps.length - 1 ? '完成验证' : '继续';

    egvvStepStart = performance.now();

    $('#btn-egvv-next').onclick = () => {
      egvvStepTimes[step.key] += Math.round(performance.now() - egvvStepStart);
      if (egvvStepIndex >= steps.length - 1) {
        finishIntervention();
      } else {
        egvvStepIndex++;
        renderEgvvStep();
      }
    };

    $('#btn-egvv-prev').onclick = () => {
      egvvStepTimes[step.key] += Math.round(performance.now() - egvvStepStart);
      if (egvvStepIndex > 0) {
        egvvStepIndex--;
        renderEgvvStep();
      }
    };
  }

  function finishIntervention() {
    const trial = MisVisVerifyStorage.getTrialByGlobalIndex(globalIndexOf('main'));
    trial.intervention_time_ms = Math.round(performance.now() - interventionStart);
    if (session.condition === 'egvv') {
      trial.locate_time_ms = egvvStepTimes.locate;
      trial.explain_time_ms = egvvStepTimes.explain;
      trial.verify_time_ms = egvvStepTimes.verify;
      trial.compare_time_ms = egvvStepTimes.compare;
    }
    MisVisVerifyStorage.saveTrial(trial);

    session.mainStage = 'post';
    currentTrialTotalStart = performance.now();
    enterState(STATES.MAIN_POST);
  }

  function setupQuestionnaire() {
    $$('.egvv-only').forEach(el => {
      el.style.display = session.condition === 'egvv' ? 'block' : 'none';
    });
    $('#btn-questionnaire').onclick = () => {
      const data = new FormData($('#post-form'));
      session.questionnaire = {
        checks: data.getAll('checks'),
        ai_influence: parseInt(data.get('ai-influence') || '50', 10),
        egvv_help: session.condition === 'egvv' ? parseInt(data.get('egvv-help') || '50', 10) : null,
        egvv_burden: session.condition === 'egvv' ? parseInt(data.get('egvv-burden') || '50', 10) : null,
        strategy: data.get('strategy') || ''
      };
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
      a.download = 'misvis-study-' + session.participant_id + '.json';
      a.click();
      URL.revokeObjectURL(url);
    };

    $('#pilot-feedback-area').hidden = false;
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
    MisVisVerifyStorage.saveSession(session);
  }

  function bindGlobal() {
    history.pushState(null, '', location.href);
    window.onpopstate = () => {
      history.pushState(null, '', location.href);
      alert('实验过程中请使用页面内的按钮，不要使用浏览器返回键。');
    };
  }

  window.MisVisVerifyExperiment = { STATES, init, enterState };
})();
