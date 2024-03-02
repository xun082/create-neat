import os from "node:os";

import getPackageJsonInfo from "./getPackageInfo";

/**
 * @author moment
 * @description 传入不同的项目类型生成不同的package.json文件
 * @param projectType 项目类型
 * @param projectName 项目名称
 * @returns 返回 package.json 信息
 */

function createPackageJson(projectType: string, projectName: string) {
  try {
    const packageInfo = getPackageJsonInfo(`../../template/${projectType}.json`, true);
    if (!packageInfo) throw new Error("Package info is undefined.");

    packageInfo.author = os.userInfo().username;
    packageInfo.name = projectName;

    return packageInfo;
  } catch (error) {
    console.error(`Error creating package.json for ${projectType}:`, error);
    return null;
  }
}

export default createPackageJson;
