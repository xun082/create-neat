import { resolveApp } from "@laconic/utils";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import ofs from "node:fs";
import tar from "tar";
import axios from "axios";
import { join, resolve } from "node:path";

import { CLIENT_OS, packageVersion } from "./constants";

/**
 * @author moment
 * @param directoryPath 删除文件的路径，默认 node_modules
 * @param verbose 如果为true，则显示删除信息
 */
export async function removeDirectory(
  directoryPath: string = "node_modules",
  verbose: boolean = true,
) {
  const fullPath = resolveApp(directoryPath);
  /**
   * 删除文件夹。
   * @returns {Promise<boolean>} 删除结果，true 表示成功，false 表示失败。
   */
  async function deleteDirectory() {
    try {
      if (CLIENT_OS === "mac") {
        ofs.rmSync(fullPath, { recursive: true, force: true });
      } else {
        await fs.remove(fullPath);
      }
      return true; // 成功删除
    } catch (error) {
      console.error(chalk.bold.red("Deletion failed"), error);
      return false; // 删除失败
    }
  }

  if (verbose) {
    const spinner = ora(chalk.bold.cyan("File being deleted...")).start();
    const success = await deleteDirectory();
    if (success) {
      spinner.succeed(chalk.bold.green("Deleted successfully"));
    } else {
      spinner.fail(chalk.bold.red("Deletion failed"));
    }
  } else {
    await deleteDirectory();
  }
}

async function copyFolderRecursive(sourceDir: string, destinationDir: string) {
  try {
    await fs.ensureDir(destinationDir);
    await fs.copy(sourceDir, destinationDir);
  } catch (error) {
    console.error(
      chalk.red("\n 😡😡😡 An error occurred during the template download, please try again"),
      error,
    );
    process.exit(1);
  }
}

async function getLocalPackage(packageName: string, currentDir: string) {
  const root = resolve(__dirname, "../../../../apps/");
  // 通过dist/index.js，找到模板文件的路径
  const templateName = `template-${packageName}`;
  const templateDir = resolve(root, templateName);
  const templateTgzPath = resolve(root, `${templateName}.tgz`);

  if (!fs.existsSync(templateDir)) {
    console.error(chalk.red(`\n 😡😡😡 ${templateName} template not found`));
    process.exit(1);
  }

  const hasLocalTemplate = fs.existsSync(templateTgzPath);
  if (!hasLocalTemplate) {
    // 将 root 下的 templateName 打包到 templateTgzPath
    await tar.create(
      {
        gzip: true,
        cwd: root,
        file: templateTgzPath,
      },
      [templateName],
    );
  }

  await getPackageFromLocal(currentDir, templateTgzPath);
}

async function extractToPath(currentDir: string, tgzPath: string, forceOutDir?: string) {
  await tar.extract({
    file: tgzPath,
    cwd: currentDir,
  });

  const extractDir = forceOutDir ?? /.*[/\\](.*)(?=\.).*/.exec(tgzPath)?.[1];

  if (!extractDir) {
    console.error(chalk.red(`\n 😡😡😡 ${tgzPath} template not found`));
    process.exit(1);
  }

  await fs.unlink(tgzPath);
  // todo: 尽量让解压后的目录名可控
  await copyFolderRecursive(join(currentDir, `${extractDir}/template`), currentDir);
  await removeDirectory(join(currentDir, extractDir), false);
}

export async function getNpmPackage(
  packageURL: string,
  packageName: string,
  projectName: string,
  isDev?: boolean | undefined,
): Promise<void> {
  const currentDir = resolveApp(projectName);
  // 如果是dev mode，检查并使用本地模板
  if (isDev) {
    await getLocalPackage(packageName, currentDir);
    return;
  }
  // todo: commit lint 的时候会创建一个新的 spinner, 导致出现两次 'Creating a project...' 体验不是很好
  // 前置的话在 dev 模式下这个 spinner 永远无法正确的被关闭
  const spinner = ora(chalk.bold.cyan("Creating a project...")).start();
  // dev 模式下没可能会出现错误, 下载错误也会被 getPackageFromLocal 内部的 try 捕获
  try {
    const response = await axios.get(packageURL, {
      responseType: "arraybuffer",
    });
    const tgzPath = join(currentDir, `${packageName}-${packageVersion}.tgz`);
    fs.writeFileSync(tgzPath, response.data);

    // 解压到当前目录
    await extractToPath(currentDir, tgzPath, "package");

    spinner.succeed(chalk.bold.green("Project creation successful"));
  } catch (error) {
    spinner.fail(chalk.bold.red("Project creation failed"));
    console.error("Error:", error);
    process.exit(1);
  }
}

export async function getPackageFromLocal(currentDir: string, targetFile: string) {
  const spinner = ora(chalk.bold.cyan("Creating a project...")).start();
  try {
    await extractToPath(currentDir, targetFile);

    spinner.succeed(chalk.bold.green("Project creation successful"));
  } catch (error) {
    spinner.fail(chalk.bold.red("Project creation failed"));
    console.error("Error:", error);
    process.exit(1);
  }
}

export function createTemplateFile(file: string) {
  return fs.readFileSync(join(__dirname, "../../template/", file)).toString();
}
