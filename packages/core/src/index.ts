#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";

import { getPackageJsonInfo, createApp } from "./utils";

const program = new Command();

program
  .version(chalk.greenBright(getPackageJsonInfo("../../package.json", true).version))
  .arguments("<project-name>")
  .description("Create a directory for your project files")
  .option("-f, --force", "Overwrite target directory if it exists")
  .option("--dev", "Use development mode")
  .action((name, options) => {
    createApp(name, options);
  })
  .parse(process.argv);
