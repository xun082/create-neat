import { resolve } from "node:path";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

main();

function main() {
  copyRootReadmeToTarget();
}

/**
 * pre-commit hook to copy the root README.md to the target package.
 */
function copyRootReadmeToTarget() {
  try {
    const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
    const __dirname = path.dirname(__filename);
    const mark = "README.md";
    const targetReadmePath = resolve(__dirname, `../packages/core/${mark}`);
    const rootReadmePath = resolve(__dirname, `../${mark}`);
    console.log(targetReadmePath)
    console.log(rootReadmePath)
    // 检查readme.md是否在暂存的文件中
    const hasReadmeChanged = () => {
      const gitDiff = execSync("git diff --cached --name-only", { encoding: "utf-8" });
      return gitDiff.split("\n").some((file) => file.trim() === mark);
    };
    // 如果暂存区有readme.md文件，则将根目录的readme.md文件复制到暂存区
    if (hasReadmeChanged()) {
      execSync(`cp ${rootReadmePath} ${targetReadmePath}`);
      console.log(`Copied root README.md to ${targetReadmePath}.`);
    }
  }
  catch (error) {
    console.error("Error executing git diff:", error);
    process.exit(1);
  }
}
