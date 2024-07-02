const PluginConfig = require("./config/index.cjs");

const pluginBabel = (buildTool, template) => {
  return PluginConfig(template)[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = pluginBabel;
