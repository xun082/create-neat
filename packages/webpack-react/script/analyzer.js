process.env.NODE_ENV = "production";

const webpack = require("webpack");
const prodWebpackConfig = require("../config/webpack.prod");
const { merge } = require("webpack-merge");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const webpackConfig = merge(
  {
    plugins: [new BundleAnalyzerPlugin()].filter(Boolean),
  },
  prodWebpackConfig
);

webpack(webpackConfig, (err, res) => {
  if (err) console.log(err);
});
