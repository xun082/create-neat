const vite = require("./vite.cjs");
const webpackConfig = require("./webpack.vue.cjs");

const templateConfigs = {
  vite,
  webpack: webpackConfig,
  //基于AST注入有问题，语法出现错误，且没有import部分
};

module.exports = templateConfigs;
