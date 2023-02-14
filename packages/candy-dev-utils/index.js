const path = require("path");
const fs = require("fs");
const devServerConfig = require("./devServerConfig");
const getIPAddress = require("./getIpAddress");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const isUseTypescript = fs.existsSync(resolveApp("./tsconfig.json"));

module.exports = {
  resolveApp,
  isUseTypescript,
  devServerConfig,
  getIPAddress,
};
