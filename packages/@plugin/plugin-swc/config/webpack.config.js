module.exports = {
  rules: [
    {
      test: /\.(ts|tsx|js|jsx)$/,
      exclude: /node_modules/,
      use: {
        loader: "swc-loader",
        exclude: /node_modules/,
      },
    },
  ],
};
