const PluginConfig = require("./generator/index.cjs");

const pluginSass = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = {
  pluginSass,
};
