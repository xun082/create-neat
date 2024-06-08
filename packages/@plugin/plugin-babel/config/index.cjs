const vite = require("./vite.cjs");
const react = require("./webpack.react.cjs");
const vue = require("./webpack.vue.cjs");

module.exports = {
  vite,
  webpack: {
    react,
    vue,
  },
};
