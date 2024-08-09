module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    devDependencies: {
      "element-plus": "^2.7.8",
      "unplugin-auto-import": "^0.18.2",
      "unplugin-vue-components": "^0.27.3",
    },
  });
};
