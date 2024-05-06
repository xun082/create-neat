module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    env: {
      browser: true,
      commonjs: true,
      es6: true,
      node: true,
    },
    extends: ["eslint:recommended"],
    parserOptions: {
      root: true,
      parser: "@babel/eslint-parser",
      ecmaVersion: 2021,
      sourceType: "module",
      requireConfigFile: false,
    },
    plugins: ["import", "jsx-a11y"],
  });
};
