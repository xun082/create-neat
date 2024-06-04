const PluginConfig = require("./generator/index.cjs");

const pluginSwc = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = {
  pluginSwc,
};
