// Generator.ts
import path from "path";

import { relativePathToRoot } from "./constants";
import { createFiles } from "./createFiles";
import GeneratorAPI from "./GeneratorAPI";
import TemplateAPI from "./TemplateAPI";
import ConfigTransform from "./ConfigTransform";

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
  typescript: new ConfigTransform({
    file: {
      json: ["tsconfig.json"],
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

// 根据传入的路径，加载模块并返回
async function loadModule(modulePath: string, rootDirectory: string) {
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
  private files: Record<string, string> = {}; // 键：文件名，值：文件内容
  private rootOptions: Record<string, any> = {};
  private configTransforms: Record<string, ConfigTransform> = {};
  private defaultConfigTransforms: Record<string, ConfigTransform>;
  private reservedConfigTransforms: Record<string, ConfigTransform>;
  public pkg: object; // 执行generatorAPI之后带有key值为plugin
  public originalPkg: object; // 原始package.json
  public templateName: string; // 需要拉取的模板名称

  constructor(rootDirectory: string, plugins = {}, pkg = {}, templateName: string) {
    this.rootDirectory = rootDirectory;
    this.plugins = plugins;
    this.defaultConfigTransforms = defaultConfigTransforms;
    this.reservedConfigTransforms = reservedConfigTransforms;
    this.originalPkg = pkg;
    this.pkg = Object.assign({}, pkg);
    this.templateName = templateName;
  }

  // 单独处理一个插件相关文件
  async pluginGenerate(pluginName: string) {
    const generatorAPI = new GeneratorAPI(this);

    // pluginGenerator 是一个函数，接受一个 GeneratorAPI 实例作为参数
    let pluginGenerator: (generatorAPI: GeneratorAPI) => Promise<void>;

    // 根据环境变量加载插件
    // TODO: 改用每个 plugin 的 API 来加载
    if (process.env.NODE_ENV === "DEV") {
      const pluginPathInDev = `packages/@plugin/plugin-${pluginName.toLowerCase()}/generator/index.cjs`;
      pluginGenerator = await loadModule(
        pluginPathInDev,
        path.resolve(__dirname, relativePathToRoot),
      );
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
  // 创建所有插件的相关文件
  async generate() {
    // 优先处理ts插件
    if (Object.keys(this.plugins).includes("typescript")) {
      //设置环境变量
      process.env.isTs = "true";
      this.pluginGenerate("typescript");
      //删除typescript对应处理，防止重新处理
      const index = Object.keys(this.plugins).indexOf("typescript");
      this.plugins.splice(index, 1);
    }
    // 为每个 plugin 创建 GeneratorAPI 实例，调用插件中的 generate
    for (const pluginName of Object.keys(this.plugins)) {
      this.pluginGenerate(pluginName);
    }

    // 在文件生成之前提取配置文件
    // 整合需要安装的文件
    // 这里假设 GeneratorAPI 有一个方法来更新这个 Generator 实例的 files
    // createFiles 函数需要你根据自己的逻辑实现文件创建和写入磁盘的逻辑
    // extract configs from package.json into dedicated files.
    // 从package.json中生成额外的的文件
    await this.extractConfigFiles();

    // 重写pakcage.json文件，消除generatorAPI中拓展package.json带来得副作用
    this.files["package.json"] = JSON.stringify(this.pkg, null, 2);

    // 安装文件
    await createFiles(this.rootDirectory, this.files);
    console.log("Files have been generated and written to disk.");

    /* ----------拉取对应模板，并进行ejs渲染---------- */
    const templatePath = path.resolve(__dirname, "../../../../", `apps/${this.templateName}`);
    const templateAPI = new TemplateAPI(this);

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
    templateAPI.renderTemplates(templatePath, this.rootDirectory, options);
  }

  /**
   * @description 提取配置文件到files文件对象中
   */
  async extractConfigFiles() {
    // 将所有的配置项合并到ConfigTransforms中
    const ConfigTransforms = Object.assign(
      this.configTransforms,
      this.defaultConfigTransforms,
      this.reservedConfigTransforms,
    );

    // extra方法执行后会在this.files中添加一个属性，key为配置文件名称，值为对应的内容
    const extra = (key: string) => {
      // 校验：ConfigTransforms中存在该配置文件，且this.pkg中存在该配置文件，且originalPkg中不存在该配置文件
      if (ConfigTransforms[key] && this.pkg[key] && !this.originalPkg[key]) {
        // this.pkg[key]存在而originalPkg[key]不存在，说明该配置文件是在执行generatorAPI之后添加到pkg中的，需要生成额外的配置文件
        // 并且在添加到this.files中后需要在pkg中删除该属性
        const value = this.pkg[key];
        const configTransform = ConfigTransforms[key];
        // 转换生成文件内容
        const res = configTransform.transform(value, this.files, this.rootDirectory);
        const { content, filename } = res;
        this.files[filename] = ensureEOL(content); // 向文件对象中添加文件内容
        delete this.pkg[key];
      }
    };
    extra("babel");
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
   * 获取当前所有文件
   * @returns 当前所有文件
   */
  getFiles(): Record<string, string> {
    return this.files;
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
