import { resolveApp } from "@laconic/utils";
import fs from "fs-extra";
import { execSync, exec } from "child_process";
import { confirm, intro, select } from "@clack/prompts";
import chalk from "chalk";
import { join } from "path";
import ora from "ora";

import { removeDirectory, getNpmPackage } from "./fileController";
import { ProjectTypes, PackageManagers } from "./questions";
import { projectLink } from "./constants";
import isGitInstalled from "./checkGitInstallation";
import createSuccessInfo from "./createSuccessInfo";
import createCommitlint from "./createCommitlint";
import { createPackageJson, createTemplateFile } from "./createFile";

// 设置输入模式为原始模式
process.stdin.setRawMode(true);

// 监听键盘输入，避免选择阶段需要多次 Ctrl+C 退出
process.stdin.on("data", (key) => {
  // 检测到 Ctrl+C
  if (key[0] === 3) {
    console.log("⌨️  Ctrl+C pressed - Exiting the program");
    process.exit(1);
  }
});

// 创建项目文件
const makeDirectory = async (matter, options) => {
  const rootDirectory = resolveApp(matter);
  // 如果存在同名文件,且没有输入 -f,
  if (fs.existsSync(rootDirectory) && !options.force) {
    const shouldContinue = await confirm({
      message:
        "Whether to overwrite a file with the same name that exists in the current directory ?",
    });

    // 删除已存在文件并创建新文件
    if (shouldContinue === true) {
      removeDirectory(matter, true);
    } else process.exit(1);
  }

  execSync(`mkdir ${rootDirectory}`);
};

// 获取表单结果
const getTableInfo = async () => {
  const projectType = (await select({
    message: "Pick a project type.",
    options: ProjectTypes,
  })) as string;

  const packageManageType = (await select({
    message: "Select the package management tool you will use:",
    options: PackageManagers,
  })) as string;

  const commitLint = (await confirm({
    message: "Pick additional lint features:",
  })) as boolean;

  return { projectType, packageManageType, commitLint };
};

// 模板创建主函数
export default async function createApp(matter: string, options: { force: boolean }) {
  intro(chalk.green(" create-you-app "));
  const rootDirectory = resolveApp(matter);

  await makeDirectory(matter, options);

  const { projectType, packageManageType, commitLint } = await getTableInfo();

  // 依据 projectType 把相关模板 json 写入 package.json 文件
  fs.writeFileSync(
    join(rootDirectory, "package.json"),
    JSON.stringify(createPackageJson(projectType, matter), null, 2),
  );

  // 写入 .gitignore 文件
  fs.writeFileSync(join(rootDirectory, ".gitignore"), createTemplateFile("gitignore"));

  // 下载 npm 包解压,获取目标模板导入文件,并删除一些无用的代码文件
  getNpmPackage(projectLink.get(projectType) as string, projectType, rootDirectory);

  // 注入 commitlint 规则
  if (commitLint === true) {
    createCommitlint(rootDirectory);
  }

  // todo：考虑省略这一步
  // 安装相关依赖
  const spinner = ora().start();
  spinner.start(chalk.bold.cyan("The dependency package is being installed..."));
  exec(`${packageManageType} install`, { cwd: rootDirectory }, () => {
    spinner.succeed(chalk.bold.green("🚀 Project initialization is complete"));

    createSuccessInfo(matter, packageManageType);
  });

  // 是否安装已经安装了 git
  if (isGitInstalled()) {
    exec("git init", { cwd: rootDirectory });
  }
}
