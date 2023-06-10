import chalk from "chalk";
import { clearConsole } from "../utils";
import { eslintResult } from "../types";

function formatResults(results: eslintResult[]) {
  clearConsole();
  return results
    .map((result: eslintResult) => {
      const messages = result.messages.map((msg: any) => {
        const line = chalk.gray(msg.line);
        const column = chalk.gray(msg.column);
        const severity =
          result.errorCount > 0 ? chalk.red("error") : chalk.yellow("warning");
        const message = `${chalk.blueBright(severity)} ${msg.message} (${
          msg.ruleId
        })`;
        return `${line}:${column} ${message}\n`;
      });

      const filePath = `${chalk.yellow("File:")} ${result.filePath}`;
      const severity =
        result.errorCount > 0 ? chalk.red("error") : chalk.yellow("warning");
      return `${filePath}\n${severity}\n${messages.join("\n")}`;
    })
    .join("\n");
}

export function reporter(results: eslintResult[]) {
  const formattedResults = formatResults(results);
  if (formattedResults.length > 0) console.log(formattedResults);
}

export function compiledMessage(results: eslintResult[]) {
  let errorCount: number = 0;
  let warningCount: number = 0;
  const baseInfo: string = "rollup compiled with ";

  results.forEach((result: eslintResult) => {
    errorCount += result.errorCount;
    warningCount += result.warningCount;
  });

  if (errorCount && warningCount) {
    console.log(
      `${baseInfo}${chalk.red(errorCount + " error")} and ${chalk.red(
        errorCount + " warning"
      )}`
    );
  } else if (errorCount) {
    console.log(`${baseInfo + chalk.red(errorCount + " error")} `);
  } else if (warningCount) {
    console.log(`${baseInfo + chalk.yellow(warningCount + " warning")} `);
  }
}
