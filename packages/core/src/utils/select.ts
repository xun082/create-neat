import { multiselect, select, intro } from "@clack/prompts";
import chalk from "chalk";
import https from "https";
import { execSync } from "child_process";

import { getPreset } from "./preset";
import getPackageJsonInfo from "./getPackageInfo";
const npmJson: any = getPackageJsonInfo("../../../../registries.json", true);
const npmSources: any = [];
for (const key in npmJson) {
  npmSources.push({ label: key, value: npmJson[key].registry });
}
const registryInfo = execSync("npm config get registry").toString().trim();
const checkSourceSpeed = (source: any) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const req = https.request(source.registry, () => {
      const endTime = Date.now();
      const duration = endTime - startTime;
      resolve({ sourceName: source, duration });
    });
    req.on("error", (error) => {
      reject(error);
    });

    req.end();
  });
};
// 为每个源创建Promise
const promises = Object.keys(npmJson).map((sourceName) => {
  const source = npmJson[sourceName];
  return checkSourceSpeed(source);
});
// 使用Promise.race找出哪个源最快
Promise.race(promises)
  .then((fastestSource: any) => {
    npmSources.push({ label: "Fastest source", value: fastestSource.sourceName.registry });
  })
  .catch((error) => {
    console.error("检测源速度时发生错误:", error);
  });
interface Responses {
  template: string;
  buildTool: string;
  plugins: string[];
  packageManager: string;
  npmSource: string;
}

/**
 * @description 终端交互，获取用户的项目预设
 * @returns 返回用户的项目预设 Responses
 */
async function projectSelect() {
  const responses: Responses = {
    template: "",
    buildTool: "",
    plugins: [],
    packageManager: "",
    npmSource: "",
  };

  intro(chalk.green(" create-you-app "));

  // 选择模板预设
  responses.template = (await select({
    message: "Pick a template please",
    options: [
      { value: "common-lib", label: "common-lib" },
      { value: "vue", label: "vue" },
      { value: "react", label: "react" },
    ],
  })) as string;

  // 选择构建工具
  responses.buildTool = (await select({
    message: "Pick a build tools for your project",
    options: [
      { value: "webpack", label: "webpack" },
      { value: "vite", label: "vite" },
      { value: "rollup", label: "rollup" },
    ],
  })) as string;

  // 选择插件
  responses.plugins = (await multiselect({
    message: `Pick plugins for your project.(${chalk.greenBright(
      "<space>",
    )} select, ${chalk.greenBright("<a>")} toggle all, ${chalk.greenBright(
      "<i>",
    )} invert selection,${chalk.greenBright("<enter>")} next step)`,
    options: [
      { value: "Babel", label: "Babel" },
      { value: "TypeScript", label: "TypeScript" },
      { value: "Eslint", label: "Eslint" },
      { value: "Prettier", label: "Prettier" },
    ],
    required: false,
  })) as string[];

  // 选择包管理器
  responses.packageManager = (await select({
    message: "Pick a packageManager for your project",
    options: [
      { value: "pnpm", label: "pnpm" },
      { value: "yarn", label: "yarn" },
      { value: "npm", label: "npm" },
    ],
  })) as string;

  // 选择npm源
  responses.npmSource = (await select({
    message: "Pick a npm source for your project",
    initialValue: registryInfo,
    options: npmSources,
  })) as string;

  return getPreset(
    responses.template,
    responses.buildTool,
    responses.plugins,
    responses.packageManager,
    responses.npmSource,
  );
}

export { projectSelect };
