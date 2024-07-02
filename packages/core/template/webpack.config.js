const path = require("path");

module.exports = {
  entry: "./src/index.js", //入口文件
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [],
  module: {
    rules: [],
  },
};
