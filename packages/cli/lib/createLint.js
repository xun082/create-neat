import { resolveApp } from "@obstinate/dev-utils";
import { require } from "./getPackageInfo.js";
import fs from "fs";

import { compile } from "./createFile.js";

export default async function createLint(router) {
  const basePackage = resolveApp(`${router}/package.json`);

  // 项目默认package.json 文件
  const packageInfo = require(basePackage);
  // 添加 husky 功能需要添加的 package.json 信息
  const commitInfo = require("../template/commit.json");

  for (const key in commitInfo) {
    if (Object.prototype.toString.call(commitInfo[key]) === "[object Object]") {
      packageInfo[key] = {
        ...packageInfo[key],
        ...commitInfo[key],
      };
    } else if (Array.isArray(commitInfo[key])) {
      const isExist = packageInfo[key] === undefined ? [] : packageInfo[key];
      packageInfo[key] = [...commitInfo[key], ...isExist];
    } else {
      packageInfo[key] = commitInfo[key];
    }
  }

  fs.promises.writeFile(
    basePackage,
    JSON.stringify(packageInfo, null, 2) + "\t"
  );

  // 添加 pre-commit 文件
  fs.mkdirSync(`${router}/.husky`);
  const result = await compile("pre-commit");
  fs.promises.writeFile(resolveApp(`${router}/.husky/pre-commit`), result);
}
