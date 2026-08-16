// MisVis Verify runtime configuration.
//
// 腾讯云函数（SCF 函数URL）后端：参与者浏览器把完整导出 JSON POST 到下面地址，
// 函数存入 COS，参与者在大陆无需 VPN。
// 详细步骤见 SUBMISSION_SETUP.md。
//
// 可选：
//   SUBMIT_FORMAT: 'raw'       -> 完整导出 JSON 原样发送（自定义后端/SCF 用）
//   SUBMIT_FORMAT: 'formspree' -> 包装为 { participant_id, payload }（Formspree 用）
//
// SUBMIT_ENDPOINT 为 null 时禁用远程提交，仅保留本地 JSON 下载。
window.MISVIS_VERIFY_CONFIG = {
  SUBMIT_ENDPOINT: 'https://1410269681-jidfh6rb4r.ap-guangzhou.tencentscf.com',
  SUBMIT_METHOD: 'POST',
  SUBMIT_FORMAT: 'raw'
};
