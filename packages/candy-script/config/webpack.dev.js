const { paths } = require("./utils");

const { merge } = require("webpack-merge");
const webpackCommonConfig = require("./webpack.common");
const portFinder = require("portfinder");
const FriendlyErrorsWebpackPlugin = require("@nuxt/friendly-errors-webpack-plugin");

module.exports = merge(webpackCommonConfig, {
  mode: "development",
  devtool: "inline-source-map",
  output: {
    filename: "[name].bundle.js",
    path: paths("./dist"),
  },
});
