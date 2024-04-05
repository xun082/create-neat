import path from "node:path";
import fs from "node:fs";
import crypto from "node:crypto";

import { resolveApp } from "./getResolveApp";

/**
 * 读取环境文件并返回其内容的缓冲区。
 * 
 * @param file - 要读取的文件路径。
 * @param type - 文件的类型描述。
 * @returns 包含文件内容的缓冲区。
 * @throws 如果文件不存在，则抛出错误。
 */
function readEnvFile(file: string, type: string): Buffer {
  if (!fs.existsSync(file)) {
    throw new Error(`You specified ${type} in your env, but the file "${file}" can't be found.`);
  }
  return fs.readFileSync(file);
}

/**
 * 验证证书和密钥的有效性。
 * 
 * @param param0 - 包含证书和密钥信息的对象。
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
 * 获取 HTTPS 配置。
 * 
 * @returns 如果启用 HTTPS，则返回包含证书和密钥的配置对象；否则返回 false。
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
