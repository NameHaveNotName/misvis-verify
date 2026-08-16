(function() {
  'use strict';

  function isCorrect(trial, field) {
    const resp = trial[field];
    if (resp === 'unsure' || resp === null || resp === undefined) return false;
    if (trial.integrity === 'accurate') return resp === 'no';
    if (trial.integrity === 'misleading') return resp === 'yes';
    return false;
  }

  function trialSummary(t) {
    const preCorrect = isCorrect(t, 'misleading_pre');
    const postCorrect = t.phase === 'main' ? isCorrect(t, 'misleading_post') : null;
    return {
      pair_id: t.pair_id,
      stimulus_id: t.stimulus_id,
      mechanism: t.mechanism,
      integrity: t.integrity,
      phase: t.phase,
      pre_correct: preCorrect,
      post_correct: postCorrect,
      trust_pre: t.trust_pre,
      trust_post: t.trust_post,
      confidence_pre: t.confidence_pre,
      confidence_post: t.confidence_post,
      misleading_pre: t.misleading_pre,
      misleading_post: t.misleading_post,
      trial_total_time_ms: t.trial_total_time_ms
    };
  }

  function analyzePhase(trials, phase) {
    const subset = trials.filter(t => t.phase === phase);
    const items = subset.map(trialSummary);
    const total = items.length;
    const correct = items.filter(t => t.pre_correct).length;
    const accuracy = total ? Math.round(correct / total * 100) : 0;

    if (phase !== 'main') {
      return { total, correct, accuracy, trials: items };
    }

    const correctPre = items.filter(t => t.pre_correct).length;
    const correctPost = items.filter(t => t.post_correct).length;
    const falsePositives = items.filter(t => t.integrity === 'accurate' && t.misleading_pre === 'yes').length;
    const falseNegatives = items.filter(t => t.integrity === 'misleading' && t.misleading_pre === 'no').length;
    const falsePositivesPost = items.filter(t => t.integrity === 'accurate' && t.misleading_post === 'yes').length;
    const falseNegativesPost = items.filter(t => t.integrity === 'misleading' && t.misleading_post === 'no').length;
    const corrected = items.filter(t => !t.pre_correct && t.post_correct).length;
    const worsened = items.filter(t => t.pre_correct && !t.post_correct).length;

    return {
      total,
      correct_pre: correctPre,
      correct_post: correctPost,
      accuracy_pre: total ? Math.round(correctPre / total * 100) : 0,
      accuracy_post: total ? Math.round(correctPost / total * 100) : 0,
      false_positives_pre: falsePositives,
      false_negatives_pre: falseNegatives,
      false_positives_post: falsePositivesPost,
      false_negatives_post: falseNegativesPost,
      corrected,
      worsened,
      trials: items
    };
  }

  function analyze(session, trials) {
    const baseline = analyzePhase(trials, 'baseline');
    const main = analyzePhase(trials, 'main');
    const transfer = analyzePhase(trials, 'transfer');

    const start = session.started_at ? new Date(session.started_at) : null;
    const end = session.completed_at ? new Date(session.completed_at) : null;
    const totalMinutes = start && end ? Math.round((end - start) / 1000 / 60 * 10) / 10 : null;

    return {
      participant_id: session.participant_id,
      condition: session.condition,
      counterbalance_list: session.counterbalance_list,
      completed: !!session.completed,
      total_minutes: totalMinutes,
      baseline,
      main,
      transfer,
      questionnaire: session.questionnaire || null
    };
  }

  function fmtPct(n) { return n + '%'; }

  function renderList(container, items) {
    if (!items || !items.length) {
      container.innerHTML = '<p class="result-empty">无数据</p>';
      return;
    }
    const rows = items.map(t => {
      const verdict = t.pre_correct ? '✓ 正确' : '✗ 错误';
      let postVerdict = '';
      if (t.phase === 'main') {
        postVerdict = t.post_correct ? ' → 复核正确' : ' → 复核错误';
      }
      const trust = `信任 ${t.trust_pre ?? '-'}`;
      const conf = `信心 ${t.confidence_pre ?? '-'}`;
      return `<li class="result-trial">
        <span class="result-trial-id">${t.pair_id}</span>
        <span class="result-trial-mechanism">${t.mechanism}</span>
        <span class="result-trial-integrity ${t.integrity}">${t.integrity === 'accurate' ? '准确' : '误导'}</span>
        <span class="result-trial-verdict">${verdict}${postVerdict}</span>
        <span class="result-trial-scores">${trust} · ${conf}</span>
      </li>`;
    }).join('');
    container.innerHTML = `<ul class="result-trial-list">${rows}</ul>`;
  }

  function render(container, analysis) {
    const q = analysis.questionnaire || {};
    const qChecks = (q.checks && q.checks.length) ? q.checks.join('、') : '未填写';
    const qAi = q.ai_influence !== undefined ? q.ai_influence : '-';
    const qHelp = q.egvv_help !== undefined ? q.egvv_help : '-';
    const qBurden = q.egvv_burden !== undefined ? q.egvv_burden : '-';

    container.innerHTML = `
      <div class="result-card">
        <h2>您的实验结果摘要</h2>
        <div class="result-meta">
          <span>编号：${analysis.participant_id}</span>
          <span>条件：${analysis.condition === 'egvv' ? 'EGVV 验证组' : 'Control 对照组'}</span>
          <span>列表：${analysis.counterbalance_list}</span>
          ${analysis.total_minutes !== null ? `<span>用时：${analysis.total_minutes} 分钟</span>` : ''}
        </div>

        <div class="result-section">
          <h3>基线（Baseline）</h3>
          <p>正确率：<strong>${analysis.baseline.correct}/${analysis.baseline.total} (${fmtPct(analysis.baseline.accuracy)})</strong></p>
          <div class="result-trials" data-phase="baseline"></div>
        </div>

        <div class="result-section">
          <h3>主实验（Main）</h3>
          <p>干预前正确率：<strong>${analysis.main.correct_pre}/${analysis.main.total} (${fmtPct(analysis.main.accuracy_pre)})</strong></p>
          <p>干预后正确率：<strong>${analysis.main.correct_post}/${analysis.main.total} (${fmtPct(analysis.main.accuracy_post)})</strong></p>
          <p>EGVV 纠正错误：${analysis.main.corrected} 个 · 导致错误：${analysis.main.worsened} 个</p>
          <p>误报（准确图判成误导）：干预前 ${analysis.main.false_positives_pre} → 干预后 ${analysis.main.false_positives_post}</p>
          <p>漏报（误导图判成准确）：干预前 ${analysis.main.false_negatives_pre} → 干预后 ${analysis.main.false_negatives_post}</p>
          <div class="result-trials" data-phase="main"></div>
        </div>

        <div class="result-section">
          <h3>迁移（Transfer）</h3>
          <p>正确率：<strong>${analysis.transfer.correct}/${analysis.transfer.total} (${fmtPct(analysis.transfer.accuracy)})</strong></p>
          <div class="result-trials" data-phase="transfer"></div>
        </div>

        <div class="result-section">
          <h3>问卷</h3>
          <p>检查项：${qChecks}</p>
          <p>AI 来源影响：${qAi}/100</p>
          ${analysis.condition === 'egvv' ? `<p>验证步骤帮助：${qHelp}/100 · 负担感：${qBurden}/100</p>` : ''}
        </div>
      </div>
    `;

    container.querySelectorAll('.result-trials').forEach(el => {
      const phase = el.dataset.phase;
      const items = analysis[phase].trials;
      renderList(el, items);
    });
  }

  function renderFromSession(container) {
    const session = window.MisVisVerifyStorage && window.MisVisVerifyStorage.getSession();
    const trials = window.MisVisVerifyStorage && window.MisVisVerifyStorage.getTrials();
    if (!session || !trials || !trials.length) {
      container.innerHTML = '<p class="result-empty">未找到当前实验数据。</p>';
      return;
    }
    render(container, analyze(session, trials));
  }

  function renderFromJSON(container, jsonObj) {
    const session = jsonObj.session || jsonObj;
    const trials = jsonObj.trials || [];
    render(container, analyze(session, trials));
  }

  window.MisVisVerifyResults = { analyze, render, renderFromSession, renderFromJSON };
})();
