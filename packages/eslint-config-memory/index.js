module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["react", "import", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react/jsx-runtime",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    "react/prop-types": "off",
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "no-unused-vars": ["warn", { varsIgnorePattern: "React" }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      { varsIgnorePattern: "^React$" },
    ],
    "prefer-rest-params": "error", // 要求使用剩余参数而不是 arguments
    eqeqeq: "error", // 强制使用 === 和 !==
    "no-multi-spaces": 1, // 禁止使用多个空格
    "default-case": 1, // 要求 switch 语句中有 default 分支
    "no-dupe-args": 2, // 禁止 function 定义中出现重名参数
    "prettier/prettier": ["error", { endOfLine: "auto" }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
