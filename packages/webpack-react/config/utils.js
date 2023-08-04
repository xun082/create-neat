const { resolveApp, getJsonFileInfo } = require("@laconic/utils");

function useCssPreset(preset) {
  const packageInfo = getJsonFileInfo(resolveApp("package.json"));

  return (
    packageInfo.dependencies.hasOwnProperty(preset) ||
    packageInfo.devDependencies.hasOwnProperty(preset)
  );
}

module.exports = {
  useCssPreset,
};
