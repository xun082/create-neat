// 通用的Babel预设和插件
const commonBabelPresets = [
  [
    "@babel/preset-env",
    {
      useBuiltIns: "usage",
      corejs: 3,
    },
  ],
  "@babel/preset-typescript",
];

const commonBabelPlugins = [
  "@babel/plugin-transform-runtime",
  "@babel/plugin-syntax-dynamic-import",
];

// 通用的依赖
const commonDependencies = {
  "core-js": "^3.8.3",
};

const commonDevDependencies = {
  "@babel/core": "^7.24.7",
  "@babel/preset-env": "^7.24.7",
  "@babel/plugin-transform-runtime": "^7.24.7",
  "babel-loader": "^9.1.3",
  "@babel/plugin-syntax-dynamic-import": "^7.8.3",
  "@babel/preset-typescript": "^7.24.7",
};

// React的Babel配置
const reactBabelConfig = {
  presets: ["@babel/preset-react", ...commonBabelPresets],
  plugins: commonBabelPlugins,
};

// Vue的Babel配置
const vueBabelConfig = {
  presets: [...commonBabelPresets, "@vue/cli-plugin-babel/preset", "@vue/babel-preset-jsx"],
  plugins: ["@vue/babel-plugin-jsx", ...commonBabelPlugins],
};

module.exports = (generatorAPI) => {
  // 扩展package.json配置
  generatorAPI.extendPackage({
    react: {
      babel: reactBabelConfig,
      dependencies: commonDependencies,
      devDependencies: {
        ...commonDevDependencies,
        "@babel/preset-react": "^7.24.7",
      },
    },
    vue: {
      babel: vueBabelConfig,
      dependencies: commonDependencies,
      devDependencies: {
        ...commonDevDependencies,
        "@vue/cli-plugin-babel": "^5.0.8",
        "@vue/babel-plugin-jsx": "1.2.2",
        "@ant-design-vue/vue-jsx-hot-loader": "^0.1.4",
      },
    },
  });
};
