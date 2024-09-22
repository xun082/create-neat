const portFinder = require("portfinder");
const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const chalk = require("chalk");

const {
  clearConsole,
  formatWebpackMessages,
  friendlyPrints,
  devServerConfig,
  getIPAddress,
} = require("../utils");
let webpackConfig = require("../../webpack.config.js");

const isInteractive = process.stdout.isTTY;

// 如果是生产环境
if (process.env.NODE_ENV === "production") {
  webpack(webpackConfig, (err, _res) => {
    if (err) console.log(err);
  })
} else if (process.env.NODE_ENV === "development") {
  // dev 开发环境
  const compiler = webpack(webpackConfig, (err, _res) => {
    if (err) console.log(err);
  });
  const userPort = webpackConfig?.devServer?.port;

  portFinder.getPort(
    {
      port: userPort || process.env.PORT || 3000,
      stopPort: 9999,
    },
    (err, port) => {
      console.log(port, devServerConfig);
      devServerConfig.port = port;
      devServerConfig.open = `http://localhost:${port}`;

      // 如果 userPort 有值,则要删除,否则会被合并到 devServer 中,导致端口号存在而报错
      if (userPort) delete webpackConfig.devServer.port;
      const server = new WebpackDevServer(
        Object.assign(devServerConfig, webpackConfig.devServer),
        compiler
      );

      server.startCallback();
    }
  );

  compiler.hooks.done.tap("done", async (stats) => {
    if (isInteractive) clearConsole();

    const statsData = stats.toJson({
      all: false,
      warnings: true,
      errors: true,
    });

    const messages = formatWebpackMessages(statsData);
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) console.log(chalk.green("Compiled successfully!"));

    if (isSuccessful && (isInteractive || isFirstCompile)) {
      friendlyPrints({
        localUrlForTerminal: `http://localhost:${devServerConfig.port}`,
        lanUrlForTerminal: `http://${getIPAddress()}:${devServerConfig.port}`,
      });
    }

    isFirstCompile = false;

    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log(chalk.red("Failed to compile.\n"));
      console.log(messages.errors.join("\n\n"));
      return;
    }

    if (messages.warnings.length) {
      console.log(chalk.yellow("Compiled with warnings.\n"));
      console.log(messages.warnings.join("\n\n"));

      console.log(
        "\nSearch for the " +
          chalk.underline(chalk.yellow("keywords")) +
          " to learn more about each warning."
      );
      console.log(
        "To ignore, add " +
          chalk.cyan("// eslint-disable-next-line") +
          " to the line before.\n"
      );
    }
  });

  compiler.hooks.invalid.tap("invalid", () => {
    if (isInteractive) {
      clearConsole();
    }
    console.log("Compiling...");
  });
}
