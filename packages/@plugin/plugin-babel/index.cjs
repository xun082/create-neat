const PluginConfig = require("./config/index.cjs");

const pluginBabel = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = pluginBabel;
