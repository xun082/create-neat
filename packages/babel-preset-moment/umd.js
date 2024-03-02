const replacements = [{ original: "lodash", replacement: "lodash-es" }];

module.exports = {
  extensions: ["js", "jsx", "ts", "tsx"],
  presets: [
    [
      // Latest stable ECMAScript features
      require("@babel/preset-env").default,
      {
        // Allow importing core-js in entrypoint and use browserlist to select polyfills
        useBuiltIns: "entry",
        // Set the corejs version we are using to avoid warnings in console
        // This will need to change once we upgrade to corejs@3
        corejs: 3,
        // Do not transform modules to CJS
        modules: false,
        // Exclude transforms that make all code slower
        exclude: ["transform-typeof-symbol"],
      },
    ],
    [
      "@babel/preset-react",
      {
        // Will use the native built-in instead of trying to polyfill
        // behavior for any plugins that require one.
        useBuiltIns: true,
      },
    ],
    "@babel/preset-typescript",
  ].filter(Boolean),
  plugins: [
    require("babel-plugin-macros"),
    "annotate-pure-calls",
    "dev-expression",
    ["transform-rename-import", { replacements }],
    // 添加装饰器语法支持(typescript支持的语法)
    [require("@babel/plugin-proposal-decorators").default, false],
    // 添加类属性语法支持(typescript支持的语法)
    [
      require("@babel/plugin-proposal-class-properties").default,
      {
        loose: true,
      },
    ],
    // 添加import()语法支持
    require("@babel/plugin-syntax-dynamic-import").default,
  ].filter(Boolean),
  overrides: [
    {
      test: /\.tsx?$/,
      plugins: [
        [
          require("@babel/plugin-proposal-decorators").default,
          { legacy: true },
        ],
      ],
    },
  ],
};
