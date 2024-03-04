const webpack = require("webpack");
const { merge } = require("webpack-merge");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const prodWebpackConfig = require("../config/webpack.prod");

process.env.NODE_ENV = "production";

const webpackConfig = merge(
  {
    plugins: [new BundleAnalyzerPlugin()].filter(Boolean),
  },
  prodWebpackConfig,
);

webpack(webpackConfig, (err, _res) => {
  if (err) console.log(err);
});
