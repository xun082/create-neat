module.exports = (templateAPI) => {
  templateAPI.extendPackage({
    dependencies: {
      vue: "^3.2.47",
    },
    devDependencies: {
      "vue-template-compiler": "^3.2.47",
      "html-webpack-plugin": "^5.3.1",
      "css-loader": "^5.2.6",
      "style-loader": "^2.0.0",
      "webpack-cli": "^4.7.2",
    },
  });
};
