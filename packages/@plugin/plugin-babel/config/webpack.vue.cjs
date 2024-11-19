const path = require("path");

module.exports = {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/, // Babel 处理 .js, .jsx, .ts, .tsx 文件
      exclude: /node_modules/, // 排除 node_modules 目录
      use: [
        {
          loader: "babel-loader",
          options: {
            // 使用 babel.config.js 配置
            configFile: path.resolve(__dirname, "babel.config.js"),
          },
        },
      ],
    },
  ],
  plugins: [],
};
