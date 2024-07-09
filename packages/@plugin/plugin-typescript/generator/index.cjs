module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    devDependencies: {
      typescript: "~5.4.0",
      "@types/node": "^20.11.28",
    },
  });
};
