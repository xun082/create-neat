const vite = require("./vite.cjs");
const reactWebpackConfig = require("./webpack.react.cjs");
const vueWebpackConfig = require("./webpack.vue.cjs");

const templateConfigs = {
  vue: {
    vite,
    webpack: vueWebpackConfig,
  },
  react: {
    vite,
    webpack: reactWebpackConfig,
  },
};

function getConfig(template) {
  return templateConfigs[template] || null;
}

module.exports = getConfig;
