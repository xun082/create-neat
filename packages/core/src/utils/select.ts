import { multiselect, select, intro, text } from "@clack/prompts";
import chalk from "chalk";
import { execSync } from "child_process";

import { buildToolType } from "../types";

import { getPreset, defaultPreset } from "./preset";
import { getNpmSource } from "./getnpmSource";
import { savePresetToRcPath, getRcPath, loadRcOptions } from "./options";

const registryInfo = execSync("npm config get registry").toString().trim();
const npmSource: any = getNpmSource();
const rcPath = getRcPath(".neatrc");
/**
 * 表示用户对项目预设的回应。
 * @interface Responses
 * @property {string} template - 选择的模板名称。
 * @property {string} buildTool - 选择的构建工具名称。
 * @property {string[]} plugins - 选择的插件列表。
 * @property {string} packageManager - 选择的包管理器名称。
 * @property {string} npmSource - 选择的 npm 源名称。
 * @property {boolean} extraConfigFiles - 选择文件生成位置 'In dedicated config files' --> true 'In packagejson' --> false。
 */
interface Responses {
  template: string;
  buildTool?: buildToolType;
  plugins: string[];
  packageManager: string;
  npmSource: string;
  extraConfigFiles: boolean;
}

/**
 *
 * @param plugins 预设的插件对象
 * @returns 返回默认预设的插件组合
 */
function getPluginsName(plugins: Record<string, any>) {
  const pluginsKey = Object.keys(plugins);
  const pluginsName = pluginsKey.reduce((pre, name, idx) => {
    return pre + name + (idx === pluginsKey.length - 1 ? "" : ", ");
  }, "");
  return pluginsName;
}

/**
 * @description 终端交互，获取用户的项目预设
 * @returns 返回用户的项目预设 Responses
 */
async function projectSelect() {
  const responses: Responses = {
    template: "",
    plugins: [],
    packageManager: "",
    npmSource: "",
    extraConfigFiles: true,
  };

  intro(chalk.green(" create-you-app "));

  // 从用户系统文件夹中获取用户保存的配置
  const rcOptions = loadRcOptions();
  // 将自定义预设与默认预设进行合并
  const allPresets = Object.assign({}, rcOptions.presets, defaultPreset);

  // 根据所有预设获取预设选项列表
  function getPresetListOptions() {
    return Object.keys(allPresets).map((key) => {
      const tem = allPresets[key].template;
      const pluginName = getPluginsName(allPresets[key].plugins);
      const buildTool = allPresets[key].buildTool;
      let label;
      if (key in defaultPreset) {
        label = `Default-${key}(${chalk.yellow("[" + tem + "] ")}${chalk.yellow(pluginName)}, ${chalk.yellow(buildTool)})`;
      } else {
        label = `${key}(${chalk.yellow("[" + tem + "] ")}${chalk.yellow(pluginName)}, ${chalk.yellow(buildTool)})`;
      }
      return {
        value: key,
        label,
      };
    });
  }

  const presetName = (await select({
    message: "Please pick a preset:",
    options: [...getPresetListOptions(), { value: "", label: "Manually select preset" }],
  })) as string;

  if (presetName) {
    if (!allPresets[presetName].npmSource) {
      allPresets[presetName].npmSource = registryInfo;
    }
    return allPresets[presetName];
  }

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
  })) as buildToolType;

  // 选择插件
  responses.plugins = (await multiselect({
    message: `Pick plugins for your project.(${chalk.greenBright(
      "<space>",
    )} select, ${chalk.greenBright("<a>")} toggle all, ${chalk.greenBright(
      "<i>",
    )} invert selection,${chalk.greenBright("<enter>")} next step)`,
    options: [
      { value: "babel", label: "babel" },
      { value: "typescript", label: "typescript" },
      { value: "eslint", label: "eslint" },
      { value: "prettier", label: "prettier" },
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
    options: npmSource,
  })) as string;

  // 选择插件配置文件生成位置
  responses.extraConfigFiles = (await select({
    message:
      "Where do you want to place the configurations, such as Babel, ESLint, and other plugins?",
    options: [
      { value: true, label: "In dedicated config files" },
      { value: false, label: "In package.json" },
    ],
  })) as boolean;

  const preset = getPreset(
    responses.template,
    responses.buildTool,
    responses.plugins,
    responses.packageManager,
    responses.npmSource,
    responses.extraConfigFiles,
  );

  // 选择是否将此次预设保存到系统文件中
  const isSavePreset = await select({
    message: "Save this as a preset for future projects?",
    options: [
      { value: true, label: "Yes" },
      { value: false, label: "No" },
    ],
  });

  if (isSavePreset) {
    const saveName = (await text({
      message: "Save preset as:",
      placeholder: "Please input presets name:",
    })) as string;
    if (saveName && savePresetToRcPath(preset, saveName)) {
      console.log(`🎉  Preset ${chalk.yellow(saveName)} saved in ${chalk.yellow(rcPath)}`);
    }
  }

  return preset;
}

export { projectSelect };
