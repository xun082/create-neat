const HtmlWebpackPlugin = require("html-webpack-plugin");
const { DefinePlugin } = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { resolveApp, isUseTypescript } = require("@obstinate/utils");
const { merge } = require("webpack-merge");
const { useCssPreset } = require("./helper");
const isDevelopment = process.env.NODE_ENV === "development";
const getClientEnvironment = require("./env");
const { createEnvironmentHash } = require("./helper");
const fs = require("node:fs");
const userWebpackConfig = resolveApp("./webpack.config.js");

const env = getClientEnvironment();

module.exports = merge(
  {
    stats: "errors-warnings",
    entry: resolveApp(isUseTypescript ? "./src/index.tsx" : "./src/index.jsx"),
    output: {
      path: isDevelopment ? undefined : resolveApp("./dist"),
      // 图片、字体资源
      assetModuleFilename: "assets/[hash][ext][query]",
      filename: isDevelopment
        ? "static/js/[name].bundle.js"
        : "static/js/[name].[contenthash:8].bundle.js",
      // 动态导入资源
      chunkFilename: isDevelopment
        ? "static/js/[name].chunk.js"
        : "static/js/[name].[contenthash:8].chunk.js",
      // webpack5内置了 clean-webpack-plugin,只需将 clean 设置为 true
      clean: true,
      pathinfo: false, // 关闭 Webpack 在输出的 bundle 中生成路径信息
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            require.resolve("style-loader"),
            require.resolve("css-loader"),
            require.resolve("postcss-loader"),
          ],
        },
        {
          test: /\.scss$|\.less$/i,
          include: [resolveApp("./src")],
          exclude: /node_module/,
          use: [
            isDevelopment
              ? require.resolve("style-loader")
              : MiniCssExtractPlugin.loader,
            {
              loader: require.resolve("css-loader"),
              options: {
                sourceMap: isDevelopment, // 在开发环境下开启
                modules: {
                  mode: "local",
                  auto: true,
                  exportGlobals: true,
                  localIdentName: isDevelopment
                    ? "[path][name]__[local]--[hash:base64:5]"
                    : "[local]--[hash:base64:5]",
                  localIdentContext: resolveApp("./src"),
                  exportLocalsConvention: "camelCase",
                },
                importLoaders: 2,
              },
            },
            {
              loader: require.resolve("postcss-loader"),
              options: {
                postcssOptions: {
                  plugins: [require("autoprefixer")],
                },
              },
            },
            useCssPreset("sass") && require.resolve("sass-loader"),
            useCssPreset("less") && require.resolve("less-loader"),
          ].filter(Boolean),
        },
        // 处理图片
        {
          test: /\.(jpe?g|png|gif|webp|svg|mp4)$/,
          type: "asset",
          // 文件生成路径
          generator: {
            filename: "./images/[hash:8][ext][query]",
          },
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 小于10kb会被压缩成base64
            },
          },
        },
        // 处理字体
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: "asset/resource",
          generator: {
            filename: "./assets/fonts/[hash][ext][query]",
          },
        },
        // 处理js
        {
          test: /\.(tsx?|jsx?)$/,
          include: [resolveApp("./src")],
          loader: require.resolve("babel-loader"),
          options: {
            babelrc: true,
            cacheDirectory: true,
            cacheCompression: false, // 缓存不压缩
            presets: [
              require.resolve("@babel/preset-react"),
              isUseTypescript && require.resolve("@babel/preset-typescript"),
              [
                require.resolve("@babel/preset-env"),
                {
                  useBuiltIns: "usage", // 代码中需要那些polyfill,就引用相关的api
                  corejs: 3, // 配置使用core-js低版本
                },
              ],
            ].filter(Boolean),
            plugins: [
              isDevelopment && require.resolve("react-refresh/babel"), // 激活 js 的 HMR
              require.resolve("@babel/plugin-transform-runtime"),
              require.resolve("@babel/plugin-syntax-dynamic-import"),
            ].filter(Boolean),
          },
          exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
        },
      ].filter(Boolean),
    },
    resolve: {
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      alias: {
        "@pages": resolveApp("scr/pages"),
        "@": resolveApp("src"),
      },
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: resolveApp("./public/index.html"),
        filename: "index.html",
        title: "moment",
        inject: true,
        hash: true,
        minify: isDevelopment
          ? false
          : {
              // https://github.com/terser/html-minifier-terser#options-quick-reference
              removeComments: true, // 删除注释
              collapseWhitespace: true, //是否去除空格
              minifyCSS: true, // 压缩 HTML 中的 css 代码
              minifyJS: true, // 压缩 HTML 中出现的 JS 代码
              caseSensitive: true, // 区分大小写
              removeRedundantAttributes: true, // 当值与默认值匹配时删除属性。
              removeEmptyAttributes: true, // 删除所有只有空白值的属性
              removeStyleLinkTypeAttributes: true, // 从样式和链接标签中删除type="text/css"。其他类型属性值保持不变
              removeScriptTypeAttributes: true, // 从脚本标签中删除type="text/javascript"其他类型属性值保持不变
              useShortDoctype: true, // 将文档类型替换为短(HTML5)文档类型
            },
      }),
      // 定义全局常量
      new DefinePlugin({
        BASE_URL: '"./"',
        ...env.stringified,
      }),
    ].filter(Boolean),
    cache: {
      type: "filesystem",
      version: createEnvironmentHash(env.raw),
      store: "pack",
      cacheDirectory: resolveApp("node_modules/.cache"),
    },
    infrastructureLogging: {
      level: "none",
    },
  },
  fs.existsSync(userWebpackConfig) && require(userWebpackConfig)
);
