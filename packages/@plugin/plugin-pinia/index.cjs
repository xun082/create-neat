const PluginConfig = require("./config/index.cjs");

const pluginElement = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};
module.exports = pluginElement;
