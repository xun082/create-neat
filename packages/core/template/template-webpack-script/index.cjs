const frameworkConfigs = {
  vue: () => {
    return {};
  },

  react: () => {
    return {};
  },
};

const pluginWebpackScript = (framework) => {
  const configHandler = frameworkConfigs[framework];

  if (configHandler) {
    return configHandler();
  } else {
    console.warn(`Unsupported build tool: ${buildTool}`);
  }
};

module.exports = pluginWebpackScript;
