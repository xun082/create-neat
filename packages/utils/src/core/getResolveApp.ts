import fs from "node:fs";
import path from "node:path";

const appDirectory: string = fs.realpathSync(process.cwd());

/**
 * @param relativePath  相对于执行脚本的路径
 * @returns 返回新建项目的绝对路径
 */
function resolveApp(relativePath: string): string {
  return path.resolve(appDirectory, relativePath);
}

export { resolveApp };
