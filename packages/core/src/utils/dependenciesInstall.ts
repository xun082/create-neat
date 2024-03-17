import fs from "fs";
import { spawn } from "child_process";
import path from "path";
/**
 *
 * @param packageJsonFile packageJson文件父路径
 * @param packageManager  包管理器
 */
const dependenciesInstall = (packageJsonFile: string, packageManager: string) => {
  /** 不同安装方式的命令枚举  */
  const installCommand = {
    npm: "install",
    pnpm: "add",
    yarn: "add",
  };

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
        const devDepsArray = Object.entries(devDependencies).map(
          ([dep, version]) => `${dep}@${version}`,
        );
        const pm = spawn(
          packageManager,
          [installCommand[packageManager], installParams[packageManager], ...devDepsArray],
          {
            stdio: "ignore",
            cwd: packageJsonFile,
          },
        );
        pm.on("close", (code) => {
          if (code === 0) {
            resolve("devDependencies installed successfully.");
            console.log("devDependencies installed successfully.");
          } else {
            console.error(
              `${packageManager} ${installCommand[packageManager]} exited with code ${code}`,
            );
            reject(`${packageManager} ${installCommand[packageManager]} exited with code ${code}`);
          }
        });
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
