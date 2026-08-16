# MisVis Verify 远程数据提交配置

实验完成后可自动把 JSON 数据 POST 到后端。本文推荐使用**腾讯云函数（SCF）+ 函数URL + 对象存储 COS**——国内直连，参与者无需 VPN。

## 推荐方案：腾讯云函数（SCF）

架构：

```
参与者浏览器 ──POST JSON──> 函数URL（开放鉴权 + CORS）──> SCF 函数 ──> COS 桶（存 JSON 文件）
```

函数代码是**零第三方依赖**（只用 Python 标准库手写 COS 签名），部署只需粘贴一个文件，无需安装任何依赖、无需打包。

### 第 1 步：实名认证与开通服务

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com)，完成**个人实名认证**（微信扫码/人脸即可）。
2. 搜索并开通两个产品（都有免费额度，pilot 足够）：
   - **对象存储 COS**
   - **云函数 SCF**

### 第 2 步：创建 COS 存储桶

1. COS 控制台 → 存储桶列表 → 创建存储桶。
2. 名称填 `mis-vis-verify`（系统会自动加 `-appid` 后缀，桶全名类似 `mis-vis-verify-1410269681`）。
3. 地域选择：记下来，如 **广州（ap-guangzhou）**，需与后面函数地域一致。
4. 访问权限保持**私有读写**（不对外公开）。

> 记住「桶全名」= `mis-vis-verify-1410269681`（**含 `-appid` 后缀**），后面要填到函数环境变量。

### 第 3 步：创建 SCF 函数

1. 云函数控制台 → 函数服务 → 新建。
2. 创建方式：**从头开始**；函数名：`misvis-collector`；地域：同 COS。
3. 运行环境：**Python 3.9**。
4. 把 `deploy/tencent-scf/main.py` 的完整内容粘贴为函数代码（**无需安装任何依赖**）。
5. 环境变量（函数配置 → 环境变量）：
   | 变量 | 值 |
   |---|---|
   | `BUCKET` | `mis-vis-verify-1410269681`（**桶全名，含 -appid 后缀**） |
   | `REGION` | `ap-guangzhou`（与 COS/函数地域一致） |
6. 执行超时时间调到 **10 秒**（默认 3 秒可能不够写 COS）。

### 第 4 步：给函数授予 COS 写入权限

1. 函数「函数配置 → 权限配置」看到**执行角色**（默认 `SCF_QcsRole` 或新建角色）。
2. 打开 [CAM 访问管理](https://console.cloud.tencent.com/cam/role)，找到该角色 → 关联策略 → 附加 **`QcloudCOSFullAccess`**（或最小权限：只允许对 `mis-vis-verify-1410269681` 桶做 `PutObject`）。
3. 授权后 SCF 会自动把临时密钥注入环境变量，代码会直接使用，无需手动配置密钥。

### 第 5 步：开启函数URL

> 注意：腾讯云 API 网关已于 2025 年停服，改用**函数URL**（更简单）。

1. 函数 `misvis-collector` → **函数配置** → 找到 **「函数URL」** → 开启。
2. 配置：
   - **授权类型：开放**（免鉴权，否则参与者无法匿名提交）
   - **公网访问：启用**
   - **CORS：启用**，填：
     - Allow-Origin：`*`
     - Allow-Methods：`POST`、`OPTIONS`
     - Allow-Headers：`*`
     - Expose-Headers：`*`（不能留空）
     - Allow-Credentials：**关闭**
   - **参数兼容：启用**（让函数按 API 网关事件格式接收请求）
3. 保存后得到**访问路径**，形如：
   ```
   https://1410269681-jidfh6rb4r.ap-guangzhou.tencentscf.com
   ```

### 第 6 步：填入前端

打开 `study/data/config.js`：

```javascript
window.MISVIS_VERIFY_CONFIG = {
  SUBMIT_ENDPOINT: 'https://1410269681-jidfh6rb4r.ap-guangzhou.tencentscf.com',
  SUBMIT_METHOD: 'POST',
  SUBMIT_FORMAT: 'raw'
};
```

### 第 7 步：测试

1. 用浏览器完成一次实验，点完成页「将结果发送给研究者」。
2. 应显示绿色成功提示。
3. 到 COS 控制台 → 存储桶 `mis-vis-verify-1410269681` → 应出现 `misvis/<participant_id>/<uuid>.json` 文件。

### 数据下载

COS 控制台批量下载 `misvis/` 目录下所有 JSON 文件，放进一个目录后用 `analysis/prepare_data.py` 处理即可。

---

## 配套：把实验页面也放在国内（参与者全程免 VPN）

数据回传解决后，实验页面本身也建议用国内托管，形成完整闭环：

- 用 **COS 静态网站托管**：把项目里 `study.html`、`study/` 目录上传到 COS 桶，开启「静态网站」功能，得到 `https://<bucket>.cos-website.ap-guangzhou.myqcloud.com` 地址。参与者大陆直连秒开。
- 分享链接：`https://<bucket>.cos-website.<region>.myqcloud.com/study.html?mode=study`（正式）或 `?mode=pilot`（试测）。

---

## 备选方案

### 方案 A：Formspree（境外，需参与者可访问 formspree.io）

注册 formspree.io 建表单，`config.js` 里：
```javascript
SUBMIT_ENDPOINT: 'https://formspree.io/f/xxxxxxxx',
SUBMIT_FORMAT: 'formspree'
```
免费版每月 50 次提交。大陆参与者若无法直连 formspree.io，会自动降级为「下载 JSON 文件」提示。

### 方案 B：微信回收（零后端，最简）

`SUBMIT_ENDPOINT: null`，参与者完成页下载 JSON 文件后微信发回，研究者手动汇总进 `prepare_data.py`。适合 pilot 小样本。

### 方案 C：自有后端

任何支持 CORS 的 HTTP POST 接口均可，`SUBMIT_FORMAT: 'raw'` 时请求体为完整导出 JSON。

## 隐私说明

- `SUBMIT_ENDPOINT: null` 表示禁用远程提交，仅本地下载。
- 启用远程提交前，请确保知情同意书已说明数据将通过对应服务收集与存储。
