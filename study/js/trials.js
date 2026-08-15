(function() {
  'use strict';

  const R = window.MisVisVerifyRandom;

  const CELLS = [
    { integrity: 'accurate', provenance: 'ai-assisted' },
    { integrity: 'accurate', provenance: 'none' },
    { integrity: 'misleading', provenance: 'ai-assisted' },
    { integrity: 'misleading', provenance: 'none' }
  ];

  function buildMain(pairs, listIndex) {
    return pairs.map((pair, i) => {
      const cell = CELLS[(i + listIndex) % CELLS.length];
      const shown = pair[cell.integrity];
      const alternative = pair.accurate;
      return {
        phase: 'main',
        pair_id: pair.pairId,
        stimulus_id: shown.image,
        mechanism: pair.mechanism,
        integrity: cell.integrity,
        provenance_condition: cell.provenance,
        title: shown.title,
        compare_image: alternative.image,
        egvv: pair.egvv || null
      };
    });
  }

  function buildPhase(trials, phase, rng) {
    const items = trials.map(t => ({
      phase,
      pair_id: t.trialId,
      stimulus_id: t.image,
      mechanism: t.mechanism,
      integrity: t.integrity,
      provenance_condition: null,
      title: t.title,
      transfer_type: t.transferType || null
    }));
    return R.shuffle(items, rng);
  }

  function build(participantId, listName) {
    const pairs = window.MISVIS_VERIFY_STIMULI.pairs;
    const baselineSrc = window.MISVIS_VERIFY_BASELINE.trials;
    const transferSrc = window.MISVIS_VERIFY_TRANSFER.trials;
    const rng = R.makeRng(participantId);

    const listIndex = { A: 0, B: 1, C: 2, D: 3 }[listName] || 0;

    return {
      baseline: buildPhase(baselineSrc, 'baseline', rng),
      main: R.shuffle(buildMain(pairs, listIndex), rng),
      transfer: buildPhase(transferSrc, 'transfer', rng)
    };
  }

  window.MisVisVerifyTrials = { build };
})();
