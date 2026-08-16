(function() {
  'use strict';

  const cfg = window.MISVIS_VERIFY_CONFIG || { SUBMIT_ENDPOINT: null };

  function setStatus(el, type, message) {
    el.textContent = message;
    el.className = 'submit-status ' + type;
  }

  function buildRequest(jsonString) {
    const headers = { 'Content-Type': 'application/json' };
    let body = jsonString;

    if ((cfg.SUBMIT_FORMAT || 'formspree') === 'formspree') {
      headers['Accept'] = 'application/json';
      let participantId = '';
      try {
        const parsed = JSON.parse(jsonString);
        participantId = (parsed.session && parsed.session.participant_id) || '';
      } catch (e) { /* keep empty */ }
      body = JSON.stringify({ participant_id: participantId, payload: jsonString });
    }

    return { headers, body };
  }

  async function submit(jsonString) {
    const endpoint = cfg.SUBMIT_ENDPOINT;
    if (!endpoint) {
      return { ok: false, message: '未配置提交端点。请使用 JSON 下载。' };
    }

    try {
      const { headers, body } = buildRequest(jsonString);
      const resp = await fetch(endpoint, {
        method: cfg.SUBMIT_METHOD || 'POST',
        headers: headers,
        body: body
      });
      if (resp.ok) {
        return { ok: true, message: '结果已成功发送给研究者，您无需再手动发送文件。' };
      }
      let detail = '';
      try {
        const data = await resp.json();
        if (data && data.error) detail = data.error;
      } catch (e) { /* non-JSON error body */ }
      return { ok: false, message: '发送失败（状态 ' + resp.status + '）。请改用 JSON 下载。' + (detail ? ' ' + String(detail).slice(0, 200) : '') };
    } catch (err) {
      return { ok: false, message: '网络错误，无法发送。请改用 JSON 下载。' };
    }
  }

  function init() {
    const btn = document.getElementById('btn-submit');
    const status = document.getElementById('submit-status');
    if (!btn || !status) return;

    if (!cfg.SUBMIT_ENDPOINT) {
      btn.style.display = 'none';
      setStatus(status, 'error', '研究者未开启远程收集，请下载 JSON 文件发送。');
      return;
    }

    btn.onclick = async () => {
      const json = window.MisVisVerifyStorage && window.MisVisVerifyStorage.exportJSON();
      if (!json) {
        setStatus(status, 'error', '没有可发送的实验数据。');
        return;
      }
      setStatus(status, 'pending', '正在发送…');
      const result = await submit(json);
      setStatus(status, result.ok ? 'success' : 'error', result.message);
    };
  }

  async function autoSubmit() {
    const status = document.getElementById('submit-status');
    if (!cfg.SUBMIT_ENDPOINT) {
      if (status) setStatus(status, 'error', '研究者未开启远程收集，请下载 JSON 文件发送。');
      return;
    }
    const json = window.MisVisVerifyStorage && window.MisVisVerifyStorage.exportJSON();
    if (!json) return;
    if (status) setStatus(status, 'pending', '正在发送结果…');
    const result = await submit(json);
    if (status) setStatus(status, result.ok ? 'success' : 'error', result.message);
  }

  window.MisVisVerifySubmit = { submit, init, autoSubmit };
})();
