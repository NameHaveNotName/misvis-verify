(function() {
  'use strict';

  // Simple seeded PRNG (Mulberry32)
  function mulberry32(seed) {
    return function() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashString(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    }
    return h >>> 0;
  }

  function shuffle(array, rng) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function choice(array, rng) {
    return array[Math.floor(rng() * array.length)];
  }

  function generateParticipantId() {
    const arr = new Uint32Array(2);
    if (window.crypto && window.crypto.getRandomValues) {
      window.crypto.getRandomValues(arr);
    } else {
      arr[0] = Math.floor(Math.random() * 0xFFFFFFFF);
      arr[1] = Math.floor(Math.random() * 0xFFFFFFFF);
    }
    return 'MV-' + arr[0].toString(16).padStart(8, '0');
  }

  function assignCondition(participantId) {
    return (hashString(participantId) % 2 === 0) ? 'control' : 'egvv';
  }

  function assignList(participantId) {
    const lists = ['A', 'B', 'C', 'D'];
    return lists[hashString(participantId) % 4];
  }

  window.MisVisVerifyRandom = {
    mulberry32,
    hashString,
    shuffle,
    choice,
    generateParticipantId,
    assignCondition,
    assignList,
    makeRng(participantId) {
      return mulberry32(hashString(participantId));
    }
  };
})();
