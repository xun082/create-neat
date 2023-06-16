import { Command } from "commander";
import chalk from "chalk";

export default function suggestCommands(program: Command, result: string) {
  const commands = program.commands.map((cwd: any) => cwd._name);

  let suggestion: string = "";

  commands.forEach((cmd) => {
    const m = result.length;
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
        if (result[i - 1] === cmd[j - 1]) {
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
