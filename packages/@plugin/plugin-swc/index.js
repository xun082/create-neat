const PluginConfig = require("./config/webpack.config");

const pluginBabel = (buildTool) => {
  return PluginConfig[buildTool] ?? console.warn(`Unsupported build tool: ${buildTool}`);
};

module.exports = pluginBabel;
