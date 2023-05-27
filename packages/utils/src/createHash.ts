import { createHash } from "node:crypto";

interface envConfig {
  [props: string]: string | number;
}

function createEnvironmentHash(env: envConfig) {
  const hash = createHash("md5");
  hash.update(JSON.stringify(env));

  return hash.digest("hex");
}

export default createEnvironmentHash;
