import { resolveApp } from "@laconic/utils";
import chalk from "chalk";
import ora from "ora";
import fs, { readFileSync } from "fs-extra";
import { join } from "node:path";

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

export function createTemplateFile(file: string) {
  console.log(join(__dirname, "../../template/", file));

  return readFileSync(join(__dirname, "../../template/", file)).toString();
}
