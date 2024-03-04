import { readFileSync } from "node:fs";
import { join } from "node:path";

import { PackageJsonType } from "../types";

/**
 * @author moment
 * @description 获取 package.json 信息
 * @returns {*}
 */

function getPackageJsonInfo(target: string, isCliPackageJson: boolean): PackageJsonType {
  return JSON.parse(
    readFileSync(isCliPackageJson ? join(__dirname, target) : target).toString(),
  ) as PackageJsonType;
}

export default getPackageJsonInfo;
