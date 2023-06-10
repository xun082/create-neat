import { WatchOptions, eslintResult } from "../types";
import { createBuildConfigs } from "../config/createBuildConfig";
import {
  cleanDistFolder,
  writeCjsEntryFile,
  writeMjsEntryFile,
  moveTypes,
  normalizeOptions,
} from "./helper";
import ora from "ora";
import child_process from "node:child_process";
import { RollupWatchOptions, watch, WatcherOptions } from "rollup";
import { clearConsole, logError } from "../utils";
import chalk from "chalk";
import { resolveApp } from "@obstinate/utils";
import { join } from "node:path";
import { reporter, compiledMessage } from "../config/eslintPretty";

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
    }))
  ).on("event", async (event) => {
    await killHooks();

    if (event.code === "START") {
      if (!options.verbose) clearConsole();
      spinner.start(chalk.bold.cyan("Compiling modules..."));
    }

    if (event.code === "ERROR") {
      spinner.fail(chalk.bold.red("Failed to compile"));
      logError(event.error);
      failureKiller = run(options.onFailure);
    }

    if (event.code === "END") {
      child_process.exec(
        `npx eslint --format=json ${resolveApp(
          "./src"
        )} --ext .js,.ts,tsx,.jsx`,
        async (_error, stdout: string, _stderr) => {
          if (stdout) {
            const results = JSON.parse(stdout) as eslintResult[];
            reporter(results);
            compiledMessage(results);

            spinner.stop();
          } else {
            spinner.succeed(chalk.bold.green("Compiled successfully"));
            console.log(`${chalk.dim("Watching for changes")}`);

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
        }
      );
    }
  });
}
