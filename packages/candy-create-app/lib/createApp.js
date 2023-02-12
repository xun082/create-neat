import { resolveApp } from "candy-dev-utils";
import fs from "fs";
import childProcess from "child_process";
import inquirer from "inquirer";
import removeDirectory from "./removeDirectory.js";
import { isRemoveExitMatter, createAppType } from "./questions.js";

export default async function createApp(matter, options) {
  // 如果存在同名文件,且没有输入 -f,
  if (fs.existsSync(resolveApp(`./${matter}`)) && !options.force) {
    const { action } = await inquirer.prompt(
      isRemoveExitMatter(resolveApp(matter))
    );

    if (action === true) {
      // 删除已存在文件并创建新文件
      removeDirectory(matter);
    } else process.exit(1);
  }

  const { language, tool } = await inquirer.prompt(createAppType);

  childProcess.exec(`mkdir ${resolveApp(matter)}`);
  childProcess.exec(`cd ${resolveApp(matter)}`);
  childProcess.exec(
    `git clone https://gitee.com/arcsiny/template.git ${matter}`
  );
}
