#!/usr/bin/env node

const {
  clearConsole,
  formatWebpackMessages,
  friendlyPrints,
} = require("./utils/index");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const chalk = require("chalk");
const devWebpackConfig = require("../config/webpack.dev");
const prodWebpackConfig = require("../config/webpack.prod");
const { getIPAddress } = require("./utils/paths");
const { devServerConfig } = require("candy-dev-utils");
const portFinder = require("portfinder");

portFinder.setBasePort(3000);

const argument = process.argv.slice(2);
const isInteractive = process.stdout.isTTY;
const compiler = webpack(devWebpackConfig);

if (argument[0] === "serve") {
  portFinder.getPort(function (err, port) {
    devServerConfig.port = port;
    devServerConfig.open = `http://localhost:${3000}`;

    const server = new WebpackDevServer(devServerConfig, compiler);

    server.startCallback();
  });
} else if (argument[0] === "build") {
  webpack(prodWebpackConfig, (err, res) => {
    if (err) console.log(err);

    // console.log(res);
  });
}

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
