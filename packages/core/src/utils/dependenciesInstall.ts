import fs from "fs";
import { spawn } from "cross-spawn";
import path from "path";

/**
 *  安装package.json中的devDependencies依赖
 * @param packageJsonFile packageJson文件父路径
 * @param packageManager  包管理器
 */
const dependenciesInstall = (packageJsonFile: string, packageManager: string): Promise<string> => {
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

  const packageJsonPath = path.join(packageJsonFile, "package.json");

  return new Promise((resolve, reject) => {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
      const devDependencies = packageJson.devDependencies;

      if (devDependencies) {
        console.log("Installing devDependencies...");
        // 将devDependencies对象转换为数组，然后拼接成安装命令的字符串
        const devDepsArray = Object.entries(devDependencies).map(
          ([dep, version]) => `${dep}@${version}`,
        );
        // 执行具体命令
        try {
          const pm = spawn(
            packageManager,
            [installCommand[packageManager], installParams[packageManager], ...devDepsArray],
            {
              stdio: "ignore",
              cwd: packageJsonFile,
            },
          );

          // 监听安装命令的输出
          pm.on("close", (code) => {
            if (code === 0) {
              // code为0代表安装成功
              resolve("devDependencies installed successfully.");
              console.log("devDependencies installed successfully.");
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
          console.log("Installing devDependencies failed: ", err);
        }
      } else {
        console.log("No devDependencies found in package.json.");
        reject("No devDependencies found in package.json.");
      }
    } catch (error) {
      console.error("Error reading package.json:", error);
      reject("Error reading package.json");
    }
  });
};

export default dependenciesInstall;
