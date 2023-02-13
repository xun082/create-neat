import { isUseTypescript, resolveApp } from "candy-dev-utils";
import fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import { mkdirFileName } from "./questions.js";
import { simplifyPath, fileTypeRouter } from "./index.js";
import { removeExitMatter } from "./questions.js";

export default async function createFile(type, options) {
  const { filename } = await inquirer.prompt(mkdirFileName);
  const reg = /^[a-z]+$/;
  if (!reg.test(filename)) {
    console.log(chalk.redBright("输入文件名格式有误,请重新输入"));
    process.exit(1);
  }

  const useLanguage = isUseTypescript ? "t" : "j";
  // 简化路径,以免用户睡着了输错路径
  const router = options && simplifyPath(options);
  const defaultRouter = fileTypeRouter(useLanguage, filename).get(type);
  const suffix = defaultRouter.split(".").at(-1);
  const userRouter = `${router}/${filename}.${suffix}`;

  // 完整路径,如果用户不输入路径则使用默认路径
  const fileRouter = resolveApp(options ? userRouter : defaultRouter);

  if (fs.existsSync(fileRouter)) {
    const { action } = await inquirer.prompt(
      removeExitMatter(fileRouter, "file")
    );

    if (action === true) fs.promises.unlink(fileRouter);
  }

  console.log(fileRouter);
}

// 自动导入reducer
function autoImportReducer(data, filename) {
  return data
    .replace(/^(import)(\s|\S)*from(\s|\.)*('|").*('|"|;)/m, (content) => {
      return content + `\nimport ${filename} from "./modules/${filename}";`;
    })
    .replace(/(?<=(reducer:(\s)*{))(\s|\S)*(?=(},))/, (content) => {
      if (content === "") return content + `${filename}`;
      return content + `,${filename}`;
    });
}
