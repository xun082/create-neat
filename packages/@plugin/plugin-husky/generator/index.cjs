module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    scripts: {
      prepare: "husky",
      commit: "git-cz",
      format: 'prettier --write "src/**/*.{js,jsx,ts,tsx,json,css,scss,md}"',
      lint: 'eslint "**/*.{ts,tsx,js,jsx}" --fix',
    },
    config: {
      commitizen: {
        path: "node_modules/cz-git",
      },
    },
    "lint-staged": {
      "*.{ts,tsx,js,jsx}": ["npm format", "npm lint"],
    },
    devDependencies: {
      husky: "^9.0.11",
      "lint-staged": "^15.2.0",
      "cz-git": "^1.7.1",
      commitizen: "^4.3.0",
      "@commitlint/cli": "^18.4.3",
      "@commitlint/config-conventional": "^18.4.3",
    },
  });
};
