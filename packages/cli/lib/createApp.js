import { resolveApp } from "@laconic/utils";
import fs from "fs";
import childProcess from "child_process";
import inquirer from "inquirer";
import removeDirectory from "./removeDirectory.js";
import { removeExitMatter, createAppType } from "./questions.js";
import appTemplate from "./appTemplate.js";
import createSuccessInfo from "./createSuccessInfo.js";
import chalk from "chalk";
import createLint from "./createLint.js";

export default async function createApp(matter, options) {
  const rootDirectory = resolveApp(matter);

  // 如果存在同名文件,且没有输入 -f,
  if (fs.existsSync(resolveApp(`./${matter}`)) && !options.force) {
    const { action } = await inquirer.prompt(removeExitMatter(rootDirectory));

    // 删除已存在文件并创建新文件
    if (action === true) removeDirectory(matter, false);
    else process.exit(1);
  }

  const { language, tool, template, lint } = await inquirer.prompt(
    createAppType
  );
  const createAppUrl = appTemplate.get(language).get(template);

  childProcess.execSync(`mkdir ${rootDirectory}`);
  childProcess.execSync(`cd ${rootDirectory}`);

  console.log(
    chalk.blue(
      `Please wait a moment while I download the project remotely for you...`
    )
  );

  childProcess.execSync(`git clone ${createAppUrl} ${matter}`);

  // 删除.git文件
  removeDirectory(resolveApp(`${matter}/.git`), false);

  // 是否开启代码提交检验
  if (lint === true) createLint(matter);

  childProcess.exec("git init", { cwd: rootDirectory });
  childProcess.exec(`${tool} install`, { cwd: rootDirectory }, () => {
    createSuccessInfo(matter, tool);
  });
}
