module.exports = function create(_api, _opts, env) {
  const isEnvDevelopment = env === "development";
  const isEnvProduction = env === "production";
  const isEnvTest = env === "test";
  const replacements = [{ original: "lodash", replacement: "lodash-es" }];

  return {
    presets: [
      isEnvTest && [
        require("@babel/preset-env").default,
        {
          targets: {
            node: "current",
          },
        },
      ],
      isEnvProduction && [
        require("@babel/preset-env").default,
        {
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: "entry",
          // Set the corejs version we are using to avoid warnings in console
          // This will need to change once we upgrade to corejs@3
          corejs: 3,
          // Exclude transforms that make all code slower
          exclude: ["transform-typeof-symbol"],
          targets: "> 0.25%, not dead, not op_mini all",
        },
      ],
      isEnvDevelopment && [
        require("@babel/preset-env").default,
        {
          // Allow importing core-js in entrypoint and use browserlist to select polyfills
          useBuiltIns: "entry",
          // Set the corejs version we are using to avoid warnings in console
          // This will need to change once we upgrade to corejs@3
          corejs: 3,
          // Exclude transforms that make all code slower
          exclude: ["transform-typeof-symbol"],
        },
      ],
      [
        require("@babel/preset-react").default,
        {
          // Adds component stack to warning messages
          // Adds __self attribute to JSX which React will use for some warnings
          development: isEnvDevelopment || isEnvTest,
          // Will use the native built-in instead of trying to polyfill
          // behavior for any plugins that require one.
          useBuiltIns: true,
          // 启用新的 JSX 转换
          runtime: "automatic",
        },
      ],
      require("@babel/preset-typescript"),
    ].filter(Boolean),
    plugins: [
      // 支持可选链操作符，规范见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining
      require("@babel/plugin-proposal-optional-chaining"),
      // 支持空值合并运算符，规范见：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
      require("@babel/plugin-proposal-nullish-coalescing-operator"),
      // babel 支持从 tsconfig.json 文件中读取`paths`，作为自定义的模块路径映射
      require("babel-plugin-module-resolver"),
      // 支持宏编程
      require("babel-plugin-macros"),
      require("babel-plugin-annotate-pure-calls"),
      require("babel-plugin-dev-expression"),
      [require("babel-plugin-transform-rename-import"), { replacements }],
      // 添加装饰器语法支持(typescript支持的语法)
      [require("@babel/plugin-proposal-decorators").default, false],
      // 启用 loose 模式
      [
        require("@babel/plugin-proposal-class-properties").default,
        {
          loose: true,
        },
      ],
      [
        require("@babel/plugin-proposal-private-methods").default,
        {
          loose: true,
        },
      ],
      [
        require("@babel/plugin-proposal-private-property-in-object").default,
        {
          loose: true,
        },
      ],
      // 支持数字分隔符，规范：https://github.com/tc39/proposal-numeric-separator
      require("@babel/plugin-proposal-numeric-separator").default,
      // 添加一些babel、async/await的helpers
      [
        require("@babel/plugin-transform-runtime").default,
        {
          corejs: false,
          helpers: true,
          regenerator: true,
          useESModules: false,
          version: require("@babel/runtime/package.json").version,
        },
      ],
      // 添加import()语法支持
      require("@babel/plugin-syntax-dynamic-import").default,
      isEnvTest &&
        // 将import()转变为require
        require("babel-plugin-dynamic-import-node"),
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
};
