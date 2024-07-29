import getLatestVersion from "latest-version";
import semver from "semver";
import chalk from "chalk";

export async function checkVersion(currentVersion: string) {
  const latestVersion = await getLatestVersion("create-neat");
  // 如果当前版本号小于最新版本号
  if (semver.lt(currentVersion, latestVersion)) {
    // 提示用户更新版本
    console.log(
      `You are using an outdated version of create-neat ${currentVersion}.\nConsider upgrading to the latest version ${latestVersion} by running ${chalk.greenBright("npm install -g create-neat")}.`,
    );
  }
}
