const { merge } = require("webpack-merge");
const webpackCommonConfig = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(webpackCommonConfig, {
  mode: "production",
  plugins: [
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash].css",
      chunkFilename: "static/css/[name].[contenthash].css",
      ignoreOrder: true,
    }),
  ],
});
