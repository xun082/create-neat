import { resolveApp } from "../../utils/index.js";
import { require } from "./getPackageInfo.js";
import fs from "fs";

import { compile } from "./createFile.js";

export default async function createLint(router) {
  const basePackage = resolveApp(`${router}/package.json`);

  const packageInfo = require(basePackage);
  const commitInfo = require("../template/commit.json");

  const packageContent = { ...commitInfo };
  for (const key in packageInfo) {
    if (!commitInfo[key]) {
      packageContent[key] = packageInfo[key];
    } else {
      packageContent[key] = {
        ...packageInfo[key],
        ...commitInfo[key],
      };
    }
  }

  fs.promises.writeFile(
    basePackage,
    JSON.stringify(packageContent, null, 2) + "\t"
  );

  // 添加 pre-commit 文件
  fs.mkdirSync(`${router}/.husky`);
  const result = await compile("pre-commit");
  fs.promises.writeFile(resolveApp(`${router}/.husky/pre-commit`), result);
}
