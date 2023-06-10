#!/usr/bin/env node

import sade from "sade";
import { buildProject, testProject, watchProject, lintProject } from "./script";
import { BuildOptions, WatchOptions, TestOptions, LintParams } from "./types";

const programmer = sade("rollup-script");

programmer
  .command("watch")
  .describe("Rebuilds on any change")
  .option("--entry, -i", "Entry module")
  .example("watch --entry src/foo.tsx")
  .option("--target", "Specify your target environment", "browser")
  .example("watch --target node")
  .option("--name", "Specify name exposed in UMD builds")
  .example("watch --name Foo")
  .option("--format", "Specify module format(s)", "cjs,esm")
  .example("watch --format cjs,esm")
  .option(
    "--verbose",
    "Keep outdated console output in watch mode instead of clearing the screen"
  )
  .example("watch --verbose")
  .option("--noClean", "Don't clean the dist folder")
  .example("watch --noClean")
  .option("--tsconfig", "Specify custom tsconfig path")
  .example("watch --tsconfig ./tsconfig.foo.json")
  .option("--onFirstSuccess", "Run a command on the first successful build")
  .example('watch --onFirstSuccess "echo The first successful build!"')
  .option("--onSuccess", "Run a command on a successful build")
  .example('watch --onSuccess "echo Successful build!"')
  .option("--onFailure", "Run a command on a failed build")
  .example('watch --onFailure "The build failed!"')
  .option("--transpileOnly", "Skip type checking")
  .example("watch --transpileOnly")
  .option("--extractErrors", "Extract invariant errors to ./errors/codes.json.")
  .example("watch --extractErrors")
  .action((dirtyOptions: WatchOptions) => watchProject(dirtyOptions));

programmer
  .command("build")
  .describe("Build your project once and exit")
  .option("--entry, -i", "Entry module")
  .example("build --entry src/foo.tsx")
  .option("--target", "Specify your target environment", "browser")
  .example("build --target node")
  .option("--name", "Specify name exposed in UMD builds")
  .example("build --name Foo")
  .option("--format", "Specify module format(s)", "cjs,esm")
  .example("build --format cjs,esm")
  .option("--legacy", "Babel transpile and emit ES5.")
  .example("build --legacy")
  .option("--tsconfig", "Specify custom tsconfig path")
  .example("build --tsconfig ./tsconfig.foo.json")
  .option("--transpileOnly", "Skip type checking")
  .example("build --transpileOnly")
  .option(
    "--extractErrors",
    "Extract errors to ./errors/codes.json and provide a url for decoding."
  )
  .example(
    "build --extractErrors=https://reactjs.org/docs/error-decoder.html?invariant="
  )
  .action((dirtyOptions: BuildOptions) => buildProject(dirtyOptions));

programmer
  .command("lint")
  .describe("Run eslint with Prettier")
  .example("lint src test")
  .option("--fix", "Fixes fixable errors and warnings")
  .example("lint src test --fix")
  .option("--ignore-pattern", "Ignore a pattern")
  .example("lint src test --ignore-pattern test/foobar.ts")
  .option(
    "--max-warnings",
    "Exits with non-zero error code if number of warnings exceed this number",
    Infinity
  )
  .example("lint src test --max-warnings 10")
  .option("--write-file", "Write the config file locally")
  .example("lint --write-file")
  .option("--report-file", "Write JSON report to file locally")
  .example("lint --report-file eslint-report.json")
  .action((options: LintParams) => lintProject(options));

programmer
  .command("test")
  .describe("Run jest test runner. Passes through all flags directly to Jest")
  .action((options: TestOptions) => testProject(options));

programmer.parse(process.argv);
