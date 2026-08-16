(function() {
  'use strict';

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

  function showState(name) {
    $$('.study-state').forEach(s => s.classList.add('hidden'));
    const el = $('#state-' + name);
    if (el) {
      el.classList.remove('hidden');
      el.scrollIntoView({ behavior: 'instant', block: 'start' });
    }
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function setProvenance(info, barSel) {
    const bar = $(barSel || '#provenance-bar');
    if (!bar) return;
    const hasLabel = !!(info && info.hasLabel);
    if (!hasLabel) {
      bar.classList.remove('has-label');
      bar.innerHTML = '';
      return;
    }
    bar.classList.add('has-label');
    let html = '<span class="prov-label">AI-assisted visualization</span>';
    const ai = info && info.aiInterpretation;
    if (ai) {
      html += '<div class="ai-interpretation">' +
        '<div class="ai-interp-meta">' +
        '<span class="ai-interp-badge">AI 解读</span>' +
        '<span class="ai-interp-status">' + esc(ai.status || '分析完成') + '</span>' +
        (ai.confidence != null ? '<span class="ai-interp-confidence">置信度 ' + esc(ai.confidence) + '%</span>' : '') +
        '</div>' +
        '<div class="ai-interp-text">' + esc(ai.text || '') + '</div>' +
        '</div>';
    }
    bar.innerHTML = html;
  }

  function resetSliders() {
    const trust = $('#trust-slider');
    const conf = $('#confidence-slider');
    if (trust) { trust.value = ''; trust.dataset.touched = 'false'; }
    if (conf) { conf.value = ''; conf.dataset.touched = 'false'; }
  }

  function getTrialResponses() {
    const trust = $('#trust-slider');
    const conf = $('#confidence-slider');
    const misleading = document.querySelector('input[name="misleading"]:checked');
    return {
      trust: trust && trust.dataset.touched === 'true' ? parseInt(trust.value, 10) : null,
      confidence: conf && conf.dataset.touched === 'true' ? parseInt(conf.value, 10) : null,
      misleading: misleading ? misleading.value : null
    };
  }

  function validateTrialResponses() {
    const r = getTrialResponses();
    return r.trust !== null && r.confidence !== null && r.misleading !== null;
  }

  window.MisVisVerifyUI = {
    $, $$, showState, setProvenance, resetSliders,
    getTrialResponses, validateTrialResponses
  };
})();
