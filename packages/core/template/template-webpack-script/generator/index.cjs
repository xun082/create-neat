const devDependencies = {
  autoprefixer: "^10.4.19",
  chalk: "^4.0.0",
  "circular-dependency-plugin": "^5.2.2",
  "compression-webpack-plugin": "^11.1.0",
  "copy-webpack-plugin": "^12.0.2",
  "cross-spawn": "^7.0.3",
  "css-loader": "^7.1.2",
  "css-minimizer-webpack-plugin": "^7.0.0",
  dotenv: "^16.4.5",
  "dotenv-expand": "^11.0.6",
  "fork-ts-checker-webpack-plugin": "^9.0.2",
  "html-minimizer-webpack-plugin": "^5.0.0",
  "html-webpack-plugin": "^5.6.0",
  "mini-css-extract-plugin": "^2.9.0",
  portfinder: "^1.0.32",
  "postcss-loader": "^8.1.1",
  "purgecss-webpack-plugin": "^6.0.0",
  "terser-webpack-plugin": "^5.3.10",
  webpack: "^5.91.0",
  "webpack-bundle-analyzer": "^4.10.2",
  "webpack-dev-server": "^5.0.4",
  "webpack-manifest-plugin": "^5.0.0",
  "webpack-merge": "^6.0.1"
};

const scripts = {
  dev: "NODE_ENV=development npx next-script dev",
  build: "NODE_ENV=production npx next-script build",
  analyzer: "NODE_ENV=production CLI=analyzer npx next-script analyzer",
};

const bin = {
  "next-script": "./scripts/index.js",
};

module.exports = (templateAPI, template) => {
  if (template === "vue") {
    templateAPI.extendPackage({
      bin,
      scripts,
      dependencies: {},
      devDependencies: {
        ...devDependencies,
        "vue-loader": "^17.4.2",
        "vue-style-loader": "^4.1.3",
      },
    });
  } else if (template === "react") {
    templateAPI.extendPackage({
      bin,
      scripts,
      dependencies: {},
      devDependencies: {
        ...devDependencies,
        "@pmmmwh/react-refresh-webpack-plugin": "^0.5.15",
        "react-refresh": "^0.14.2",
        "style-loader": "^4.0.0",
      },
    });
  }
};
