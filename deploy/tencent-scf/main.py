# -*- coding: utf-8 -*-
"""MisVis Verify 数据接收函数（腾讯云 SCF + 函数URL + COS）

零第三方依赖：只用 Python 标准库，手工实现 COS PUT Object 签名。
部署只需把本文件粘贴为函数代码，无需安装任何依赖。

需要：
1. 环境变量 BUCKET（COS 桶全名，含 -appid，如 mis-vis-verify-1410269681）、
   REGION（如 ap-guangzhou）。
2. 函数「运行角色」具备 COS 写权限（临时密钥自动注入），
   或环境变量 SECRET_ID / SECRET_KEY（可选 SECRET_TOKEN）。
"""
import base64
import hashlib
import hmac
import json
import os
import time
import uuid
from urllib import request as urllib_request

BUCKET = os.environ.get("BUCKET", "")
REGION = os.environ.get("REGION", "ap-guangzhou")

_CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST,OPTIONS",
}


def _response(status, payload):
    return {
        "isBase64Encoded": False,
        "statusCode": status,
        "headers": _CORS_HEADERS,
        "body": json.dumps(payload, ensure_ascii=False),
    }


def _sha1_hex(data_bytes):
    return hashlib.sha1(data_bytes).hexdigest()


def _put_object(key, body):
    secret_id = os.environ.get("TENCENTCLOUD_SECRETID") or os.environ.get("SECRET_ID")
    secret_key = os.environ.get("TENCENTCLOUD_SECRETKEY") or os.environ.get("SECRET_KEY")
    token = os.environ.get("TENCENTCLOUD_SESSIONTOKEN") or os.environ.get("SECRET_TOKEN")
    if not secret_id or not secret_key:
        raise RuntimeError("missing credentials (运行角色未配置或缺少 SECRET_ID/SECRET_KEY)")

    host = "{}.cos.{}.myqcloud.com".format(BUCKET, REGION)
    path = "/" + key
    url = "https://{}{}".format(host, path)

    now = int(time.time())
    start = now - 60
    end = now + 3600
    sign_time = "{};{}".format(start, end)

    # SignKey = HMAC-SHA1(SecretKey, KeyTime)，返回原始字节
    sign_key = hmac.new(secret_key.encode("utf-8"), sign_time.encode("utf-8"), hashlib.sha1).digest()

    http_string = "put\n{}\n\nhost={}\n".format(path, host)
    string_to_sign = "sha1\n{}\n{}\n".format(sign_time, _sha1_hex(http_string.encode("utf-8")))

    signature = hmac.new(sign_key, string_to_sign.encode("utf-8"), hashlib.sha1).hexdigest()

    authorization = (
        "q-sign-algorithm=sha1&q-ak={ak}&q-sign-time={st}&q-key-time={st}"
        "&q-header-list=host&q-url-param-list=&q-signature={sig}"
    ).format(ak=secret_id, st=sign_time, sig=signature)

    headers = {
        "Host": host,
        "Authorization": authorization,
        "Content-Type": "application/json",
    }
    if token:
        headers["x-cos-security-token"] = token

    req = urllib_request.Request(url, data=body, headers=headers, method="PUT")
    with urllib_request.urlopen(req, timeout=10) as resp:
        return resp.status


def main_handler(event, context):
    method = (event.get("httpMethod") or event.get("requestContext", {}).get("httpMethod") or "").upper()
    if method == "OPTIONS":
        return _response(200, {"ok": True})

    raw = event.get("body", "")
    if event.get("isBase64Encoded"):
        raw = base64.b64decode(raw).decode("utf-8")

    try:
        data = json.loads(raw)
    except Exception:
        return _response(400, {"ok": False, "error": "invalid json"})

    pid = (data.get("session") or {}).get("participant_id") or "unknown"
    key = "misvis/{}/{}.json".format(pid, uuid.uuid4().hex)

    try:
        _put_object(key, raw.encode("utf-8"))
    except Exception as e:
        return _response(500, {"ok": False, "error": "storage error: {}".format(e)})

    return _response(200, {"ok": True})
