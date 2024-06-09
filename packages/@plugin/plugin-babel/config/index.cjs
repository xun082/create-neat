const vite = require("./vite.cjs");
const reactWebpackConfig = require("./webpack.react.cjs");
const vueWebpackConfig = require("./webpack.vue.cjs");

function getconfig(template) {
  if (template === "vue") {
    return {
      vite,
      webpack: vueWebpackConfig,
    };
  } else if (template === "react") {
    return {
      vite,
      webpack: reactWebpackConfig,
    };
  }
}

// module.exports = {
//   vite,
//   webpack: {
//     react,
//     vue,
//   },
// };

module.exports = getconfig;
