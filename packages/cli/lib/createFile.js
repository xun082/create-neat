import { isUseTypescript, resolveApp } from "../../utils/index.js";
import fs from "fs";
import inquirer from "inquirer";
import chalk from "chalk";
import ejs from "ejs";
import { mkdirFileName } from "./questions.js";
import { simplifyPath, fileTypeRouter } from "./index.js";
import { removeExitMatter } from "./questions.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

  const fileContext = await compile(type, {
    filename,
    toUpperCase: filename
      .toLowerCase()
      .replace(/( |^)[a-z]/g, (L) => L.toUpperCase()),
  });

  if (type === "redux") {
    const router = path.resolve("src/store", `index.${suffix}`);
    if (!fs.existsSync(router)) {
      const fileContext = await compile("redux-entry", {
        isUseTypescript,
      });
      writeToFile(router, autoImportReducer(fileContext, filename));
    } else {
      const data = fs.readFileSync(router, "utf-8");
      writeToFile(router, autoImportReducer(data, filename));
    }
  }

  writeToFile(fileRouter, fileContext);
  console.log(chalk.greenBright("√ 文件创建成功"));
}

// 判断文件是否存在,不存在则创建
function createDirSync(router) {
  const result = router.slice(process.cwd().length + 1).split("\\");
  let index = ".";
  for (const name of result) {
    if (name.indexOf(".") !== -1) break;

    index += `/${name}`;
    console.log(index);
    if (!fs.existsSync(index)) fs.mkdirSync(index);
  }
}

export function writeToFile(path, content) {
  createDirSync(path);
  return fs.promises.writeFile(path, content);
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

export function compile(template, data = {}) {
  if (["page", "component"].includes(template)) template = "react";

  const templatePosition = `../template/${template}.ejs`;
  const templatePath = path.resolve(__dirname, templatePosition);

  return new Promise((resolve, reject) => {
    ejs.renderFile(templatePath, { data }, {}, (error, result) => {
      if (error) reject(error);
      resolve(result);
    });
  });
}
