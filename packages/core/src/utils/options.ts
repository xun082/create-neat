import fs from "fs";
import path from "node:path";
import os from "os";
import process from "process";
import chalk from "chalk";

import { Preset } from "./preset";

/**
 * @description 获取用户系统主目录下保存预设的文件路径
 * @param filename 保存用户配置的文件名 .neatrc
 * @returns 保存用户配置的文件路径
 */
function getRcPath(filename: string) {
  return path.join(os.homedir(), filename);
}

const rcPath = getRcPath(".neatrc");

/**
 * @description 获取保存的用户配置(用户自定义预设等)
 */
function loadRcOptions() {
  if (fs.existsSync(rcPath)) {
    let options;
    try {
      options = JSON.parse(fs.readFileSync(rcPath, "utf-8"));
    } catch (error) {
      console.log(chalk.red(`read ${rcPath} file error！Please re-run create-neat appname！`));
      process.exit(1);
    }
    return options;
  } else {
    return {};
  }
}

/**
 *
 * @param savedOptions 要保存的用户配置
 */
function saveOptionsToRcPath(savedOptions) {
  // 将要保存的用户配置与已有的配置进行合并
  const options = Object.assign(loadRcOptions(), savedOptions);

  try {
    fs.writeFileSync(rcPath, JSON.stringify(options, null, 2));
    return true;
  } catch (error) {
    console.log(chalk.red("Write options to .neatrc error！"));
  }
}

/**
 * @description 将用户自定义预设保存到框架配置文件中
 * @param preset 用户的自定义预设
 * @param name 预设的名称
 */
function savePresetToRcPath(preset: Preset, name: string) {
  const presets = loadRcOptions().presets || {};
  presets[name] = preset;
  return saveOptionsToRcPath({ presets });
}

export { savePresetToRcPath, loadRcOptions, getRcPath };
