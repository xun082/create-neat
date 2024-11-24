const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlMinimizerPlugin = require('html-minimizer-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

<% if (framework === 'react') { %>
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
<% if (language === "typescript") { %>
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
<% } %>
<% } %>

<% if (framework === 'vue') { %>
const { VueLoaderPlugin } = require('vue-loader');
<% } %>
<%_ if (typeof(VueEjs)!= "undefined" && VueEjs.useElementPlus == true) { _%>
const ElementPlus = require('unplugin-element-plus/webpack');
<% } %>



let tsxOrJsxLoader;

  <% if (framework==='react' ) { %>
    tsxOrJsxLoader = {
    test: /\.(tsx?|jsx?)$/,
    include: [path.resolve(__dirname, "./src")],
    loader: "babel-loader",
    exclude: [/node_modules/, /public/, /(.|_)min\.js$/]
    }
  <% } %>


const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';
const isAnalyzer = process.env.CLI === "analyzer";

const developmentPlugins = isDevelopment ? [
  <% if (framework === 'react') { %>
  new ReactRefreshWebpackPlugin(),
  <% if (language === "typescript") { %>
  new ForkTsCheckerWebpackPlugin({ async: false }),
  <% } %>
  <% } %>
  <% if (typeof(VueEjs)!= "undefined" && VueEjs.useElementPlus == true ) { %>
    ElementPlus(),
  <% } %>
] : [];

const productionPlugins = isProduction ? [
  new MiniCssExtractPlugin({
    filename: 'static/css/[name].[contenthash].css',
    chunkFilename: 'static/css/[name].[contenthash].css',
    ignoreOrder: true,
  }),
  new CompressionWebpackPlugin({
    filename: '[path][base].gz',
    algorithm: 'gzip',
    test: /\.js$|\.json$|\.css/,
    threshold: 10240,
    minRatio: 0.8,
  }),
] : [];
<%
const paths = {
  react: {
    typescript: "'./src/index.tsx'",
    javascript: "'./src/index.jsx'",
  },
  vue: {
    typescript: "'./src/main.ts'",
    javascript: "'./src/main.js'",
  }
};
const defaultPath = "'./src/main.js'";
const selectedPath = paths[framework]?.[language] || defaultPath;
%>

module.exports = {
  stats: 'errors-warnings',
  entry: <%- selectedPath %>,
  mode: isDevelopment ? 'development' : 'production',
  output: {
    path: isDevelopment ? undefined : path.resolve(__dirname, './dist'),
    assetModuleFilename: 'assets/[hash][ext][query]',
    filename: isDevelopment
      ? 'static/js/[name].bundle.js'
      : 'static/js/[name].[contenthash:8].bundle.js',
    chunkFilename: isDevelopment
      ? 'static/js/[name].chunk.js'
      : 'static/js/[name].[contenthash:8].chunk.js',
    clean: true,
    pathinfo: false,
  },
  module: {
    rules: [
    {
        test: /\.css$/i,
        use: [
          isDevelopment ?
          <% if (framework === 'vue') { %>
          'vue-style-loader'
          <% } else { %>
          'style-loader'
          <% } %>
          : MiniCssExtractPlugin.loader,'css-loader','postcss-loader'].filter(Boolean),
      },
      tsxOrJsxLoader,
      {
        test: /\.(jpe?g|png|gif|webp|svg|mp4)$/,
        type: 'asset',
        generator: {
          filename: './images/[hash:8][ext][query]',
        },
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
      },
      <% if (plugin ==='sass' ) { %>
      {
        test: /\.s[ac]ss$/i,
        use: [
            'style-loader', 
            'css-loader',   
            'sass-loader',  
        ],
      },
      <% } %>
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: './assets/fonts/[hash][ext][query]',
        },
      },
      <% if (framework === 'vue') { %>
      {
        test: /\.vue$/,
        use: [
          {
            loader: "vue-loader",
            options: {
              compilerOptions: {
                preserveWhitespace: false,
              },
              hotReload: isDevelopment,
            },
          },
        ],
      },
      <% } %>
    ].filter(Boolean),
  },
  resolve: {
    extensions: [<% if (framework === 'vue') { %>'.vue', <% } %>'.js', '.jsx', '.ts', '.tsx'],
    alias: {
      '@pages': './src/pages',
      '@': './src',
    },
  },
  plugins: [
  ...productionPlugins,
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      title: 'moment',
      inject: true,
      hash: true,
      minify: isDevelopment
        ? false
        : {
            removeComments: true,
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
            caseSensitive: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeStyleLinkTypeAttributes: true,
            removeScriptTypeAttributes: true,
            useShortDoctype: true,
          },
    }),
    new DefinePlugin({
      BASE_URL: '"./"',
      'process.env': JSON.stringify(process.env),
    }),
    ...developmentPlugins,
    <% if (framework === 'vue') { %>
      new VueLoaderPlugin(),
    <% } %>
    isAnalyzer ? new BundleAnalyzerPlugin() : false
  ].filter(Boolean),
  performance: isProduction
    ? {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
      }
    : undefined,
  optimization: isProduction
    ? {
        chunkIds: 'named',
        moduleIds: 'deterministic',
        minimize: true,
        usedExports: true,
        minimizer: [
          new TerserPlugin({
            test: /\.(tsx?|jsx?)$/,
            include: [path.resolve(__dirname, './src')],
            exclude: /node_modules/,
            parallel: true,
            terserOptions: {
              toplevel: true,
              ie8: true,
              safari10: true,
              compress: {
                arguments: false,
                dead_code: true,
                pure_funcs: ['console.log'],
              },
            },
          }),
          new CssMinimizerPlugin(),
          new HtmlMinimizerPlugin(),
        ],
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              name: 'vendors',
              enforce: true,
              test: /[\\/]node_modules[\\/]/,
              filename: 'static/js/[id]_vendors.js',
              priority: 10,
            },
          },
        },
        runtimeChunk: {
          name: 'runtime',
        },
      }
    : undefined,
};
