process.env.NODE_ENV = "development";

const {
  clearConsole,
  formatWebpackMessages,
  friendlyPrints,
} = require("../bin/utils/index");
const chalk = require("chalk");
const { devServerConfig, getIPAddress } = require("@obstinate/dev-utils");
const WebpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");
const devWebpackConfig = require("../config/webpack.dev");

const compiler = webpack(devWebpackConfig);
const portFinder = require("portfinder");
const isInteractive = process.stdout.isTTY;

// 支持用户自定义端口号,默认为 3000
const { port, ...reset } = devWebpackConfig.devServer;
portFinder.setBasePort(port || 3000);

portFinder.getPort(function (err, port) {
  devServerConfig.port = port;
  devServerConfig.open = `http://localhost:${port}`;

  const server = new WebpackDevServer(
    { ...devServerConfig, ...reset },
    compiler
  );

  server.startCallback();
});

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
      lanUrlForTerminal: `${getIPAddress()}:${devServerConfig.port}`,
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
