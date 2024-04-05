import { createHash } from "node:crypto";

/**
 * 创建环境哈希值，基于环境配置生成 MD5 哈希。
 * 
 * @param env - 包含环境配置的对象，键为配置属性名，值为配置值。
 * @returns 表示环境哈希的十六进制字符串。
 */
interface envConfig {
  [props: string]: string | number;
}

function createEnvironmentHash(env: envConfig) {
  const hash = createHash("md5");
  hash.update(JSON.stringify(env));

  return hash.digest("hex");
}

export { createEnvironmentHash };
