process.env.NODE_ENV = "production";

const webpack = require("webpack");

const prodWebpackConfig = require("../config/webpack.prod");

webpack(prodWebpackConfig, (err, _res) => {
  if (err) console.log(err);
});
