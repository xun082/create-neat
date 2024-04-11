import { createHash } from "node:crypto";

interface envConfig {
  [props: string]: string | number;
}

/**
 * 创建基于环境配置的哈希值。
 * @param env 环境配置对象。
 * @returns 表示环境配置哈希的十六进制字符串。
 */
function createEnvironmentHash(env: envConfig) {
  const hash = createHash("md5");
  hash.update(JSON.stringify(env));

  return hash.digest("hex");
}

export { createEnvironmentHash };
