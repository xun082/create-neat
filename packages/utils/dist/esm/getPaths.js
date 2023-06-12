import fs from "node:fs";
import path from "node:path";
const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
    return path.resolve(appDirectory, relativePath);
}
export default resolveApp;
