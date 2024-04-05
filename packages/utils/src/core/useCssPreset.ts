import { PackageJsonType } from "../types";

import { getJsonFileInfo } from "./getJsonFileInfo";
import { resolveApp } from "./getResolveApp";

/**
 * 使用指定的 CSS 预设。
 * 
 * @param preset - 要使用的 CSS 预设名称。
 * @returns 如果该预设在项目的依赖或开发依赖中存在，则返回其版本号；否则返回 undefined。
 */
function useCssPreset(preset: string) {
  const packageInfo = getJsonFileInfo(resolveApp("./package.json")) as PackageJsonType;

  return packageInfo.dependencies?.[preset] || packageInfo.devDependencies?.[preset];
}

export { useCssPreset };
