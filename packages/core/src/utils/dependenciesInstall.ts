import fs from "fs";
import { spawn } from "cross-spawn";
import path from "path";
import chalk from "chalk";

/** 不同安装方式的命令枚举  */
const installCommand = {
  npm: "install",
  pnpm: "add",
  yarn: "add",
};

/** 不同安装方式的参数枚举 */
const installParams = {
  npm: "--save-dev",
  pnpm: "--save-dev",
  yarn: "--dev",
};

/**
 * 核心安装方法
 * @param dependencies 依赖对象
 * @param packageJsonFile package.json文件路径
 * @param packageManager 包管理器
 * @param isDev 是否为开发依赖
 */
const installDependencies = (
  dependencies: Record<string, string>,
  packageJsonFile: string,
  packageManager: string,
  isDev = true,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const dependenciesName = isDev ? "devDependencies" : "dependencies";
    try {
      if (
        dependencies &&
        typeof dependencies === "object" &&
        Object.keys(dependencies).length > 0
      ) {
        console.log(chalk.blue(`\n📄 Installing ${dependenciesName}...`));
        // 将dependencies对象转换为数组，然后拼接成安装命令的字符串
        const devDepsArray = Object.entries(dependencies).map(
          ([dep, version]) => `${dep}@${version}`,
        );

        // 判断是否为开发依赖，如果是则添加参数
        const params = isDev ? installParams[packageManager] : "";

        // 执行具体命令
        try {
          const pm = spawn(
            packageManager,
            [installCommand[packageManager], params, ...devDepsArray],
            {
              stdio: "ignore",
              cwd: packageJsonFile,
            },
          );

          // 监听安装命令的输出
          pm.on("close", (code) => {
            if (code === 0) {
              // code为0代表安装成功
              resolve(`${dependenciesName} installed successfully.`);
              console.log(chalk.green(`🎉 ${dependenciesName} installed successfully.`));
            } else {
              console.error(
                `${packageManager} ${installCommand[packageManager]} exited with code ${code}`,
              );
              reject(
                `${packageManager} ${installCommand[packageManager]} exited with code ${code}`,
              );
            }
          });
        } catch (err) {
          console.log(chalk.red(`❌ Installing ${dependenciesName} failed: `, err));
        }
      } else {
        console.log(chalk.yellow(`⚠  No ${dependenciesName} found in package.json.`));
        // 如果没有依赖，则直接返回
        resolve(`No ${dependenciesName} found in package.json.`);
      }
    } catch (error) {
      console.error("Error reading package.json:", error);
      reject("Error reading package.json");
    }
  });
};

/**
 *  安装package.json中的devDependencies依赖
 * @param packageJsonFile packageJson文件父路径
 * @param packageManager  包管理器
 */
const dependenciesInstall = async (
  packageJsonFile: string,
  packageManager: string,
): Promise<string[]> => {
  const packageJsonPath = path.join(packageJsonFile, "package.json");
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const devDependenciesObj = packageJson.devDependencies;
  const dependenciesObj = packageJson.dependencies;

  // 拿到具体的依赖对象，然后执行安装
  const devPromise = installDependencies(devDependenciesObj, packageJsonFile, packageManager, true);
  const promise = installDependencies(dependenciesObj, packageJsonFile, packageManager, false);

  try {
    return await Promise.all([devPromise, promise]);
  } catch (err) {
    console.error(chalk.red("\n❌  安装依赖失败", err));
  }
};

export default dependenciesInstall;
