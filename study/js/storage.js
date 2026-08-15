(function() {
  'use strict';

  const PREFIX = 'misvis_verify_';

  function keyForGlobalIndex(i) {
    return PREFIX + 'trial_' + i;
  }

  window.MisVisVerifyStorage = {
    saveSession(session) {
      localStorage.setItem(PREFIX + 'session', JSON.stringify(session));
    },
    getSession() {
      try {
        return JSON.parse(localStorage.getItem(PREFIX + 'session'));
      } catch (e) {
        return null;
      }
    },
    saveTrial(trial) {
      const key = keyForGlobalIndex(trial.trial_index_global);
      localStorage.setItem(key, JSON.stringify(trial));
    },
    getTrialByGlobalIndex(i) {
      try {
        return JSON.parse(localStorage.getItem(keyForGlobalIndex(i)));
      } catch (e) {
        return null;
      }
    },
    getTrials() {
      const trials = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX + 'trial_')) {
          try { trials.push(JSON.parse(localStorage.getItem(k))); } catch (e) {}
        }
      }
      return trials.sort((a, b) => a.trial_index_global - b.trial_index_global);
    },
    exportJSON() {
      const session = this.getSession();
      const trials = this.getTrials();
      return JSON.stringify({ session, trials, exported_at: new Date().toISOString() }, null, 2);
    },
    clearSession() {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX)) keys.push(k);
      }
      keys.forEach(k => localStorage.removeItem(k));
    }
  };
})();
