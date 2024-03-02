const { merge } = require("webpack-merge");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const copyWebpackPlugin = require("copy-webpack-plugin");
const { resolveApp, getPackagePath } = require("@laconic/utils");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const { gzip } = require("zlib");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const webpackCommonConfig = require("./webpack.common");

const topLevelFrameworkPaths = getPackagePath(["vue"], ".");

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
      new CompressionWebpackPlugin({
        filename: "[path][base].gz",
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
          const entrypointFiles = entryPoints.main.filter((fileName) => !fileName.endsWith(".map"));

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
        minSize: 20000,
        maxSize: 200000,
        cacheGroups: {
          vendor: {
            name: "vendors",
            test: /[\\/]node_modules[\\/]/,
            filename: "static/js/[id]_vendors.js",
            priority: 10,
          },
          vue: {
            test(module) {
              const resource = module.nameForCondition && module.nameForCondition();
              return resource
                ? topLevelFrameworkPaths.some((pkgPath) => resource.startsWith(pkgPath))
                : false;
            },
            chunks: "initial",
            filename: "vue.[contenthash].js",
            priority: 1,
            maxInitialRequests: 2,
            minChunks: 1,
          },
        },
      },
      runtimeChunk: {
        name: "runtime",
      },
    },
  },
  webpackCommonConfig,
);
