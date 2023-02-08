const { merge } = require("webpack-merge");
const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");
const { resolveApp } = require("candy-dev-utils");
const webpackCommonConfig = require("./webpack.common");

module.exports = merge(webpackCommonConfig, {
  mode: "development",
  devtool: "inline-source-map",
  plugins: [
    new ESLintPlugin({
      extensions: ["js", "mjs", "jsx", "ts", "tsx"],
      eslintPath: require.resolve("eslint"),
      context: resolveApp("."),
      cwd: resolveApp("."),
      cacheLocation: path.resolve(
        resolveApp("node_modules"),
        ".cache/.eslintcache"
      ),
    }),
  ],
});
