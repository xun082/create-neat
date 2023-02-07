const { merge } = require("webpack-merge");
const webpackCommonConfig = require("./webpack.common");
const { paths } = require("./utils");

console.log(paths("./dist"));

module.exports = merge(webpackCommonConfig, {
  mode: "production",
  output: {
    filename: "index.js",
    publicPath: "./",
    path: paths("./dist"),
  },
});
