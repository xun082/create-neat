module.exports = {
  rules: [
    {
      test: /\.(tsx?|jsx?)$/,
      include: [path.resolve(__dirname, "./src")],
      loader: "babel-loader",
      options: {
        babelrc: true,
        cacheDirectory: true,
        cacheCompression: false,
        presets: [],
        plugins: [require.resolve("react-refresh/babel")].filter(Boolean),
      },
      exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
    },
  ],
  plugins: [],
};
