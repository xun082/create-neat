import ora from "ora";
import child_process from "node:child_process";
import { RollupWatchOptions, watch, WatcherOptions } from "rollup";
import chalk from "chalk";
import { resolveApp, clearConsole } from "@laconic/utils";
import { join } from "node:path";
import { ESLint } from "eslint";

import { logError } from "../utils";
import { createBuildConfigs } from "../config/createBuildConfig";
import { WatchOptions } from "../types";

import {
  cleanDistFolder,
  writeCjsEntryFile,
  writeMjsEntryFile,
  moveTypes,
  normalizeOptions,
} from "./helper";

export default async function watchProject(dirtyOpts: WatchOptions) {
  const options = await normalizeOptions(dirtyOpts);
  const buildConfigs = await createBuildConfigs(options);

  if (!options.noClean) await cleanDistFolder();
  if (options.format.includes("cjs")) writeCjsEntryFile(options.name);
  if (options.format.includes("esm")) writeMjsEntryFile(options.name);

  let firstTime = true;
  let successKiller: any = null;
  let failureKiller: any = null;

  function run(command?: string) {
    if (!command) {
      return null;
    }

    const [exec, ...args] = command.split(" ");
    return child_process.spawnSync(exec, args, {
      stdio: "inherit",
    });
  }

  function killHooks() {
    return Promise.all([
      successKiller ? successKiller.kill("SIGTERM") : null,
      failureKiller ? failureKiller.kill("SIGTERM") : null,
    ]);
  }

  const spinner = ora().start();

  watch(
    (buildConfigs as RollupWatchOptions[]).map((inputOptions) => ({
      watch: {
        silent: true,
        include: join(resolveApp("."), "src/**"),
        exclude: join(resolveApp("."), "node_modules/**"),
      } as WatcherOptions,
      ...inputOptions,
    })),
  ).on("event", async (event) => {
    await killHooks();

    if (event.code === "START") {
      clearConsole();
      spinner.start(chalk.bold.cyan("Compiling modules..."));
    }

    if (event.code === "ERROR") {
      spinner.fail(chalk.bold.red("Failed to compile"));
      logError(event.error);
      failureKiller = run(options.onFailure);
    }

    if (event.code === "END") {
      const srcDirectory = join(resolveApp("src"), "/**/*");
      const eslint = new ESLint();

      const lintResults = await eslint.lintFiles([srcDirectory]);

      const formatter = await eslint.loadFormatter("stylish");
      const resultText = await formatter.format(lintResults);

      if (!resultText.length) {
        spinner.succeed(chalk.bold.green("Compiled successfully"));
        console.log(`${chalk.dim("Watching for changes")}`);
      } else {
        spinner.stop();
        console.log(resultText);
      }

      try {
        await moveTypes();
        if (firstTime && options.onFailure) {
          firstTime = false;
          run(options.onFirstSuccess);
        } else {
          successKiller = run(options.onSuccess);
        }
      } catch (error) {
        console.log(error);
      }
    }
  });
}
