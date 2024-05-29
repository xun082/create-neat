import { execSync } from "child_process";

/**
 * 检查系统全局是否安装了 Git。
 * @function hasGit
 * @returns {boolean} 如果 Git 已安装，则返回 true，否则返回 false。
 */
const hasGit = (): boolean => {
  try {
    execSync("git --version");
    return true; // Git已安装
  } catch (error) {
    return false; // Git未安装
  }
};

/**
 * 检查项目是否已经有 Git 环境。
 * @function hasProjectGit
 * @param {string} cwd - 项目的根目录路径。
 * @returns {boolean} 如果项目已有 Git 环境，则返回 true，否则返回 false。
 */
const hasProjectGit = (cwd: string): boolean => {
  try {
    execSync("git status", { stdio: "ignore", cwd });
    return true;
  } catch (error) {
    return false;
  }
};
/**
 * 检查项目的根目录是否存在 Git 环境。
 * @function gitCheck
 * @param {string} rootDirectory - 项目的根目录路径。
 * @returns {boolean} 如果项目的根目录存在 Git 环境，则返回 true，否则返回 false。
 */
export default function gitCheck(rootDirectory: string): boolean {
  if (!hasGit()) return false;
  return !hasProjectGit(rootDirectory);
}
