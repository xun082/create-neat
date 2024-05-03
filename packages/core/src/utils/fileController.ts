import { resolveApp } from "@laconic/utils";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import tar from "tar";
import axios from "axios";
import { join, resolve } from "node:path";

import { packageVersion } from "./constants";

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
      await fs.remove(fullPath);
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
/**
 * 递归复制文件夹。
 * @async
 * @function copyFolderRecursive
 * @param {string} sourceDir - 源文件夹路径。
 * @param {string} destinationDir - 目标文件夹路径。
 */
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
/**
 * 从 npm 获取包并解压缩到指定项目中。
 * @async
 * @function getNpmPackage
 * @param {string} packageURL - 包的 URL。
 * @param {string} packageName - 包的名称。
 * @param {string} projectName - 项目名称。
 * @param {boolean} [isDev] - 是否为开发模式。
 */
export async function getNpmPackage(
  packageURL: string,
  packageName: string,
  projectName: string,
  isDev?: boolean | undefined,
): Promise<void> {
  const spinner = ora(chalk.bold.cyan("Creating a project...")).start();
  try {
    const currentDir = resolveApp(projectName);
    // 如果是dev mode，检查并使用本地模板
    if (isDev) {
      const root = resolve(__dirname, "../../../../apps/");
      // 通过dist/index.js，找到模板文件的路径
      const templateDir = resolve(
        root,
        "template-react-web-ts/laconic-template-react-web-ts-1.0.1.tgz",
      );
      const hasLocalTemplate = fs.existsSync(templateDir);
      if (hasLocalTemplate) {
        await getPackageFromLocal(currentDir, templateDir);
        return;
      }
    }
    const response = await axios.get(packageURL, {
      responseType: "arraybuffer",
    });
    const tgzPath = join(currentDir, `${packageName}-${packageVersion}.tgz`);
    fs.writeFileSync(tgzPath, response.data);

    await tar.extract({
      file: tgzPath,
      cwd: currentDir,
    });

    await fs.unlink(tgzPath);
    await copyFolderRecursive(join(projectName, "package/template"), projectName);
    await removeDirectory(join(projectName, "package"), false);
    spinner.succeed(chalk.bold.green("Project creation successful"));
  } catch (error) {
    spinner.fail(chalk.bold.red("Project creation failed"));
    console.error("Error:", error);
    process.exit(1);
  }
}
/**
 * 从本地获取包并解压缩到指定项目中。
 * @async
 * @function getPackageFromLocal
 * @param {string} currentDir - 当前目录路径。
 * @param {string} targetFile - 目标文件路径。
 */
export async function getPackageFromLocal(currentDir: string, targetFile: string) {
  const spinner = ora(chalk.bold.cyan("Creating a project...")).start();
  try {
    await tar.extract({
      file: targetFile,
      cwd: currentDir,
    });
    spinner.succeed(chalk.bold.green("Project creation successful"));
  } catch (error) {
    spinner.fail(chalk.bold.red("Project creation failed"));
    console.error("Error:", error);
    process.exit(1);
  }
}
