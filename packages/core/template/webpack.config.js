const path = require("path");

module.exports = {
  entry: "./src/index.jsx", //入口文件
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [],
  module: {
    rules: [],
  },
};
