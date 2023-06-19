const { merge } = require("webpack-merge");
const path = require("node:path");
const { isUseTypescript, resolveApp } = require("@laconic/utils");
const CircularDependencyPlugin = require("circular-dependency-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const webpackCommonConfig = require("./webpack.common");
const ESLintPlugin = require("eslint-webpack-plugin");
const StylelintPlugin = require("stylelint-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = merge(
  {
    mode: "development",
    devtool: "inline-source-map",
    plugins: [
      isUseTypescript &&
        new ForkTsCheckerWebpackPlugin({
          async: false,
        }),
      new ESLintPlugin({
        extensions: ["js", "mjs", "jsx", "ts", "tsx", ".vue"],
        eslintPath: require.resolve("eslint"),
        context: resolveApp("./src"),
        cwd: resolveApp("."),
        cacheLocation: path.resolve(
          resolveApp("node_modules"),
          ".cache/.eslintcache"
        ),
      }),
      //  解决模块循环引入问题
      new CircularDependencyPlugin({
        exclude: /node_modules/,
        include: /src/,
        failOnError: true,
        allowAsyncCycles: false,
        cwd: process.cwd(),
      }),
      new StylelintPlugin({
        context: resolveApp("./src"),
      }),
      new VueLoaderPlugin(),
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
      store: "pack",
      cacheDirectory: resolveApp("node_modules/.cache"),
    },
    infrastructureLogging: {
      level: "none",
    },
  },
  webpackCommonConfig
);
