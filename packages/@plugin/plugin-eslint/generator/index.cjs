module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    eslint: {
      env: {
        browser: true,
        es2021: true,
        node: true,
      },
      extends: "eslint:recommended",
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
      },
      rules: {
        indent: ["error", 2],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single"],
        semi: ["error", "always"],
        "no-console": "warn",
        "no-unused-vars": "warn",
      },
    },
    scripts: {
      lint: "lint .",
    },
  });
};
