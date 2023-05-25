import fs from "node:fs";
import path from "node:path";

const appDirectory: string = fs.realpathSync(process.cwd());

function resolveApp(relativePath: string): string {
  return path.resolve(appDirectory, relativePath);
}

export default resolveApp;
