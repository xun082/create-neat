const { resolveApp } = require("@cloud-dream/dev-utils");

const package = require(resolveApp("./package.json"));

function useCssPreset(preset) {
  return (
    package.dependencies.hasOwnProperty(preset) ||
    package.devDependencies.hasOwnProperty(preset)
  );
}

module.exports = {
  useCssPreset,
};
