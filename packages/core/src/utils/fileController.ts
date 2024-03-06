import { resolveApp } from "@laconic/utils";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import tar from "tar";
import axios from "axios";
import { join } from "node:path";

import { packageVersion } from "./constants";

/**
 * @param directoryPath 删除文件的路径，默认 node_modules
 * @param verbose 如果为true，则显示删除信息
 */
/**
 * @author moment
 * @param directoryPath 删除文件的路径，默认 node_modules
 * @param verbose 如果为true，则显示删除信息
 */
export async function removeDirectory(directoryPath = "node_modules", verbose = true) {
  const fullPath = resolveApp(directoryPath);
  if (verbose) {
    const spinner = ora(chalk.bold.cyan("File being deleted...")).start();
    try {
      await fs.remove(fullPath);
      spinner.succeed(chalk.bold.green("Deleted successfully"));
    } catch (error) {
      spinner.fail(chalk.bold.red("Deletion failed"));
      console.error(error);
    }
  } else {
    await fs.remove(fullPath);
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

export async function getNpmPackage(
  packageURL: string,
  packageName: string,
  projectName: string,
): Promise<void> {
  const spinner = ora(chalk.bold.cyan("Creating a project...")).start();
  try {
    const response = await axios.get(packageURL, {
      responseType: "arraybuffer",
    });
    const currentDir = resolveApp(projectName);
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
