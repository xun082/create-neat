const buildToolConfigs = {
  // 支持拓展loader和plugin
  webpack: () => {
    return {
      rules: [
        {
          test: /\ts$/, // 匹配所有以 .ts 结尾的文件
          exclude: /node_modules/, // 排除 node_modules 目录
          use: {
            loader: "ts-loader", // 指定 Babel Loader
          },
        },
      ],
    };
  },
  vite: () => {
    return {};
  },
  // 添加其他构建工具的配置...
};

const pluginTypescript = (buildTool) => {
  const configHandler = buildToolConfigs[buildTool];

  if (configHandler) {
    return configHandler();
  } else {
    console.warn(`Unsupported build tool: ${buildTool}`);
  }

  // 其他独立于构建工具的配置
  // ……
};

module.exports = pluginTypescript;
