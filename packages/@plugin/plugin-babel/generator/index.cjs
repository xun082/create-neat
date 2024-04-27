module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    // babel 的文件内容↓
    babel: {
      presets: ["@babel/preset-env"],
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            corejs: 3,
          },
        ],
      ],
    },
    // package.json 的文件内容↓
    dependencies: {
      "core-js": "^3.8.3",
    },
    devDependencies: {
      "@babel/core": "^7.18.0",
      "@babel/preset-env": "^7.18.0",
      "@babel/cli": "^7.18.0",
      "@babel/plugin-transform-runtime": "^7.18.0",
      "@babel/runtime": "^7.18.1",
    },
  });
};
