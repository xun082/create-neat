#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { getCliPackageInfo, createApp } from "../lib/index.js";
import createFile from "../lib/createFile.js";

const program = new Command();

program.version(chalk.greenBright(getCliPackageInfo.version));

program
  .command("create <project-name>")
  .description("Create a directory for your project files")
  .option("-f, --force", "Overwrite target directory if it exists")
  .action((name, options) => {
    createApp(name, options);
  });

program
  .command("mkdir <type> [router]")
  .description("please enter the type of file you want to add")
  .action((name, options) => {
    createFile(name, options);
  });

program.parse(process.argv);
