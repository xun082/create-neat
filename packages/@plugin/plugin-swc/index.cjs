const PluginConfig = require("./config/index.cjs");

const pluginSwc = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = {
  pluginSwc,
};
