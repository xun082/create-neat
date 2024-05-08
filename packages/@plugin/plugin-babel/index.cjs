const buildToolConfigs = {
  // 支持拓展loader和plugin
  webpack: () => {
    return {
      rules: [
        {
          test: /\.js$/, // 匹配所有以 .js 结尾的文件
          exclude: /node_modules/, // 排除 node_modules 目录
          use: {
            loader: "babel-loader", // 指定 Babel Loader
          },
        },
      ],
      plugins: [{ name: "a", params: [], import: { name: "a", from: "b" } }],
    };
  },
  vite: () => {
    return {
      plugins: [
        {
          name: "legacy",
          params: {
            targets: [
              "> 1%",
              "not ie 11",
              "not op_mini all",
              "chrome >= 78",
              "edge >= 78",
              "firefox >= 72",
              "safari >= 13",
              "opera >= 67",
            ],
          },
          import: { name: "legacy", from: "@vitejs/plugin-legacy" },
        },
        {
          name: "test",
          params: {
            a: "test",
          },
          import: { name: "test", from: "@test" },
        },
      ]
    };
  },
  // 添加其他构建工具的配置...
};

const pluginBabel = (buildTool) => {
  const configHandler = buildToolConfigs[buildTool];

  if (configHandler) {
    return configHandler();
  } else {
    console.warn(`Unsupported build tool: ${buildTool}`);
  }

  // 其他独立于构建工具的配置
  // ……
};

module.exports = pluginBabel;
