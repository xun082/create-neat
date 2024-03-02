const { merge } = require("webpack-merge");
const ESLintPlugin = require("eslint-webpack-plugin");
const path = require("path");
const { resolveApp, isUseTypescript } = require("@laconic/utils");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");

const webpackCommonConfig = require("./webpack.common");

module.exports = merge(
  {
    mode: "development",
    devtool: "inline-source-map",
    plugins: [
      new ESLintPlugin({
        extensions: ["js", "mjs", "jsx", "ts", "tsx"],
        eslintPath: require.resolve("eslint"),
        context: resolveApp("./src"),
        cwd: resolveApp("."),
        cacheLocation: path.resolve(resolveApp("node_modules"), ".cache/.eslintcache"),
      }),
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),

      isUseTypescript &&
        new ForkTsCheckerWebpackPlugin({
          async: false,
        }),
      //  解决模块循环引入问题
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        include: /src/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd(),
      }),
    ].filter(Boolean),
    optimization: {
      splitChunks: {
        chunks: "all",
      },
      runtimeChunk: {
        name: "runtime",
      },
    },
    cache: {
      type: "filesystem",
    },
  },
  webpackCommonConfig,
);
