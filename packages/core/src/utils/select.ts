import { multiselect, select, intro } from "@clack/prompts";
import chalk from "chalk";

import { getPreset } from "./preset";

interface Responses {
  template: string;
  buildTool: string;
  plugins: string[];
  packageManager: string;
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
  };

  intro(chalk.green(" create-you-app "));

  // 选择模板预设
  responses.template = (await select({
    message: "Pick a template please",
    options: [
      { value: "common-lib", label: "common-lib" },
      { value: "vue", label: "vue" },
      { value: "react", label: "react" },
      { value: "template-test", label: "test" },
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

  return getPreset(
    responses.template,
    responses.buildTool,
    responses.plugins,
    responses.packageManager,
  );
}

export { projectSelect };
