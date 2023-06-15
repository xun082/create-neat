import os from "node:os";
import getPackageJsonInfo from "./getPackageInfo";

function createPackageJson(projectType: string, matter: string) {
  const packageInfo = getPackageJsonInfo(
    `../../template/${projectType}.json`,
    true
  );
  packageInfo.author = os.userInfo().username;
  packageInfo.name = matter;

  return packageInfo;
}

export default createPackageJson;
