const HtmlWebpackPlugin = require("html-webpack-plugin");
const WebpackBar = require("webpackbar");
const { paths } = require("./utils/index");

module.exports = {
  stats: "errors-only",
  entry: paths("./index.js"),
  plugins: [new WebpackBar()],
};
