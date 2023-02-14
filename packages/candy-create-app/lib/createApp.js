import { resolveApp } from "@ymentze/dev-utils";
import fs from "fs";
import childProcess from "child_process";
import inquirer from "inquirer";
import removeDirectory from "./removeDirectory.js";
import { removeExitMatter, createAppType } from "./questions.js";
import appTemplate from "./appTemplate.js";
import createSuccessInfo from "./createSuccessInfo.js";
import chalk from "chalk";

export default async function createApp(matter, options) {
  // 如果存在同名文件,且没有输入 -f,
  if (fs.existsSync(resolveApp(`./${matter}`)) && !options.force) {
    const { action } = await inquirer.prompt(
      removeExitMatter(resolveApp(matter))
    );

    // 删除已存在文件并创建新文件
    if (action === true) removeDirectory(matter);
    else process.exit(1);
  }

  const { language, tool, template } = await inquirer.prompt(createAppType);
  const createAppUrl = appTemplate.get(language).get(template);

  childProcess.exec(`mkdir ${resolveApp(matter)}`);
  childProcess.exec(`cd ${resolveApp(matter)}`);

  console.log(chalk.blue(`正在为你拉取远程项目,请骚等...`));
  childProcess.exec(
    `git clone ${createAppUrl} ${matter}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(error.message);
        removeDirectory(matter);
        process.exit(1);
      }

      if (stdout.length) console.log(stdout);
      else createSuccessInfo(matter, tool);
    }
  );
}
