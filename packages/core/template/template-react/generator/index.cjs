module.exports = (templateAPI) => {
  templateAPI.extendPackage({
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    },
    devDependencies: {
      "html-webpack-plugin": "^5.3.1",
      "css-loader": "^5.2.6",
      "style-loader": "^2.0.0",
      "webpack-cli": "^4.7.2",
    },
  });
};
