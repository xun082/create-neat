import fs from "node:fs";
import path from "node:path";

const appDirectory: string = fs.realpathSync(process.cwd());

/**
 * @description 解析相对路径并返回绝对路径。
 * @param relativePath 相对路径。
 * @returns 绝对路径。
 */
function resolveApp(relativePath: string): string {
  return path.resolve(appDirectory, relativePath);
}

export { resolveApp };
