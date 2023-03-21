#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import { getCliPackageInfo, createApp, createLint } from "../lib/index.js";
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

program.on("command:*", ([result]) => {
  console.log();
  console.log(`  ` + chalk.red(`Unknown command ${chalk.yellow(result)}.`));
  console.log();
  suggestCommands(result);
});

program.parse(process.argv);

function suggestCommands(unknownCommand) {
  const commands = program.commands.map((cmd) => cmd._name);
  let suggestion = "";

  commands.forEach((cmd) => {
    const m = unknownCommand.length;
    const n = cmd.length;
    const dp = new Array();
    for (let i = 0; i <= m; i++) {
      const temp = new Array();
      for (let j = 0; j <= n; j++) temp.push(0);
      dp.push(temp);
    }

    for (let i = 0; i <= m; ++i) dp[i][0] = i;

    for (let j = 0; j <= n; ++j) dp[0][j] = j;

    for (let i = 1; i <= m; ++i) {
      for (let j = 1; j <= n; ++j) {
        if (unknownCommand[i - 1] === cmd[j - 1]) {
          dp[i][j] =
            1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1] - 1);
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }
    if (dp[m][n] < 4) suggestion = cmd;
  });

  if (suggestion) {
    console.log(`  ` + chalk.red(`Did you mean ${chalk.yellow(suggestion)} ?`));
  }
}
