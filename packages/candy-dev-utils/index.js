const path = require("path");
const fs = require("fs");
const devServerConfig = require("./devServerConfig");
const getIPAddress = require("./getIpAddress");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const package = require(resolveApp("./package.json"));

function useCssPreset(preset) {
  return (
    package.dependencies.hasOwnProperty(preset) ||
    package.devDependencies.hasOwnProperty(preset)
  );
}

const isUseTypescript = fs.existsSync(resolveApp("./tsconfig.json"));

module.exports = {
  resolveApp,
  package,
  useCssPreset,
  isUseTypescript,
  devServerConfig,
  getIPAddress,
};
