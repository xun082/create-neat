// Generator.ts
import path from "path";

import { createFiles } from "./createFiles";
import GeneratorAPI from "./GeneratorAPI";
import ConfigTransform from "./ConfigTransform";

/**
 * @description 为文件内容添加换行符
 * @param str 文件内容
 * @returns 末尾添加换行符后得文件内容
 */
const ensureEOL = (str) => {
  if (str.charAt(str.length - 1) !== "\n") {
    return str + "\n";
  }
  return str;
};

// 插件对应的配置文件
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
  eslintConfig: new ConfigTransform({
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
};

// vue项目对应的配置文件
const reservedConfigTransforms = {
  vue: new ConfigTransform({
    file: {
      js: ["vue.config.js"],
    },
  }),
};

async function loadModule(modulePath, rootDirectory) {
  const resolvedPath = path.resolve(rootDirectory, "../../", modulePath);
  try {
    // 尝试加载模块
    const module = await require(resolvedPath);
    return module;
  } catch (error) {
    // 处理加载模块失败的情况
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
  private files: Record<string, string> = {};
  private rootOptions: Record<string, any> = {};
  private configTransforms: Record<string, ConfigTransform> = {};
  private defaultConfigTransforms;
  private reservedConfigTransforms;
  public pkg; // 执行generatorAPI之后带有key值为plugin
  public originalPkg; // 原始package.json

  constructor(rootDirectory: string, plugins = {}, pkg = {}) {
    this.rootDirectory = rootDirectory;
    this.plugins = plugins;
    this.defaultConfigTransforms = defaultConfigTransforms;
    this.reservedConfigTransforms = reservedConfigTransforms;
    this.originalPkg = pkg;
    this.pkg = Object.assign({}, pkg);
  }

  // 创建所有插件的相关文件
  async generate() {
    // 为每个 plugin 创建 GeneratorAPI 实例，调用插件中的 generate
    for (const pluginName of Object.keys(this.plugins)) {
      const generatorAPI = new GeneratorAPI(
        pluginName,
        this,
        this.plugins[pluginName],
        this.rootOptions,
      );

      // pluginGenerator 是一个函数，接受一个 GeneratorAPI 实例作为参数
      let pluginGenerator;
      if (process.env.NODE_ENV === "DEV") {
        const pluginPathInDev = `packages/@plugin/plugin-${pluginName.toLowerCase()}/generator/index.cjs`;
        pluginGenerator = await loadModule(pluginPathInDev, process.cwd());
      } else if (process.env.NODE_ENV === "PROD") {
        const pluginPathInProd = `node_modules/${pluginName.toLowerCase()}-plugin-test-ljq`;
        pluginGenerator = await loadModule(pluginPathInProd, this.rootDirectory);
      } else {
        throw new Error("NODE_ENV is not set");
      }
      if (pluginGenerator && typeof pluginGenerator === "function") {
        await pluginGenerator(generatorAPI);
      }
    }

    // 在文件生成之前提取配置文件
    // 整合需要安装的文件
    // 这里假设 GeneratorAPI 有一个方法来更新这个 Generator 实例的 files
    // createFiles 函数需要你根据自己的逻辑实现文件创建和写入磁盘的逻辑
    // extract configs from package.json into dedicated files.
    // 从package.json中生成额外得的文件
    await this.extractConfigFiles();

    // 重写pakcage.json文件，消除generatorAPI中拓展package.json带来得副作用
    this.files["package.json"] = JSON.stringify(this.pkg, null, 2);

    // 安装文件
    await createFiles(this.rootDirectory, this.files);
    console.log("Files have been generated and written to disk.");
  }

  /**
   * @description 提取配置文件
   */
  async extractConfigFiles() {
    const ConfigTransforms = Object.assign(
      this.configTransforms,
      this.defaultConfigTransforms,
      this.reservedConfigTransforms,
    );
    // extra方法执行后会再this.files中添加一个属性，key为配置文件名称，值为对应得内容
    const extra = (key: string) => {
      if (
        ConfigTransforms[key] &&
        this.pkg[key] &&
        // do not extract if the field exists in original package.json
        !this.originalPkg[key]
      ) {
        // this.pkg[key]存在而originalPkg[key]不存在，说明该配置文件是再执行generatorAPI之后添加到pkg中得，需要生成额外的配置文件
        // 并且再添加到this.files中后需要再pkg中删除该属性
        const value = this.pkg[key];

        const configTransform = ConfigTransforms[key];
        // 转换生成文件内容
        const res = configTransform.thransform(value, this.files, this.rootDirectory);
        const { content, filename } = res;
        this.files[filename] = ensureEOL(content);
        delete this.pkg[key];
      }
    };

    extra("babel");
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
   * 获取当前所有文件
   * @returns 当前所有文件
   */
  getFiles(): Record<string, string> {
    return this.files;
  }

  // 获取到 rootDirectory 路径
  getRootDirectory(): string {
    return this.rootDirectory;
  }
}

export default Generator;
