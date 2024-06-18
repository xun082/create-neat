module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    scripts: {
      postinstall: "husky install",
    },
    "lint-staged": {
      "*.{ts,tsx,js,jsx}": ["pnpm format:ci", "pnpm lint:ci"],
    },
    devDependencies: {
      husky: "^9.0.11",
      "lint-staged": "^15.2.0",
      "@commitlint/cli": "^18.4.3",
      "@commitlint/config-conventional": "^18.4.3",
    },
  });
};
