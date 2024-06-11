process.env.NODE_ENV = "production";

const webpack = require("webpack");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const prodWebpackConfig = require("../../webpack.config.js");

const webpackConfig = merge(
  {
    plugins: [new BundleAnalyzerPlugin()].filter(Boolean),
  },
  prodWebpackConfig,
);

webpack(webpackConfig, (err, _res) => {
  if (err) console.log(err);
});
