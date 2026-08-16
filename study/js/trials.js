(function() {
  'use strict';

  const R = window.MisVisVerifyRandom;

  const CELLS = [
    { integrity: 'accurate', provenance: 'ai-assisted' },
    { integrity: 'accurate', provenance: 'none' },
    { integrity: 'misleading', provenance: 'ai-assisted' },
    { integrity: 'misleading', provenance: 'none' }
  ];

  const ATTITUDES = ['trust', 'distrust'];

  const GENERIC_EGVV = {
    locate: "请先定位这张图表的标题、坐标轴和数据来源，明确它展示的是什么信息。",
    explain: "尝试用自己的话概括图表传达的核心信息，并思考它是否遗漏了重要背景或数据。",
    verify: "核对数值标签、坐标轴起点和刻度是否合理，检查是否存在会误导读者的视觉设计。",
    compareMisleading: "回顾以上验证要点，重新审视这张图：它是否通过视觉设计夸大或隐藏了某些信息？",
    compareAccurate: "回顾以上验证要点，确认这张图是否如实呈现了数据，没有夸大或隐藏信息。"
  };

  function buildMainCandidates(pairs, listIndex, transferTrials, rng) {
    const pairTrials = pairs.map((pair, i) => {
      const cell = CELLS[(i + listIndex) % CELLS.length];
      const shown = pair[cell.integrity];
      const alternative = pair[cell.integrity];
      const aiAttitude = (cell.provenance === 'ai-assisted') ? R.choice(ATTITUDES, rng) : null;
      let aiInterpretation = null;
      if (cell.provenance === 'ai-assisted' && pair.aiInterpretations) {
        const byIntegrity = pair.aiInterpretations[cell.integrity] || {};
        const variants = byIntegrity[aiAttitude] || [];
        if (variants.length) aiInterpretation = R.choice(variants, rng);
      }
      return {
        phase: 'main',
        pair_id: pair.pairId,
        stimulus_id: shown.image,
        mechanism: pair.mechanism,
        integrity: cell.integrity,
        provenance_condition: cell.provenance,
        ai_attitude: aiAttitude,
        title: shown.title,
        compare_image: alternative.image,
        egvv: pair.egvv || null,
        ai_interpretation: aiInterpretation,
        transfer_type: null
      };
    });

    const transferCandidates = transferTrials.map(t => ({
      phase: 'main',
      pair_id: t.trialId,
      stimulus_id: t.image,
      mechanism: t.mechanism,
      integrity: t.integrity,
      provenance_condition: null,
      ai_attitude: null,
      title: t.title,
      compare_image: t.image,
      egvv: GENERIC_EGVV,
      ai_interpretation: null,
      transfer_type: t.transferType || null
    }));

    return pairTrials.concat(transferCandidates);
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

    const mainCandidates = buildMainCandidates(pairs, listIndex, transferSrc, rng);
    const main = R.shuffle(mainCandidates, rng).slice(0, 20);

    return {
      baseline: buildPhase(baselineSrc, 'baseline', rng),
      main: main,
      transfer: buildPhase(transferSrc, 'transfer', rng)
    };
  }

  window.MisVisVerifyTrials = { build };
})();
