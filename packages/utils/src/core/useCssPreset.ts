import { PackageJsonType } from "../types";

import { getJsonFileInfo } from "./getJsonFileInfo";
import { resolveApp } from "./getResolveApp";

function useCssPreset(preset: string) {
  const packageInfo = getJsonFileInfo(resolveApp("./package.json")) as PackageJsonType;

  return packageInfo.dependencies?.[preset] || packageInfo.devDependencies?.[preset];
}

export { useCssPreset };
