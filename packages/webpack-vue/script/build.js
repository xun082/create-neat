process.env.NODE_ENV = "production";

const webpack = require("webpack");
const prodWebpackConfig = require("../config/webpack.prod");

console.log(prodWebpackConfig);

webpack(prodWebpackConfig, (err, res) => {
  if (err) console.log(err);
});
