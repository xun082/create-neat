const fs = require("node:fs");

const resolveApp = require("./getPaths");
const getIPAddress = require("./getIpAddress");
const devServerConfig = require("./devServerConfig");

const isUseTypescript = fs.existsSync(resolveApp("./tsconfig.json"));

module.exports = {
  resolveApp,
  isUseTypescript,
  devServerConfig,
  getIPAddress,
};
