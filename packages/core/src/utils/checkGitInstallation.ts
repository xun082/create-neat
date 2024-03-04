import { execSync } from "child_process";

export default function checkGitInstallation(): boolean {
  try {
    // 执行 git --version 命令检查是否安装了 Git
    execSync("git --version");
    return true; // Git已安装
  } catch (error) {
    return false; // Git未安装
  }
}
