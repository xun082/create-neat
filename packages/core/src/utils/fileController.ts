import { resolveApp } from "@laconic/utils";
import chalk from "chalk";
import ora from "ora";
import fs from "fs-extra";
import ofs from "node:fs";
import { join } from "node:path";

import { CLIENT_OS } from "./constants";

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

export function createTemplateFile(file: string) {
  return fs.readFileSync(join(__dirname, "../../template/", file)).toString();
}
