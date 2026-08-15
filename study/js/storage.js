(function() {
  'use strict';

  const PREFIX = 'misvis_verify_';

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
      const key = PREFIX + 'trial_' + trial.trial_index;
      localStorage.setItem(key, JSON.stringify(trial));
    },
    getTrials() {
      const trials = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(PREFIX + 'trial_')) {
          try { trials.push(JSON.parse(localStorage.getItem(k))); } catch (e) {}
        }
      }
      return trials.sort((a, b) => a.trial_index - b.trial_index);
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
