const buildToolConfigs = {
  webpack: () => {
    return {
      rules: [{}],
    };
  },
  vite: () => {
    return {};
  },
  // 添加其他构建工具的配置...
};

const pluginVue = (buildTool) => {
  const configHandler = buildToolConfigs[buildTool];

  if (configHandler) {
    return configHandler();
  } else {
    console.warn(`Unsupported build tool: ${buildTool}`);
  }
  // 其他独立于构建工具的配置
  // ……
};

module.exports = pluginVue;
