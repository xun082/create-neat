import { resolveApp } from "@laconic/utils";
import fs from "fs-extra";
import { exec } from "child_process";
import { confirm } from "@clack/prompts";
import chalk from "chalk";
import { parse } from "@babel/parser";
import path from "path";

import { removeDirectory } from "./fileController";
import { projectSelect } from "./select";
import gitCheck from "./gitCheck";
import Generator from "./Generator";
import PackageAPI from "./PackageAPI";
import { createFiles } from "./createFiles";
import { type Preset, getNpmForPackage } from "./preset";
import createSuccessInfo from "./createSuccessInfo";
import dependenciesInstall from "./dependenciesInstall";
import { createReadmeString } from "./createFile";

// Ctrl+C 退出时打印的提示信息
const exitMsg: string = "⌨️  Ctrl+C pressed - Exiting the program";

// 设置输入模式为原始模式
process.stdin.setRawMode(true);

// 监听键盘输入，避免选择阶段需要多次 Ctrl+C 退出
process.stdin.on("data", (key) => {
  // 检测到 Ctrl+C
  if (key[0] === 3) {
    console.log(exitMsg);
    process.exit(1);
  }
});

// 这里的监听是为了：当用户输入完预设，此时项目文件夹已经创建并且在下载依赖，
// 这时如果用户使用 Ctrl+C 终止了程序，那么清理掉初始化一半的文件夹
process.on("SIGINT", () => {
  console.log("\n" + exitMsg);
  removeDirectory(rootDirectory, true);
  process.exit(1);
});

// 创建项目文件夹
async function createFolder(rootDirectory: string, options: Record<string, any>) {
  // 检查目录是否存在
  if (fs.existsSync(rootDirectory)) {
    let proceed = options.force; // 如果强制创建，则默认继续

    // 如果不是强制创建，询问用户是否覆盖
    if (!proceed) {
      proceed = await confirm({
        message:
          "Whether to overwrite a file with the same name that exists in the current directory?",
      });
    }

    // 根据用户的选择或强制选项决定是否继续
    if (proceed) {
      removeDirectory(rootDirectory, false); // 删除已存在的目录
    } else {
      process.exit(1); // 用户选择不覆盖，退出程序
    }
  }

  // 创建目录，如果之前已经删除或目录不存在
  fs.mkdirSync(rootDirectory, { recursive: true });
}

// rootDirectory 由 create-neat 所在的系统根目录和用户输入的文件夹名称拼接而成
let rootDirectory: string;

// 模板创建主函数
export default async function createAppTest(projectName: string, options: Record<string, any>) {
  // 记录开发环境并设置环境变量
  process.env.NODE_ENV = options.dev ? "DEV" : "PROD";

  // 获取到项目的根目录的绝对路径
  const rootDirectory = resolveApp(projectName);

  await createFolder(rootDirectory, options);

  // 获取用户选择预设
  const preset: Preset = await projectSelect();
  const { template, packageManager, plugins, buildTool } = preset;

  /* ----------从下面的代码开始，创建package.json---------- */
  console.log(chalk.blue(`\n📄  Generating package.json...`));
  // 1. 配置文件基本内容，包含不仅仅是package.json的字段
  const packageContent = {
    name: projectName,
    version: "0.1.0",
    private: true,
    devDependencies: {},
  };

  // 2. 初始化构建工具配置文件
  const buildToolConfigTemplate = fs.readFileSync(
    path.resolve(fs.realpathSync(process.cwd()), `./template/${buildTool}.config.js`),
    "utf-8",
  );
  const buildToolConfigAst = parse(buildToolConfigTemplate, {
    sourceType: "module",
  });
  fs.writeFileSync(path.resolve(rootDirectory, `${buildTool}.config.js`), buildToolConfigTemplate);

  // 3. 遍历 plugins，插入依赖
  Object.keys(plugins).forEach((dep) => {
    console.log("dep:", dep);
    // TODO: 更多的处理依据 plugins[dep] 后续的变化而插入
    let { version } = plugins[dep];
    if (!version) version = "latest"; // 默认版本号为 latest
    packageContent.devDependencies[dep] = version; // 插件都是以 devDependencies 安装
    // TODO: 现在只有 babel-plugin-test-ljq 这一个包，先试一下，后续发包
    if (dep === "Babel") {
      const pluginName = `${dep.toLowerCase()}-plugin-test-ljq`;
      packageContent.devDependencies[pluginName] = "latest";
      delete packageContent.devDependencies["Babel"];
    }
  });
  const packageJson = new PackageAPI(rootDirectory);
  await packageJson.createPackageJson(packageContent);
  // 拉取模板
  // TODO: 新模板未开发，先模拟过程
  console.log("Creating a project...");
  //   execSync(`mkdir ${rootDirectory}/src`);

  // 初始化 Git 仓库
  if (gitCheck(rootDirectory)) exec("git init", { cwd: rootDirectory });

  // 安装传入的依赖
  if (process.env.NODE_ENV === "PROD") {
    await dependenciesInstall(rootDirectory, packageManager);
  }
  // 运行生成器创建项目所需文件和结构
  console.log(chalk.blue(`🚀  Invoking generators...`));
  // 传入根目录路径、插件列表、package.json内容创建生成器实例
  const generators = new Generator(rootDirectory, plugins, packageContent, template, {
    ast: buildToolConfigAst,
    buildTool,
  });
  await generators.generate();

  // 安装附加依赖
  // TODO: 待映射部分完成再测试

  await dependenciesInstall(rootDirectory, packageManager);
  // TODO: configMap 功能目前无用，考虑改为针对于架构的特异化插件选择，目前不影响功能
  const npmList = getNpmForPackage(preset);
  console.log("npmList", npmList);

  // 其他剩余操作，如创建 md 文档，或其他首位操作
  console.log(chalk.blue(`📄  Generating README.md...`));
  await createFiles(rootDirectory, {
    "README.md": createReadmeString(packageManager, template, "README.md"),
    "README-EN.md": createReadmeString(packageManager, template, "README-EN.md"),
  });
  createSuccessInfo(projectName, "npm");

  // gitignore
}
