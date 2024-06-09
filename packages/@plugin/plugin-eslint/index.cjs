const PluginConfig = require("./generator/index.cjs");

const pluginEslint = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = {
  pluginEslint,
};
