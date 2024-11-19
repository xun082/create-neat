const path = require("path");

module.exports = {
  rules: [
    {
      test: /\.(js|jsx|ts|tsx)$/, 
      exclude: /node_modules/, 
      use: {
        loader: "babel-loader",
        options: {
          configFile: path.resolve(__dirname, "babel.config.js"),
        },
      },
    },
  ],
  plugins: [],
};
