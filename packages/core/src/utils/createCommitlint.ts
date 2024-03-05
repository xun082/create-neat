import { join } from "path";
import fs from "fs-extra";

import { PackageJsonType } from "../types";

import { getNpmPackage } from "./fileController";
import { projectLink } from "./constants";
import getPackageJsonInfo from "./getPackageInfo";

export default function createCommitlint(matter: string): void {
  const commit = "commit";
  getNpmPackage(projectLink.get(commit) as string, commit, matter);

  const rootDirPackageDirectory = join(matter, "package.json");
  const commitJson: any = getPackageJsonInfo("../../template/husky.json", true);
  const packageJson: PackageJsonType = getPackageJsonInfo(rootDirPackageDirectory, false);

  for (const key in commitJson) {
    if (Object.prototype.toString.call(commitJson[key]) === "[object Object]") {
      packageJson[key] = {
        ...packageJson[key],
        ...commitJson[key],
      };
    } else if (Array.isArray(commitJson[key])) {
      packageJson[key] = [...commitJson[key], ...(packageJson[key] ?? [])];
    } else {
      packageJson[key] = commitJson[key];
    }
  }

  try {
    fs.writeFileSync(rootDirPackageDirectory, JSON.stringify(packageJson, null, 2));
  } catch (error) {
    console.error("Failed to write package.json:", error);
  }
}
