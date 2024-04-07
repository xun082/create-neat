import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

import { resolveApp } from "./getResolveApp";

/**
 * 读取环境文件内容。
 * @param file 环境文件路径。
 * @param type 环境文件类型。
 * @returns 包含环境文件内容的 Buffer 对象。
 * @throws 如果文件不存在，则抛出错误。
 */
function readEnvFile(file: string, type: string): Buffer {
  if (!fs.existsSync(file)) {
    throw new Error(`You specified ${type} in your env, but the file "${file}" can't be found.`);
  }
  return fs.readFileSync(file);
}

/**
 * 验证证书和密钥是否有效。
 * @param cert 证书内容。
 * @param key 密钥内容。
 * @param keyFile 密钥文件路径。
 * @param crtFile 证书文件路径。
 * @throws 如果证书或密钥无效，则抛出错误。
 */
function validateKeyAndCerts({ cert, key, keyFile, crtFile }) {
  let encrypted: Buffer | undefined;
  try {
    encrypted = crypto.publicEncrypt(cert, Buffer.from("test"));
  } catch (err) {
    throw new Error(`The certificate "${crtFile}" is invalid.\n${err.message}`);
  }

  try {
    crypto.privateDecrypt(key, encrypted);
  } catch (err) {
    throw new Error(`The certificate key "${keyFile}" is invalid.\n${err.message}`);
  }
}

/**
 * 获取 HTTPS 配置信息。
 * @returns HTTPS 配置对象或布尔值（如果未启用 HTTPS）。
 */
function getHttpsConfig() {
  const { SSL_CRT_FILE, SSL_KEY_FILE, HTTPS } = process.env;
  const isHttps = HTTPS === "true";

  if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
    const crtFile: string = path.resolve(resolveApp("."), SSL_CRT_FILE);
    const keyFile: string = path.resolve(resolveApp("."), SSL_KEY_FILE);
    const config = {
      cert: readEnvFile(crtFile, "SSL_CRT_FILE"),
      key: readEnvFile(keyFile, "SSL_KEY_FILE"),
    };

    validateKeyAndCerts({ ...config, keyFile, crtFile });
    return config;
  }
  return isHttps;
}

export default getHttpsConfig;
