const vite = require("./vite.cjs");
const webpackConfig = require("./webpack.vue.cjs");

const templateConfigs = {
  vite,
  webpack: webpackConfig,
};

module.exports = templateConfigs;
