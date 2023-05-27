const { merge } = require("webpack-merge");
const webpackCommonConfig = require("./webpack.common");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const { resolveApp } = require("@obstinate/utils");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const { gzip } = require("zlib");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(
  {
    mode: "production",
    plugins: [
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash].css",
        chunkFilename: "static/css/[name].[contenthash].css",
        ignoreOrder: true,
      }),
      new copyWebpackPlugin({
        patterns: [
          {
            from: resolveApp("./public"),
            to: "./",
            globOptions: {
              dot: true,
              gitignore: true,
              ignore: ["**/index.html*"],
            },
          },
        ],
      }),
      // 打包体积分析
      new BundleAnalyzerPlugin(),
      new CompressionWebpackPlugin({
        filename: "[path][base].gz",
        algorithm: "gzip",
        test: /\.js$|\.json$|\.css/,
        threshold: 10240, // 只有大小大于该值的资源会被处理
        minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
        algorithm: gzip,
      }),
      // 生成目录文件
      new WebpackManifestPlugin({
        fileName: "asset-manifest.json",
        generate: (seed, files, entryPoints) => {
          const manifestFiles = files.reduce((manifest, file) => {
            if (manifest) manifest[file.name] = file.path;
            return manifest;
          }, seed);
          const entrypointFiles = entryPoints.main.filter(
            (fileName) => !fileName.endsWith(".map")
          );

          return {
            files: manifestFiles,
            entryPoints: entrypointFiles,
          };
        },
      }),
    ].filter(Boolean),
    optimization: {
      chunkIds: "named",
      moduleIds: "deterministic", //单独模块id，模块内容变化再更新
      minimize: true,
      usedExports: true,
      minimizer: [
        new TerserPlugin({
          //   test: /\.(tsx?|jsx?|vue)$/,
          include: resolveApp("./src"),
          exclude: /node_module/,
          parallel: true,
          terserOptions: {
            toplevel: true, // 最高级别，删除无用代码
            ie8: true,
            safari10: true,
            compress: {
              arguments: false,
              dead_code: true,
              pure_funcs: ["console.log"], // 删除console.log
            },
          },
        }),
        // 优化和缩小 html 和 css
        new CssMinimizerPlugin(),
        new HtmlMinimizerPlugin(),
      ],
      // 分包
      splitChunks: {
        chunks: "all",
      },
    },
  },
  webpackCommonConfig
);
