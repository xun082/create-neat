module.exports = {
  rules: [
    {
      test: /\.js$/, // 匹配所有以 .js 结尾的文件
      exclude: /node_modules/, // 排除 node_modules 目录
      use: {
        loader: "babel-loader", // 指定 Babel Loader
      },
    },
  ],
  plugins: [],
};
