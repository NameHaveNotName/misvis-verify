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

  function setProvenance(hasLabel) {
    const bar = $('#provenance-bar');
    if (!bar) return;
    if (hasLabel) {
      bar.classList.add('has-label');
      bar.innerHTML = '<span>AI-assisted visualization</span>';
    } else {
      bar.classList.remove('has-label');
      bar.textContent = '';
    }
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
