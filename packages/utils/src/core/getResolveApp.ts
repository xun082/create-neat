import fs from "node:fs";
import path from "node:path";

/**
 * 当前应用程序的根目录路径。
 * @type {string}
 */
const appDirectory: string = fs.realpathSync(process.cwd());

/**
 * 解析相对于应用程序根目录的路径。
 * @param {string} relativePath 相对路径。
 * @returns {string} 解析后的绝对路径。
 */
function resolveApp(relativePath: string): string {
  return path.resolve(appDirectory, relativePath);
}

export { resolveApp };
