
module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    eslint: {
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
      plugins: ['import', 'jsx-a11y'],
    },
    devDependencies: {
      "@babel/core": "^7.24.4",
      "@babel/eslint-parser": "^7.24.1",
      "eslint": "^8.57.0",
      "eslint-plugin-import": "^2.29.1",
      "eslint-plugin-jsx-a11y": "^6.8.0",
      "eslint-plugin-n": "^17.3.1"
    },
  })
}