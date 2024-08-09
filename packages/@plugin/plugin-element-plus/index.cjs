const PluginConfig = require("./generator/index.cjs");

const pluginElement = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = {
  pluginElement,
};
