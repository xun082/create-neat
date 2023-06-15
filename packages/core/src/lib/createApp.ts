import { resolveApp } from "@obstinate/utils";
import fs from "fs-extra";
import { execSync, exec } from "child_process";
import { confirm, intro, select } from "@clack/prompts";
import { removeDirectory, getNpmPackage } from "./fileController";
import chalk from "chalk";
import { ProjectType, packageManage } from "./questions";
import { projectLink } from "./constants";
import isGitInstalled from "./isGitInstalled";
import createPackageJson from "./createPackageJsonFile";
import { join } from "path";
import ora from "ora";
import createSuccessInfo from "./createSuccessInfo";
import createCommitlint from "./createCommitlint";

export default async function createApp(
  matter: string,
  options: { force: boolean }
) {
  intro(chalk.green(" create-you-app "));
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

  const projectType = (await select({
    message: "Pick a project type.",
    options: ProjectType,
  })) as string;

  const packageManageType = (await select({
    message: "Select the package management tool you will use:",
    options: packageManage,
  })) as string;

  const commitlint = (await confirm({
    message: "Pick additional lint features:",
  })) as boolean;

  execSync(`mkdir ${rootDirectory}`);

  // 写入 package.json 文件
  fs.writeFileSync(
    join(rootDirectory, "package.json"),
    JSON.stringify(createPackageJson(projectType, matter), null, 2)
  );

  // 下载 npm 包解压,并删除一些无用的代码文件
  getNpmPackage(
    projectLink.get(projectType) as string,
    projectType,
    rootDirectory
  );

  // 是否安装已经安装了 git
  if (isGitInstalled()) exec("git init", { cwd: rootDirectory });
  const spinner = ora().start();
  spinner.start(
    chalk.bold.cyan("The dependency package is being installed...")
  );
  exec(`${packageManageType} install`, { cwd: rootDirectory }, () => {
    spinner.succeed(chalk.bold.green("🚀 Project initialization is complete"));

    createSuccessInfo(matter, packageManageType);
  });

  if (commitlint === true) createCommitlint(rootDirectory);
}
