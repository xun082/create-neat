import path from "path";

import ProtocolGeneratorAPI from "./ProtocolGeneratorAPI";
import FileTree, { FileData } from "../FileTree";
import { Preset } from "../../utils/preset";
import { ProtocolProps } from "../BaseAPI";

// 定义 Location 枚举，用于指定插件内容插入的位置
/**
 * 插入位置
 * @enum
 * @property {number} BeforeMatchStructure - 在匹配结构之前
 * @property {number} InMatchStructure - 在匹配结构中
 * @property {number} AfterMatchStructureImport - 在匹配结构导入之后
 * @property {number} AfterMatchStructureUse - 在匹配结构使用之后
 * @property {number} WrapMatchStructure - 包裹匹配结构
 */
enum Location {
  BeforeMatchStructure,
  InMatchStructure,
  AfterMatchStructureImport,
  AfterMatchStructureUse,
  WrapMatchStructure,
}

// 定义 WriteConfigIntoTemplate 接口，描述插件的配置
/**
 * 写入模板配置
 * @interface
 * @param {string} plugin - 插件名称
 * @param {string[]} paths - 需要处理的文件路径
 * @param {string[]} contents - 插入的内容
 * @param {RegExp[]} regexps - 匹配的正则表达式
 * @param {Location[]} locations - 插入的位置
 * @param {string[]} wrapStructures - 包裹结构
 */
interface WriteConfigIntoTemplate {
  plugin: string;
  paths: string[];
  contents: string[];
  regexps: RegExp[];
  locations: Location[];
  wrapStructures?: string[];
}

/**
 * 样式插件参数
 * @interface
 * @param {Preset} preset - 用户预设
 * @param {FileTree} files - 文件树，包含了基础的 src 目录
 * @param {Record<'content', string>} params - 传入的 content，适用于一些需要添加字段的特殊情况。
 */

/**
 * 插件影响框架的协议处理器
 * @param protocols 协议内容
 */
class PluginToTemplateAPI extends ProtocolGeneratorAPI {
  // 存储插件配置
  private plugins: WriteConfigIntoTemplate[] = [];
  // 匹配 JSX 结构
  private reactRouterRegexpJSX: RegExp = /return\s*\(([\s\S]*?)\);/s;
  // 匹配 import 语句
  private fileImport: RegExp = /^import.*$/gm;
  // 匹配 createApp 语句
  private createAppRegex: RegExp = /const\s+app\s*=\s*createApp\s*\(\s*App\s*\)/;

  private StyleReg: { [key: string]: RegExp } = {
    css: /css$/i,
    scss: /scss$/i, // 匹配以 .scss 结尾的文件
    less: /less$/i, // 匹配以 .less 结尾的文件
  };

  constructor(protocols, props) {
    super(protocols);
    this.protocols = protocols;
    this.props = props;
    this.initializePlugins();
  }

  // 初始化插件配置
  private initializePlugins() {
    const reactRouter: WriteConfigIntoTemplate = {
      plugin: "ReactRouter",
      paths: ["App.jsx", "App.jsx"],
      contents: [
        "\n<Router>%*#$</Router>\n",
        "\nimport { BrowserRouter as Router, Switch, Route } from 'react-router-dom';\n",
      ],
      regexps: [this.reactRouterRegexpJSX, this.fileImport],
      locations: [Location.WrapMatchStructure, Location.AfterMatchStructureImport],
      wrapStructures: ["return (%*#$)", ""],
    };

    const vuePinia: WriteConfigIntoTemplate = {
      plugin: "vuePinia",
      paths: ["main.js", "main.js"],
      contents: [
        "\nimport { createPinia } from 'pinia'\nconst pinia = createPinia()\n\n",
        "\n\napp.use(pinia)\n",
      ],
      regexps: [this.createAppRegex, this.createAppRegex],
      locations: [Location.BeforeMatchStructure, Location.AfterMatchStructureUse],
      wrapStructures: ["return (%*#$)", ""],
    };

    this.plugins = [reactRouter, vuePinia];
  }

  // 处理文件内容
  processFileContent(fileName: string, content: string): string {
    let processedContent = content;

    for (const plugin of this.plugins) {
      if (plugin.paths.includes(fileName)) {
        for (let i = 0; i < plugin.paths.length; i++) {
          if (plugin.paths[i] === fileName) {
            processedContent = this.applyPluginTransformation(processedContent, plugin, i);
          }
        }
      }
    }

    return processedContent;
  }
  /**
   * 样式类插件协议
   * @param params
   */
  PROCESS_STYLE_PLUGIN() {
    const { template, plugins } = this.props.preset;
    const fileData: FileData = this.props.files.getFileData();
    try {
      for (const plugin in plugins) {
        if (plugins.hasOwnProperty(plugin) && plugin === "sass") {
          this.processStyleFiles("scss", fileData, this.processSass);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  // 应用插件转换
  private applyPluginTransformation(
    content: string,
    plugin: WriteConfigIntoTemplate,
    index: number,
  ): string {
    const match = content.match(plugin.regexps[index]);
    if (!match) return content;

    let result = content;

    switch (plugin.locations[index]) {
      case Location.BeforeMatchStructure:
        result = this.insertBefore(content, match.index!, plugin.contents[index]);
        break;
      case Location.AfterMatchStructureImport:
        result = this.insertAfterLastImport(content, plugin.contents[index]);
        break;
      case Location.AfterMatchStructureUse:
        result = this.insertAfter(content, match.index! + match[0].length, plugin.contents[index]);
        break;
      case Location.WrapMatchStructure:
        if (plugin.wrapStructures && plugin.wrapStructures[index]) {
          result = this.wrapContent(
            content,
            match,
            plugin.contents[index],
            plugin.wrapStructures[index],
          );
        }
        break;
      default:
        break;
    }

    return result;
  }

  // 在指定位置之前插入内容
  private insertBefore(content: string, index: number, insertion: string): string {
    return content.slice(0, index) + insertion + content.slice(index);
  }

  // 在指定位置之后插入内容
  private insertAfter(content: string, index: number, insertion: string): string {
    return content.slice(0, index) + insertion + content.slice(index);
  }

  // 在最后一个 import 语句之后插入内容
  private insertAfterLastImport(content: string, insertion: string): string {
    const importRegex = /^import\s+.*$/gm;
    const imports = content.match(importRegex);
    if (imports && imports.length > 0) {
      const lastImport = imports[imports.length - 1];
      const lastImportIndex = content.lastIndexOf(lastImport);
      const endOfLastImportIndex = lastImportIndex + lastImport.length;
      return (
        content.substring(0, endOfLastImportIndex) +
        insertion +
        content.substring(endOfLastImportIndex)
      );
    }
    return insertion + "\n" + content;
  }

  // 包裹匹配的内容
  private wrapContent(
    content: string,
    match: RegExpMatchArray,
    wrapper: string,
    structure: string,
  ): string {
    const matchedContent = match[1] || match[0];
    const wrappedContent = wrapper.replace("%*#$", matchedContent);
    return (
      content.slice(0, match.index) +
      structure.replace("%*#$", wrappedContent) +
      content.slice(match.index! + match[0].length)
    );
  }

  // 处理 sass 的回调函数，这里传入props 的原因是因为回调函数无法找到 API 的 this。
  private processSass(fileData: FileData, props: ProtocolProps): FileData {
    const template = props.preset.template;
    for (let i = 0; i < fileData.children.length; i++) {
      const dirName = path.basename(fileData.children[i].path);
      if (dirName === "src") {
        if (template === "vue") {
          const vueData = fileData.children[i].children[0].describe;
          vueData.fileContent = vueData.fileContent.replace(
            `</script>\n\n<style scoped>\n@import "./index.css";\n</style>\n`,
            `</script>\n\n<style scoped lang="scss">\n@import "./index.scss";\n</style>\n`,
          );
        } else if (template === "react") {
          const reactData = fileData.children[i].children[0].describe;
          reactData.fileContent = reactData.fileContent.replace(
            `import "./index.css"`,
            `import "./index.scss"`,
          );
        }
      }
    }
    return fileData;
  }

  private processStyleFiles(
    protocolName: string,
    fileData: FileData,
    contentCallback: (fileContent: FileData, props: ProtocolProps) => FileData,
  ): FileData {
    const regexps = this.StyleReg["CSS"];
    for (let i = 0; i < fileData.children.length; i++) {
      // 先寻找 src 文件夹
      const dirName = path.basename(fileData.children[i].path);
      if (dirName === "src") {
        const srcFileData = fileData.children[i];
        for (let j = 0; j < srcFileData.children.length; j++) {
          const dirName = path.basename(srcFileData.children[j].path);
          const extension = dirName.split(".").pop();
          if (regexps.test(extension)) {
            const child = fileData.children[i].children[j];
            const fileDescribe = child.describe;
            // 更新文件扩展名和路径
            if (child.path && child.path.endsWith(`.${fileDescribe.fileExtension}`)) {
              child.describe.fileExtension = protocolName;
              child.path = child.path.replace(child.path.match(regexps)[0], `.${protocolName}`);
            }
            // 文件内容由回调函数处理
            if (fileDescribe && typeof fileDescribe.fileContent === "string") {
              fileData = contentCallback(fileData, this.props);
            }
          }
        }
      }
    }

    return fileData;
  }
}

export default PluginToTemplateAPI;
