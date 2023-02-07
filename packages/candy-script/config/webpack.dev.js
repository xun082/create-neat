const { merge } = require("webpack-merge");
const webpackCommonConfig = require("./webpack.common");

module.exports = merge(webpackCommonConfig, {
  mode: "development",
  devtool: "inline-source-map",
});
