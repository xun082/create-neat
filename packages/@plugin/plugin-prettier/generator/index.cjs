module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    prettier: {
      singleQuote: false,
      tabWidth: 2,
      arrowParens: "always",
      bracketSpacing: true,
      proseWrap: "preserve",
      trailingComma: "all",
      jsxSingleQuote: false,
      printWidth: 100,
    },
    devDependencies: {
      "@types/prettier": "^3.0.0",
      prettier: "^3.1.0",
    },
  });
};
