export default (generatorAPI) => {
  generatorAPI.extendPackage({
    babel: {
      presets: ["@babel/preset-env"],
      plugin: [
        [
          "@babel/plugin-transform-runtime",
          {
            corejs: 3,
          },
        ],
      ],
    },
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
