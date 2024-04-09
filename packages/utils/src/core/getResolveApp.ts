import fs from "node:fs";
import path from "node:path";

const appDirectory: string = fs.realpathSync(process.cwd());
console.log(appDirectory, "------appDirectory");

function resolveApp(relativePath: string): string {
  return path.resolve(appDirectory, relativePath);
}

export { resolveApp };
