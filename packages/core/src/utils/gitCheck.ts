import { execSync } from "child_process";

// 检查全局是否安装了 Git
const hasGit = (): boolean => {
  try {
    execSync("git --version");
    return true; // Git已安装
  } catch (error) {
    return false; // Git未安装
  }
};

// 检查项目是否已经有 Git 环境
const hasProjectGit = (cwd: string): boolean => {
  try {
    execSync("git status", { stdio: "ignore", cwd });
    return true;
  } catch (error) {
    return false;
  }
};

export default function gitCheck(rootDirectory: string): boolean {
  if (!hasGit()) return false;
  return !hasProjectGit(rootDirectory);
}
