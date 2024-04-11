import { PackageJsonType } from "../types";

import { getJsonFileInfo } from "./getJsonFileInfo";
import { resolveApp } from "./getResolveApp";

/**
 * 检查项目是否使用特定的 CSS 预设。
 * @param {string} preset 要检查的 CSS 预设名称。
 * @returns {string | undefined} 如果项目中包含指定的 CSS 预设，则返回该预设的版本号，否则返回 undefined。
 */
function useCssPreset(preset: string) {
  const packageInfo = getJsonFileInfo(resolveApp("./package.json")) as PackageJsonType;

  return packageInfo.dependencies?.[preset] || packageInfo.devDependencies?.[preset];
}

export { useCssPreset };
