module.exports = (templateAPI) => {
  templateAPI.extendPackage({
    eslintConfig: {
      env: {
        browser: true,
        es2021: true,
        node: true,
      },
      extends: [
        "eslint:recommended",
        "plugin:vue/vue3-essential",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
      ],
      parser: "vue-eslint-parser",
      parserOptions: {
        ecmaVersion: "latest",
        parser: "@typescript-eslint/parser",
        sourceType: "module",
      },
      plugins: ["vue", "@typescript-eslint"],
      rules: {
        "vue/multi-word-component-names": [
          "error",
          {
            ignores: ["index", "Comment"],
          },
        ],
        "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
        "@typescript-eslint/no-explicit-any": "off",
        eqeqeq: ["error", "always"],
      },
    },
    devDependencies: {
      eslint: "^8.54.0",
      "eslint-config-prettier": "^9.0.0",
      "eslint-plugin-prettier": "^5.0.1",
    },
  });

  templateAPI.addScript("lint", "eslint . --ext .vue,.js,.ts,.jsx,.tsx --fix");

  templateAPI.generateFiles();
};
