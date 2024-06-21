const PluginConfig = require("./generator/index.cjs");

const pluginMobx = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = {
  pluginMobx,
};
