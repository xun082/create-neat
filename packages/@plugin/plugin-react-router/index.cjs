const PluginConfig = require("./generator/index.cjs");

const pluginReactrouter = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = {
  pluginReactrouter,
};
