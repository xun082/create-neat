const { resolveApp } = require("@obstinate/utils");
const { createHash } = require("crypto");
const package = require(resolveApp("./package.json"));

function useCssPreset(preset) {
  return (
    package.dependencies.hasOwnProperty(preset) ||
    package.devDependencies.hasOwnProperty(preset)
  );
}

function createEnvironmentHash(env) {
  const hash = createHash("md5");
  hash.update(JSON.stringify(env));

  return hash.digest("hex");
}

module.exports = {
  useCssPreset,
  createEnvironmentHash,
};
