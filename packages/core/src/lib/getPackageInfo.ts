import { readFileSync } from "node:fs";
import { PackageJson } from "../types";
import { join } from "node:path";

function getPackageJsonInfo(
  target: string,
  isCliPackageJson: boolean
): PackageJson {
  return JSON.parse(
    readFileSync(isCliPackageJson ? join(__dirname, target) : target).toString()
  ) as PackageJson;
}

export default getPackageJsonInfo;
