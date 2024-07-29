#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import minimist from "minimist";
import fs from "fs";
import path from "path";

import createApp from "./utils/createApp";
import { checkVersion } from "./utils/checkVersion";

const packagePath = path.join(__dirname, "../package.json");
const version = JSON.parse(fs.readFileSync(packagePath, "utf8")).version;

const program = new Command();

checkVersion(version);

program
  .version(chalk.greenBright(version))
  .arguments("<project-name>")
  .description("Create a directory for your project files")
  .option("-f, --force", "Overwrite target directory if it exists")
  .option("--dev", "Use development mode")
  .action((name: string, options: Record<string, any>) => {
    createApp(name, options);
  });

// 子命令 runCommand，后续新增命令请添加到 runCommand 上。
const runCommand = program.command("run");
// 命令格式：create-neat run command，command 为命令名称，例如 create-neat run add。
runCommand
  .command("add <plugin> [pluginOptions]")
  .description("Install a plugin and invoke its generator in an existing project")
  .option("--registry <url>", "Specify an npm registry URL for installing dependencies (npm only)")
  .showSuggestionAfterError(true)
  .allowUnknownOption()
  .action((plugin) => {
    const pluginOptions = minimist(process.argv.slice(3));
    // addPlugin(plugin, pluginOptions)
    console.log(plugin, pluginOptions);
  });

program.parse(process.argv);
