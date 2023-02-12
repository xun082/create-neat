import { resolveApp } from "candy-dev-utils";
import fs from "fs";
import inquirer from "inquirer";
import removeDirectory from "./removeDirectory.js";
import { isRemoveExitMatter } from "./questions.js";

export default async function createApp(matter, options) {
  // 如果存在同名文件,且没有输入 -f,
  if (fs.existsSync(resolveApp(`./${matter}`)) && !options.force) {
    const { action } = await inquirer.prompt(
      isRemoveExitMatter(resolveApp(matter))
    );

    if (action === true) {
      // 删除已存在文件并创建新文件
      removeDirectory(matter);
      fs.mkdirSync(matter);
    } else process.exit(1);
    }
    
}
