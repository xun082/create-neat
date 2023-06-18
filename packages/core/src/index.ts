#!/usr/bin/env node

import { Command } from "commander";
import { getPackageJsonInfo, createApp } from "./lib";
import chalk from "chalk";

const program = new Command();

program
  .version(
    chalk.greenBright(getPackageJsonInfo("../../package.json", true).version)
  )
  .arguments("<project-name>")
  .description("Create a directory for your project files")
  .option("-f, --force", "Overwrite target directory if it exists")

  .action((name, options) => {
    createApp(name, options);
  })
  .parse(process.argv);
