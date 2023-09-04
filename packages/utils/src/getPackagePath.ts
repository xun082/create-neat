import path from 'node:path';

const getPackagePath = (packageNames: string[], dirName: string): string[] => {
  // 收集所有的依赖的包路径
  const topLevelPackagePaths: string[] = [];
  const visitedPackagePackages = new Set<string>();

  // 收集某个包的所有依赖
  const addPackagePath = (packageName: string, relativeToPath: string) => {
    try {
      if (visitedPackagePackages.has(packageName)) {
        return;
      }
      visitedPackagePackages.add(packageName);

      const packageJsonPath = require.resolve(`${packageName}/package.json`, {
        paths: [relativeToPath],
      });
      // 收集到该包在 node_modules 的路径（文件夹），如“xxxx/nodu_modules/react/”
      const directory = path.join(packageJsonPath, '../');
      if (topLevelPackagePaths.includes(directory)) return;
      topLevelPackagePaths.push(directory);

      // 拿到该包的所有依赖
      const dependencies = require(packageJsonPath).dependencies || {};
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

export default getPackagePath;
