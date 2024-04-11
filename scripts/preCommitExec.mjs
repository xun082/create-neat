import { resolve } from "node:path";
import { execSync } from "node:child_process";

main();

function main() {
  copyRootReadmeToTarget();
}

/**
 * pre-commit hook to copy the root README.md to the target package.
 */
function copyRootReadmeToTarget() {
  const rootReadmeMark = "README.md";

  const rootReadmePath = resolve(process.cwd(), rootReadmeMark);
  const targetFiles = ["packages/core/README.md"];
  const cpFile = (targetPath) => {
    if (hasFileChanged(rootReadmeMark)) {
      execSync(`cp ${rootReadmePath} ${targetPath}`);
      console.log(`Copied root README.md to ${targetPath}.`);
    }
  }

  try {
    mapFilesToPath(targetFiles).forEach(cpFile);
  }
  catch (error) {
    console.error("Error executing git diff:", error);
    process.exit(1);
  }
}

/**
 * transform the files array to the absolute path.
 * @param files
 * @returns {string[]}
 */
function mapFilesToPath(files) {
  return files.map((file) => resolve(process.cwd(), file));
}

/**
 * Check if the file has changed in the git diff.
 * @param path {string} The path to the file to check.
 * @returns {boolean}
 */
function hasFileChanged(path) {
  const gitDiff = execSync("git diff --cached --name-only", { encoding: "utf-8" });
  return gitDiff.split("\n").some((file) => file.trim() === path);
}
