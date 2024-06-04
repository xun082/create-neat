module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    // swc 的文件内容↓
    swc: {
      jsc: {
        parser: {
          syntax: "typescript",
          tsx: true,
          jsx: true,
        },
        transform: {
          react: {
            runtime: "automatic",
          },
        },
      },
    },
    devDependencies: {
      "@swc/core": "^1.5.6",
      "@swc/helpers": "^0.5.11",
      "swc-loader": "^0.2.6",
    },
  });
};
