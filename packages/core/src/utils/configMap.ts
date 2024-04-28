interface configMap {
  [key: string]: {
    files: string[];
    npm: string[];
  };
}

// todo: 与 select 存在字段耦合，后续考虑抽象出来
// todo: 部分映射需要补充
const template: configMap = {
  "common-lib": {
    files: [],
    npm: [],
  },
  vue: {
    files: [],
    npm: ["vue"],
  },
  react: {
    files: [],
    npm: ["react", "react-dom", "@types/react", "@types/react-dom"],
  },
};

const buildTool: configMap = {
  webpack: {
    files: [],
    npm: ["webpack"],
  },
  vite: {
    files: [],
    npm: ["vite"],
  },
  rollup: {
    files: [],
    npm: ["rollup"],
  },
};
const plugins: configMap = {
  Babel: {
    files: [],
    npm: ["@babel/core", "@babel/preset-env", "babel-loader"],
  },
  TypeScript: {
    files: [],
    npm: ["typescript", "@types/node", "ts-loader"],
  },
  Eslint: {
    files: [],
    npm: [
      "@babel/core",
      "@babel/eslint-parser",
      "eslint",
      "eslint-plugin-import",
      "eslint-plugin-jsx-a11y",
      "eslint-plugin-n",
    ],
  },
  Prettier: {
    files: [],
    npm: [],
  },
};

const mapForPreset = { template, buildTool, plugins };

export { mapForPreset };
