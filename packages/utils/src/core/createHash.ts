import { createHash } from "node:crypto";
/**
 * 表示环境配置的对象。
 * @typedef {Object.<string, string | number>} envConfig
 */
interface envConfig {
  [props: string]: string | number;
}
/**
 * 根据提供的环境配置创建哈希值。
 * @param {envConfig} env 环境配置对象。
 * @returns {string} 环境配置的 MD5 哈希值。
 */
function createEnvironmentHash(env: envConfig) {
  const hash = createHash("md5");
  hash.update(JSON.stringify(env));

  return hash.digest("hex");
}

export { createEnvironmentHash };
