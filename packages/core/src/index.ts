#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import minimist from "minimist";

import { getPackageJsonInfo } from "./utils";
import createAppTest from "./utils/createAppTest";

const program = new Command();

program
  .version(chalk.greenBright(getPackageJsonInfo("../../package.json", true).version))
  .arguments("<project-name>")
  .description("Create a directory for your project files")
  .option("-f, --force", "Overwrite target directory if it exists")
  .option("--dev", "Use development mode")
  .action((name: string, options: Record<string, any>) => {
    createAppTest(name, options);
  });

program
  .command("add <plugin> [pluginOptions]")
  .description("Install a plugin and invoke its generator in an existing project")
  .option("--registry <url>", "Specify an npm registry URL for installing dependencies (npm only)")
  .allowUnknownOption()
  .action((plugin) => {
    const pluginOptions = minimist(process.argv.slice(3));
    console.log(pluginOptions, plugin);
    // addPlugin(plugin, pluginOptions)
    console.log(plugin, pluginOptions);
  });

program.parse(process.argv);
