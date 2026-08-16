# MisVis Verify 远程数据提交配置

实验现在支持在完成后自动将 JSON 数据 POST 到研究者指定的后端，避免参与者手动发送文件。

## 推荐方案：Formspree（免费，无需 Google 账号）

免费版：每月 50 次提交、2 个表单，足够 pilot（N≈30）使用。注册只需任意邮箱。

### 1. 注册并创建表单

1. 打开 [formspree.io](https://formspree.io)，用任意邮箱注册（QQ/163/学校邮箱均可）。
2. 点击 **+ New Form**，表单名称填 `misvis-verify`。
3. 创建后 Formspree 会向你的邮箱发送**激活邮件**，必须点击激活，否则表单不接收数据。
4. 打开表单的 **Integration** 标签，复制表单端点 URL，形如：
   `https://formspree.io/f/abcdwxyz`

### 2. 绑定到前端

打开 `study/data/config.js`，将 `SUBMIT_ENDPOINT` 替换为上述 URL：

```javascript
window.MISVIS_VERIFY_CONFIG = {
  SUBMIT_ENDPOINT: 'https://formspree.io/f/abcdwxyz',
  SUBMIT_METHOD: 'POST',
  SUBMIT_FORMAT: 'formspree'
};
```

前端会自动把完整导出 JSON 包装为 `{ participant_id, payload }` 发送（payload 为完整 JSON 字符串，约 30 KB，远低于 Formspree 上限）。

### 3. 测试

1. 用浏览器完成一次 pilot 实验。
2. 完成页的**“将结果发送给研究者”**按钮应显示绿色成功提示。
3. 到 Formspree Dashboard 的 **Submissions** 页面确认收到记录。
4. 数据导出：Dashboard → Submissions → **Export to CSV**，`payload` 列即完整实验 JSON。

### 4. 收到数据后的处理

CSV 中每行一次提交：`participant_id` 列 + `payload` 列（完整 JSON 字符串）。将每行的 `payload` 用 `python -c "import json; json.loads(...)"` 解析验证后，放入 `analysis/sample_output/synthetic_input/` 同级的真实数据目录，即可用 `analysis/prepare_data.py` 处理。

## 替代方案 A：Google Apps Script（免费，需要 Google 账号）

1. 打开 [script.google.com](https://script.google.com) 并新建项目，粘贴以下代码：

```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data;
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: 'Invalid JSON' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Formspree 格式包装：payload 为完整导出 JSON 字符串
  var payload = data.payload ? JSON.parse(data.payload) : data;
  var session = payload.session || {};
  var row = [
    new Date(),
    session.participant_id || '',
    session.session_id || '',
    session.condition || '',
    session.counterbalance_list || '',
    session.started_at || '',
    session.completed_at || '',
    session.mode || '',
    JSON.stringify(payload.trials || []),
    JSON.stringify(session.questionnaire || {})
  ];
  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

2. 部署为 Web 应用：执行身份选“你自己”，访问权限选“任何人”。
3. 将部署 URL 填入 `config.js` 的 `SUBMIT_ENDPOINT`（保留 `SUBMIT_FORMAT: 'formspree'`，脚本已兼容该包装格式）。

## 替代方案 B：自有后端

任何支持 CORS 的 HTTP POST 接口均可：

- 保留 `SUBMIT_FORMAT: 'formspree'` 时请求体为 `{ participant_id, payload }`；
- 改为 `SUBMIT_FORMAT: 'raw'` 时请求体为完整导出 JSON。

## 隐私说明

- 当前配置 `SUBMIT_ENDPOINT: null` 表示禁用远程提交，仅保留本地 JSON 下载。
- 启用远程提交前，请确保知情同意书中已说明数据将通过第三方服务（Formspree）收集。
- Formspree 服务器在美国，若伦理审查对数据存储地点有要求，请改用替代方案 A 或 B。
