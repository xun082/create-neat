import os from "node:os";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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
    process.exit(1);
  }
}

/**
 * @author ljq
 * @description 生成readme文件
 * @param packageManager 包管理器
 * @param template 框架名称
 * @returns 返回 readme.md 字符串
 */

function createReadmeString(packageManager: string, template: string, fileName: string) {
  try {
    const readmeInfo = readFileSync(join(__dirname, "../../template/", fileName)).toString();
    // 框架首字母大写 Vue React
    const newTemplate = template.charAt(0).toUpperCase() + template.slice(1);
    if (!readmeInfo) throw new Error("README info is undefined.");
    const newReadmeInfo = readmeInfo
      .replace(/\${packageManager}/g, packageManager)
      .replace(/\${template}/g, newTemplate);
    return newReadmeInfo;
  } catch (error) {
    console.error(`Error creating readme.md :`, error);
    process.exit(1);
  }
}

/**
 * @description 读取 template 中的 json 文件内容
 * @param file 文件名
 * @returns 返回对应 file 的 json 文件信息
 */

function createTemplateFile(file: string) {
  return readFileSync(join(__dirname, "../../template/", file)).toString();
}

export { createPackageJson, createTemplateFile, createReadmeString };
