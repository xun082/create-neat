module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    dependencies: {
      "element-plus": "^2.7.8",
    },
    devDependencies: {
      "unplugin-element-plus": "^0.8.0",
    },
  });
};
