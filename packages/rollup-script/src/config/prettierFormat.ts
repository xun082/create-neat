import path from "node:path";
import { ESLint } from "eslint";
import { resolveApp } from "@obstinate/utils";
import ora from "ora";
import chalk from "chalk";

export default async function formatCode(isWatch: boolean) {
  let spinner: any = 0;
  if (!isWatch) {
    spinner = ora().start();
    spinner.start(chalk.bold.cyan("Code checking..."));
  }

  const srcDirectory = resolveApp("src");
  const tsExtname = path.join(srcDirectory, "/**/*.ts");
  const tsxExtname = path.join(srcDirectory, "/**/*.tsx");

  const eslint = new ESLint({ fix: true });
  const lintResults = await eslint.lintFiles([tsExtname, tsxExtname]);

  if (isWatch) console.log(lintResults);
  else {
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = await formatter.format(lintResults);

    await ESLint.outputFixes(lintResults);

    if (!resultText.length) {
      spinner.succeed(chalk.bold.green("Code checked successfully!"));
    } else {
      spinner.stop();
      console.log(resultText);
    }
  }
}
