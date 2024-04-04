import { resolveApp } from "@laconic/utils";
import fs from "fs-extra";
import { exec } from "child_process";
import { confirm } from "@clack/prompts";
import chalk from "chalk";

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

// 模板创建主函数
export default async function createAppTest(projectName: string, options: Record<string, any>) {
  const rootDirectory = resolveApp(projectName);

  await createFolder(rootDirectory, options);

  // 获取用户选择预设
  const preset: Preset = await projectSelect();
  const { packageManager } = preset;

  // 创建package.json
  console.log(chalk.blue(`\n📄  Generating package.json...`));
  const packageContent = {
    name: projectName,
    version: "0.1.0",
    private: true,
    devDependencies: {},
  };

  // 遍历 preset.plugins，插入依赖
  Object.keys(preset.plugins).forEach((dep) => {
    console.log("dep:", dep);
    // todo: 更多的处理依据 preset.plugins[dep] 后续的变化而插入
    let { version } = preset.plugins[dep];
    if (!version) {
      version = "latest";
    }
    packageContent.devDependencies[dep] = version;
    // todo:现在只有babel-plugin-test-ljq这一个包，先试一下，后续发包
    if (dep === "Babel") {
      const pluginName = `${dep.toLowerCase()}-plugin-test-ljq`;
      packageContent.devDependencies[pluginName] = "latest";
    }
  });
  const packageJson = new PackageAPI(rootDirectory);
  await packageJson.createPackageJson(packageContent);

  // 拉取模板
  // todo: 新模板未开发，先模拟过程
  console.log("Creating a project...");

  // 初始化 Git 仓库
  if (gitCheck(rootDirectory)) exec("git init", { cwd: rootDirectory });

  // todo: 插件未开发，先模拟过程
  // 安装插件至 package.json
  Object.keys(preset.plugins).forEach(async (plugin) => {
    console.log(plugin, "installed");
    // 进入仓库
    // await execSync(`npm install ${plugin}`)
  });

  // 安装附加依赖
  // todo: 待映射部分完成再测试
  await dependenciesInstall(rootDirectory, packageManager);
  // todo: configMap 的 npm 也需要改为对象，传入包依赖模式（-S，-D）
  const npmList = getNpmForPackage(preset);
  console.log("npmList", npmList);

  // 运行生成器创建项目所需文件和结构
  console.log(chalk.blue(`🚀  Invoking generators...`));
  const generators = new Generator(rootDirectory, preset.plugins);
  await generators.generate();

  // 其他剩余操作，如创建 md 文档，或其他首位操作
  console.log(chalk.blue(`📄  Generating README.md...`));
  await createFiles(rootDirectory, {
    "README.md": createReadmeString(preset.packageManager, preset.template, "README.md"),
    "README-EN.md": createReadmeString(preset.packageManager, preset.template, "README-EN.md"),
  });
  createSuccessInfo(projectName, "npm");

  // gitignore
}
