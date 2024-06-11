import path from "node:path";

import { PackageJsonType } from "../types";

import { getJsonFileInfo } from "./getJsonFileInfo";

/**
 * @description 获取包路径列表。
 * @param packageNames 要收集的包名称列表。
 * @param dirName 指定目录名称。
 * @returns 包路径列表。
 */
const getPackagePath = (packageNames: string[], dirName: string): string[] => {
  // 收集所有的依赖的包路径
  const topLevelPackagePaths: string[] = [];
  const visitedPackagePackages = new Set<string>();

  /**
   * @description 添加包路径。
   * @param packageName 包名称。
   * @param relativeToPath 相对路径。
   */
  const addPackagePath = (packageName: string, relativeToPath: string) => {
    try {
      if (visitedPackagePackages.has(packageName)) {
        return;
      }
      visitedPackagePackages.add(packageName);

      const packageJsonPath = require.resolve(`${packageName}/package.json`, {
        paths: [relativeToPath],
      });

      // 收集到该包在 node_modules 的路径（文件夹），如“xxxx/node_modules/react/”
      const directory = path.join(packageJsonPath, "../");
      if (topLevelPackagePaths.includes(directory)) return;
      topLevelPackagePaths.push(directory);

      // 拿到该包的所有依赖
      const dependencies = (getJsonFileInfo(packageJsonPath) as PackageJsonType).dependencies || {};
      for (const name of Object.keys(dependencies)) {
        // 递归收集改包的所有依赖
        addPackagePath(name, directory);
      }
    } catch (_) {
      // don't error on failing to resolve framework packages
    }
  };

  // 收集 react/react-dom 的所有依赖
  for (const packageName of packageNames) {
    addPackagePath(packageName, dirName);
  }

  return topLevelPackagePaths;
};

export { getPackagePath };
