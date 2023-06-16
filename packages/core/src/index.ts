#!/usr/bin/env node

import { Command } from "commander";
import { getPackageJsonInfo, createApp, suggestCommands } from "./lib";
import chalk from "chalk";
import { removeDirectory } from "./lib/fileController";

const program = new Command();

program.version(
  chalk.greenBright(getPackageJsonInfo("../../package.json", true).version)
);

program
  .command("create <project-name>")
  .description("Create a directory for your project files")
  .option("-f, --force", "Overwrite target directory if it exists")
  .action((name, options) => {
    createApp(name, options);
  });

program
  .command("remove [router]")
  .description("Delete all files under fixed")
  .action((name) => {
    removeDirectory(name, true);
  });

program.on("command:*", ([result]) => {
  console.log();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(result)}.`));
  console.log();
  suggestCommands(program, result);
});

program.parse(process.argv);
