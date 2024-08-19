module.exports = (templateAPI) => {
  templateAPI.extendPackage({
    dependencies: {
      vue: "^3.2.47",
    },
    devDependencies: {
      "vue-template-compiler": "^2.7.16",
    },
  });
};
