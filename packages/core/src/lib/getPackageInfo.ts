import { readFileSync } from "node:fs";
import { PackageJson } from "../types";
import { join } from "node:path";

function getPackageJsonInfo(target: string): PackageJson {
  return JSON.parse(
    readFileSync(join(__dirname, target)).toString()
  ) as PackageJson;
}

export default getPackageJsonInfo;
