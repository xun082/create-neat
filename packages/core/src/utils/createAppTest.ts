import { resolveApp } from "@laconic/utils";
import fs from "fs-extra";
import { execSync, exec } from "child_process";
import { confirm } from "@clack/prompts";
import chalk from "chalk";

import { removeDirectory } from "./fileController";
import { projectSelect } from "./select";
import isGitInstalled from "./checkGitInstallation";
// import { createPackageJson } from "./createFile";
import { createFiles } from "./createFiles";
import { type Preset, getFilesForProject, getNpmForPackage } from "./preset";
import createSuccessInfo from "./createSuccessInfo";

// 设置输入模式为原始模式
process.stdin.setRawMode(true);

// 监听键盘输入，避免选择阶段需要多次 Ctrl+C 退出
process.stdin.on("data", (key) => {
  // 检测到 Ctrl+C
  if (key[0] === 3) {
    console.log("⌨️  Ctrl+C pressed - Exiting the program");
    process.exit(1);
  }
});

// 模板创建主函数
export default async function createAppTest(projectName: string, options) {
  const rootDirectory = resolveApp(projectName);

  // 创建项目文件夹
  if (fs.existsSync(rootDirectory) && !options.force) {
    const shouldContinue = await confirm({
      message:
        "Whether to overwrite a file with the same name that exists in the current directory ?",
    });

    // 删除已存在文件并创建新文件
    if (shouldContinue === true) {
      removeDirectory(projectName, true);
    } else process.exit(1);

    execSync(`mkdir ${rootDirectory}`);
  }

  // 获取用户选择预设
  const preset: Preset = await projectSelect();

  console.log(rootDirectory);
  // 创建package.json
  await createFiles(rootDirectory, {
    "package.json": "{}", // todo:具体内容待重构
  });

  // 拉取模板
  // todo: 新模板未开发，先模拟过程
  console.log("Creating a project...");

  // 初始化 Git 仓库
  if (isGitInstalled()) exec("git init", { cwd: rootDirectory });

  // todo: 插件未开发，先模拟过程

  // 安装插件至 package.json
  Object.keys(preset.plugins).forEach(async (plugin) => {
    console.log(plugin, "installed");
    // 进入仓库
    // await execSync(`npm install ${plugin}`)
  });

  // 运行生成器创建项目所需文件和结构
  console.log(chalk.blue(`🚀  Invoking generators...`));
  const fileList = getFilesForProject(preset);
  console.log("fileList", fileList);
  fileList.forEach(async (file) => {
    await createFiles(rootDirectory, {
      [file]: "", // todo: 写入的内容还待设计，考虑修改 configMap 的 files 为对象
    });
  });

  // 安装附加依赖
  // todo: npm 安装逻辑需要等待设置包管理工具，目前默认 npm，后续优化
  // todo: configMap 的 npm 也需要改为对象，传入包依赖模式（-S，-D）
  const npmList = getNpmForPackage(preset);
  console.log("npmList", npmList);

  // 其他剩余操作，如创建 md 文档，或其他首位操作
  console.log("📄  Generating README.md...");
  await createFiles(rootDirectory, {
    "README.md": "",
  });

  createSuccessInfo(projectName, "npm");
}
