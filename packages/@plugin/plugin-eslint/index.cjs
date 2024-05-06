const buildToolConfigs = {
  webpack: (config) => {
    if (config.resolve.alias) {
      config.resolve.alias.set("a", "b");
    } else {
      config.resolve.alias = {
        a: "b"
      };
    }
  },
  vite: (options) => {
    options.alias = [{
      find: "a",
      replacement: "b"
    }];
  },
  // 添加其他构建工具的配置...
};

const pluginEslint = (api, options) => {
  const {
    buildTool
  } = options.preset;
  const configHandler = buildToolConfigs[buildTool];

  if (configHandler) {
    configHandler(api, options);
  } else {
    console.warn(`Unsupported build tool: ${buildTool}`);
  }

  // 其他独立于构建工具的配置
  // ……
};

module.exports = {
  pluginEslint
};
