import path, { resolve, join } from "path";
import generator from "@babel/generator";
import fs from "fs-extra";
import chalk from "chalk";

import { relativePathToRoot } from "../utils/constants";
import { createFiles } from "../utils/createFiles";
import { createConfigByParseAst } from "../utils/ast/parseAst";

import GeneratorAPI from "./GeneratorAPI";
import ConfigTransform from "./ConfigTransform";
import TemplateAPI from "./TemplateAPI";
import FileTree from "./FileTree";
import BaseAPI from "./BaseAPI";

interface ConfigFileData {
  file: Record<string, string[]>;
}

/**
 * @description 为文件内容添加换行符
 * @param str 文件内容
 * @returns 末尾添加换行符后的文件内容
 */
const ensureEOL = (str: string) => {
  if (str.charAt(str.length - 1) !== "\n") {
    return str + "\n";
  }
  return str;
};

// 提前预置的插件对应的配置文件清单
const defaultConfigTransforms = {
  babel: new ConfigTransform({
    file: {
      js: ["babel.config.js"],
    },
  }),
  postcss: new ConfigTransform({
    file: {
      js: ["postcss.config.js"],
      json: [".postcssrc.json", ".postcssrc"],
      yaml: [".postcssrc.yaml", ".postcssrc.yml"],
    },
  }),
  eslint: new ConfigTransform({
    file: {
      js: [".eslintrc.js"],
      json: [".eslintrc", ".eslintrc.json"],
      yaml: [".eslintrc.yaml", ".eslintrc.yml"],
    },
  }),
  browserslist: new ConfigTransform({
    file: {
      lines: [".browserslistrc"],
    },
  }),
  "lint-staged": new ConfigTransform({
    file: {
      js: ["lint-staged.config.js"],
      json: [".lintstagedrc", ".lintstagedrc.json"],
      yaml: [".lintstagedrc.yaml", ".lintstagedrc.yml"],
    },
  }),
  prettier: new ConfigTransform({
    file: {
      json: [".prettierrc"],
    },
  }),
};

/**
 * Vue项目的配置对象。
 * @typedef {Object} VueConfigTransform
 * @property {Object} file - 文件配置。
 * @property {string[]} file.js - JavaScript配置文件的文件名数组。
 */
const reservedConfigTransforms = {
  vue: new ConfigTransform({
    file: {
      js: ["vue.config.js"],
    },
  }),
};

/**
 * 根据传入的路径加载模块并返回。
 * @async
 * @function loadModule
 * @param {string} modulePath - 要加载的模块路径。
 * @param {string} rootDirectory - 根目录路径。
 * @returns {Promise<any>} 返回一个 Promise 对象，该对象在成功时解析为加载的模块，失败时解析为 null。
 */
async function loadModule(modulePath: string, rootDirectory: string) {
  /**
   * 解析后的路径。
   * @type {string}
   */
  const resolvedPath = path.resolve(rootDirectory, modulePath);
  try {
    const module = await require(resolvedPath);
    return module;
  } catch (error) {
    console.error(`Error loading module at ${resolvedPath}:`, error);
    return null;
  }
}

/**
 * @description 生成器，实现插件的文件注入、配置拓展
 */
class Generator {
  private rootDirectory: string;
  private plugins: Record<string, any>;
  private files: FileTree; // 键：文件名，值：文件内容
  private rootOptions: Record<string, any> = {};
  private configTransforms: Record<string, ConfigTransform> = {};
  private defaultConfigTransforms: Record<string, ConfigTransform>;
  private reservedConfigTransforms: Record<string, ConfigTransform>;
  public pkg: object; // 执行generatorAPI之后带有key值为plugin
  public originalPkg: object; // 原始package.json
  public templateName: string; // 需要拉取的模板名称
  public buildToolConfig;
  private generatorAPI: GeneratorAPI;
  private templateAPI: TemplateAPI;

  constructor(
    rootDirectory: string,
    plugins = {},
    pkg = {},
    templateName: string,
    buildToolConfig = {},
  ) {
    this.rootDirectory = rootDirectory;
    this.plugins = plugins;
    this.defaultConfigTransforms = defaultConfigTransforms;
    this.reservedConfigTransforms = reservedConfigTransforms;
    this.originalPkg = pkg;
    this.pkg = Object.assign({}, pkg);
    this.templateName = templateName;
    this.buildToolConfig = buildToolConfig;
    this.files = new FileTree(this.rootDirectory);
    this.generatorAPI = new GeneratorAPI(this);
    this.templateAPI = new TemplateAPI(this);
  }

  // 根据环境变量加载 plugin/template
  async loadBase(pkgPath: string, modulePath: string): Promise<(api: BaseAPI) => Promise<any>> {
    let baseGenerator: (api: BaseAPI) => Promise<any>;
    if (process.env.NODE_ENV === "DEV") {
      const basePathInDev = pkgPath;
      baseGenerator = await loadModule(basePathInDev, path.resolve(__dirname, relativePathToRoot));
    } else if (process.env.NODE_ENV === "PROD") {
      if (modulePath !== "") {
        const basePathInProd = modulePath;
        baseGenerator = await loadModule(basePathInProd, this.rootDirectory);
      }
    } else {
      throw new Error("NODE_ENV is not set");
    }
    return baseGenerator;
  }

  // 生成构建工具配置文件
  async buildToolGenerate(entryPath: string) {
    // 执行 plugin/template 的入口文件，把 config 写进来
    const baseEntry = await loadModule(entryPath, path.resolve(__dirname, relativePathToRoot));

    // 处理构建工具配置
    if (typeof baseEntry === "function") {
      // 解析配置项成 ast 语法树,并且和原始配置的 ast 合并
      createConfigByParseAst(
        this.buildToolConfig.buildTool,
        baseEntry(this.buildToolConfig.buildTool),
        this.buildToolConfig.ast,
      );
      const code = generator(this.buildToolConfig.ast).code;
      fs.writeFileSync(
        path.resolve(this.rootDirectory, `${this.buildToolConfig.buildTool}.config.js`),
        code,
      );
    }
  }

  // 单独处理一个插件相关文件
  async pluginGenerate(pluginName: string) {
    // 根据环境变量加载插件
    // TODO: 改用每个 plugin 的 API 来加载
    // pluginGenerator 是一个函数，接受一个 GeneratorAPI 实例作为参数
    const pluginGenerator = await this.loadBase(
      `packages/@plugin/plugin-${pluginName}/generator/index.cjs`,
      `node_modules/${pluginName}-plugin-test-ljq`,
    );

    if (pluginGenerator && typeof pluginGenerator === "function") {
      await pluginGenerator(this.generatorAPI);
    }

    // ejs 渲染插件的 template 文件
    const templatePath = resolve(
      __dirname,
      relativePathToRoot,
      `packages/@plugin/plugin-${pluginName}/generator/template`,
    );

    if (fs.existsSync(templatePath)) {
      new FileTree(templatePath).renderTemplates(this.rootDirectory);
    }

    await this.buildToolGenerate(`packages/@plugin/plugin-${pluginName}/index.cjs`);
  }

  // 单独处理一个框架相关文件
  async templateGenerate() {
    // TODO: 以下配置过程暂时与插件类同，后续可添加额外配置
    // 根据环境变量加载插件
    // TODO: 改用每个 template 的 API 来加载
    // templateGenerator 是一个函数，接受一个 TemplateAPI 实例作为参数
    const templateGenerator = await this.loadBase(
      `packages/core/template/${this.templateName}/generator/index.cjs`,
      "",
    );

    if (templateGenerator && typeof templateGenerator === "function") {
      // 获取生成文件的结果
      const res = await templateGenerator(this.templateAPI);
      // 如果结果不为未定义的值，则加载模块
      if (res !== undefined) {
        await this.buildToolGenerate(`packages/core/template/${this.templateName}/index.cjs`);
      }
    }
  }

  // 创建所有 plugin 和 template 的相关文件
  async generate({ extraConfigFiles }) {
    // 判断并设置 ts 环境变量
    if (Object.keys(this.plugins).includes("typescript")) {
      process.env.isTs = "true";
    }

    // 为每个 plugin 创建 GeneratorAPI 实例，调用插件中的 generate
    for (const pluginName of Object.keys(this.plugins)) {
      await this.pluginGenerate(pluginName);
    }

    // TODO: 暂定为 template-test 包
    if (this.templateName === "template-test") {
      await this.templateGenerate();
    }

    // 从package.json中生成额外的的文件
    await this.extractConfigFiles(extraConfigFiles);
    // 重写pakcage.json文件，并向根文件树中添加该文件，消除generatorAPI中拓展package.json带来得副作用
    this.files.addToTreeByFile(
      "package.json",
      JSON.stringify(this.pkg, null, 2),
      path.resolve(this.rootDirectory, "package.json"),
    );

    // 安装package.json文件
    await createFiles(this.rootDirectory, {
      "package.json": JSON.stringify(this.pkg, null, 2),
    });

    console.log(chalk.green("💘 Files have been generated and written to disk."));

    /* ----------拉取对应模板，并进行ejs渲染---------- */
    const templatePath = join(__dirname, "../../template/", "template-test/generator/template");

    // TODO: 此处的 ejs 渲染配置是测试用数据，实际应用中需要根据使用不同的模板进行具体的配置，具体如何实现 options 的集中管理有待商榷
    const options = {
      packageEjs: {
        name: "template_test",
        version: "0.1.0",
      },
      VueEjs: {
        name: "vue_test",
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    };
    new FileTree(templatePath).renderTemplates(this.rootDirectory, undefined, options);
  }

  /**
   * @description 提取配置文件到files文件对象中
   */
  async extractConfigFiles(extraConfigFiles) {
    // 将所有的配置项合并到ConfigTransforms中
    const ConfigTransforms = Object.assign(
      this.configTransforms,
      this.defaultConfigTransforms,
      this.reservedConfigTransforms,
    );

    const extra = async (key: string) => {
      if (
        ConfigTransforms[key] !== undefined &&
        this.pkg[key] !== undefined &&
        // do not extract if the field exists in original package.json
        this.originalPkg[key] === undefined
      ) {
        // this.pkg[key]存在而originalPkg[key]不存在，说明该配置文件是再执行generatorAPI之后添加到pkg中得，需要生成额外的配置文件
        // 并且再添加到this.files中后需要再pkg中删除该属性
        const value = this.pkg[key];
        const configTransform = ConfigTransforms[key];
        // 转换生成文件内容
        const res = configTransform.transform(value, this.files, this.rootDirectory);
        const { content, filename } = res;
        this.files.addToTreeByFile(
          filename,
          ensureEOL(content),
          path.resolve(this.rootDirectory, filename),
        );
        delete this.pkg[key];
        // 生成插件配置文件
        await createFiles(this.rootDirectory, {
          [filename]: ensureEOL(content),
        });
      }
    };
    if (extraConfigFiles) {
      // 用户选择In dedicated config files(true)时，为插件生成单独的配置文件
      for (const pluginName of Object.keys(this.plugins)) {
        extra(pluginName.toLowerCase());
      }
    } else {
      // 用户选择In package.json(false)时，插件配置生成在package.json中
      // always extract babel.config.js as this is the only way to apply
      extra("babel");
    }
  }

  /**
   * @description 扩展配置文件
   */
  async extendConfigFile(fileName: string, data: ConfigFileData) {
    if (!this.configTransforms[fileName]) {
      this.configTransforms[fileName] = new ConfigTransform(data);
    } else {
      // 如果已经存在该配置文件，则合并其file字段
      this.configTransforms[fileName].extend(data);
    }
  }

  /**
   * 添加或更新文件
   * @param {string} path 文件路径
   * @param {string} content 文件内容
   */
  addFile(path: string, content: string) {
    this.files[path] = content;
  }

  /**
   * @description 获取到 rootDirectory 路径
   * @returns rootDirectory 路径
   */
  getRootDirectory(): string {
    return this.rootDirectory;
  }
}

export default Generator;
