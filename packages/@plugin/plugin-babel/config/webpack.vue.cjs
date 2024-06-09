const path = require("path");

module.exports = {
  rules: [
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
    {
      test: /\.(tsx?|jsx?)$/,
      include: [path.resolve(__dirname, "./src")],
      exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
      use: [
        {
          loader: "babel-loader",
          options: {
            babelrc: true,
            cacheDirectory: true,
            cacheCompression: false,
          },
        },
        // require.resolve("@ant-design-vue/vue-jsx-hot-loader"),
      ],
    },
  ],
  plugins: [],
};
