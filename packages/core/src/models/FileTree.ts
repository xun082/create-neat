import path from "path";
import fs from "fs-extra";
import ejs from "ejs";
// import chalk from "chalk";

import { createFiles } from "../utils/createFiles";

interface WriteConfigIntoTemplate {
  plugin: string;
  paths: string[];
  contents: string[];
  regexps: RegExp[];
  locations: Location[];
  // 用于定义包裹结构
  wrapStructures?: string[];
}

enum Location {
  BeforeMatchStructure,
  InMatchStructure,
  AfterMatchStructureImport,
  AfterMatchStructureUse,
  WrapMatchStructure,
}

const reactRouterRegexpJSX: RegExp = /return\s*\(([\s\S]*?)\);/s;
const fileImport: RegExp = /^import.*$/gm;

const reactRouter: WriteConfigIntoTemplate = {
  plugin: "ReactRouter",
  paths: ["App.jsx", "App.jsx"],
  contents: [
    "\n<Router>%*#$</Router>\n",
    "\nimport { BrowserRouter as Router, Switch, Route } from 'react-router-dom';\n",
  ],
  regexps: [reactRouterRegexpJSX, fileImport],
  locations: [Location.WrapMatchStructure, Location.AfterMatchStructureImport],
  wrapStructures: ["return (%*#$)", ""],
};

const createAppRegex: RegExp = /const\s+app\s*=\s*createApp\s*\(\s*App\s*\)/;

const vuePinia: WriteConfigIntoTemplate = {
  plugin: "vuePinia",
  paths: ["main.js", "main.js"],
  contents: [
    "\nimport { createPinia } from 'pinia'\nconst pinia = createPinia()\n\n",
    "\n\napp.use(pinia)\n",
  ],
  regexps: [createAppRegex, createAppRegex],
  locations: [Location.BeforeMatchStructure, Location.AfterMatchStructureUse],
  wrapStructures: ["return (%*#$)", ""],
};

const plugins: WriteConfigIntoTemplate[] = [reactRouter, vuePinia];

/**
 * 判断是否为文件夹
 * @param {string} path - 路径
 * @returns {boolean} - 返回路径是否为文件夹
 */
function isDirectoryOrFile(path: string) {
  try {
    const stats = fs.statSync(path);
    return stats.isDirectory();
  } catch (err) {
    // 处理错误
    return false;
  }
}

/**
 * 文件描述接口
 * @interface
 * @property {string} fileName - 文件名
 * @property {string} fileExtension - 文件扩展名
 * @property {*} fileContent - 文件内容
 */
interface FileDescribe {
  fileName: string;
  fileExtension: string;
  fileContent: any;
}

/**
 * 文件数据接口
 * @interface
 * @property {string} path - 路径
 * @property {"dir" | "file"} [type] - 类型
 * @property {FileData[]} children - 子节点
 * @property {Partial<FileDescribe>} describe - 文件描述
 */
interface FileData {
  path: string;
  type?: "dir" | "file";
  children: FileData[];
  describe: Partial<FileDescribe>;
}

/**
 * 文件树类
 * @class
 */
class FileTree {
  private rootDirectory: string; //文件树的根目录路径
  private fileData: FileData; //文件树对象
  private alteration = { js: "ts", jsx: "tsx" }; // 扩展名转换映射

  /**
   * @constructor
   * @param {string} rootDirectory - 文件树的根目录路径
   */
  constructor(rootDirectory: string) {
    this.rootDirectory = rootDirectory;
    this.fileData = {
      path: rootDirectory,
      type: "dir",
      children: [],
      describe: { fileName: path.basename(rootDirectory) },
    };
  }

  /**
   * 根据目录构造文件数对象
   * @static
   * @param {string} src - 文件或文件夹的真实路径
   * @param {string} parentDir - 创建文件后的父文件夹路径
   * @returns {FileData} - 文件树对象
   */
  private buildFileData(src: string, parentDir?: string) {
    const baseName = path.basename(src);

    const file: FileData = {
      path: path.resolve(parentDir, baseName),
      children: [],
      describe: {},
    };
    //对目录和文件处理不同，是目录则要遍历处理children
    if (isDirectoryOrFile(src)) {
      file.type = "dir";
      file.describe.fileName = baseName;
      const entries = fs.readdirSync(src, {
        withFileTypes: true,
      });
      for (const entry of entries) {
        const subTree = this.buildFileData(
          path.join(src, entry.name),
          path.relative(parentDir, baseName),
        );
        file.children?.push(subTree);
      }
    } else {
      const fileContent = fs.readFileSync(src, "utf8");
      file.type = "file";
      file.describe = {
        fileName: path.basename(src).split(".")[0],
        fileExtension: path.extname(src).slice(1),
        fileContent,
      };
    }
    return file;
  }

  /**
   * 借助ejs构造文件树对象
   * @static
   * @param {string} src - 文件或文件夹的真实路径
   * @param {string} parentDir - 创建文件后的父文件夹路径
   * @param {string} options - ejs渲染配置参数
   * @returns {FileData} - 文件树对象
   */
  private buildFileDataByEjs(src: string, parentDir: string, options: any) {
    const baseName = path.basename(src);
    const file: FileData = {
      path: "",
      children: [],
      describe: {},
    };
    if (isDirectoryOrFile(src)) {
      file.type = "dir";
      file.path = path.resolve(parentDir, baseName);
      file.describe.fileName = baseName;
      const entries = fs.readdirSync(src, {
        withFileTypes: true,
      });
      for (const entry of entries) {
        const subTree = this.buildFileDataByEjs(
          path.join(src, entry.name),
          path.relative(parentDir, baseName),
          options,
        );
        file.children?.push(subTree);
      }
    } else {
      let fileContent = fs.readFileSync(src, "utf8");

      for (const plugin of plugins) {
        if (plugin.paths.includes(baseName)) {
          for (let i = 0; i < plugin.paths.length; i++) {
            if (plugin.paths[i] === baseName) {
              const match = fileContent.match(plugin.regexps[i]);
              if (match) {
                let replacedContent = fileContent;

                switch (plugin.locations[i]) {
                  case Location.BeforeMatchStructure:
                    replacedContent = (() => {
                      const beforeInsertIndex = match.index;
                      return (
                        fileContent.slice(0, beforeInsertIndex) +
                        plugin.contents[i] +
                        fileContent.slice(beforeInsertIndex)
                      );
                    })();
                    break;
                  case Location.AfterMatchStructureImport:
                    replacedContent = (() => {
                      const importRegex = /^import\s+.*$/gm;
                      const imports = fileContent.match(importRegex);
                      if (imports && imports.length > 0) {
                        const lastImport = imports[imports.length - 1];
                        const lastImportIndex = fileContent.lastIndexOf(lastImport);
                        const endOfLastImportIndex = lastImportIndex + lastImport.length;
                        const beforeImports = fileContent.substring(0, endOfLastImportIndex);
                        const afterImports = fileContent.substring(endOfLastImportIndex);
                        return beforeImports + plugin.contents[i] + afterImports;
                      }
                      return plugin.contents[i] + "\n" + fileContent;
                    })();
                    break;
                  case Location.AfterMatchStructureUse:
                    replacedContent = (() => {
                      const afterInsertIndex = match.index + match[0].length;
                      return (
                        fileContent.slice(0, afterInsertIndex) +
                        plugin.contents[i] +
                        fileContent.slice(afterInsertIndex)
                      );
                    })();
                    break;
                  case Location.InMatchStructure:
                    replacedContent = fileContent.replace(plugin.regexps[i], plugin.contents[i]);
                    break;
                  case Location.WrapMatchStructure:
                    if (plugin.wrapStructures && plugin.wrapStructures[i]) {
                      const wrapParts = plugin.wrapStructures[i].split("%*#$");
                      const contentParts = plugin.contents[i].split("%*#$");
                      const newContent = `${wrapParts[0]}${contentParts[0]}${match[1]}${contentParts[1]}${wrapParts[1]}`;
                      replacedContent = fileContent.replace(plugin.regexps[i], newContent);
                    }
                    break;
                  default:
                    break;
                }

                fileContent = replacedContent;
              }
            }
          }
        }
      }

      fileContent = ejs.render(fileContent, options);

      file.type = "file";
      file.describe = {
        fileName: path.basename(src).split(".")[0],
        fileExtension:
          process.env.isTs && this.alteration[path.extname(src).slice(1)]
            ? this.alteration[path.extname(src).slice(1)]
            : path.extname(src).slice(1),
        fileContent,
      };
      file.path = path.resolve(
        parentDir,
        `${file.describe.fileName}.${file.describe.fileExtension}`,
      );
    }
    return file;
  }
  /**
   * 根据template模板路径向文件树中添加节点
   * @param url 添加文件的原始的真实路径
   * @param parentDir 父文件夹路径
   */
  addToTreeByTemplateDirPath(url: string, parentDir: string) {
    if (path.basename(url) === "template") {
      const entries = fs.readdirSync(url, {
        withFileTypes: true,
      });
      for (const entry of entries) {
        const subTree = this.buildFileData(path.join(url, entry.name), parentDir);
        this.fileData.children.push(subTree);
      }
    }
  }

  /**
   * 根据template模板路径向文件树中添加节点(适用于需要ejs渲染的模板)
   * @param url 添加文件的原始的真实路径
   * @param parentDir 父文件夹路径
   */
  addToTreeByTemplateDirPathAndEjs(url: string, parentDir: string, options: any) {
    if (path.basename(url) === "template") {
      const entries = fs.readdirSync(url, {
        withFileTypes: true,
      });
      for (const entry of entries) {
        const subTree = this.buildFileDataByEjs(path.join(url, entry.name), parentDir, options);
        this.fileData.children.push(subTree);
      }
    }
  }

  /**
   * 根据文件内容以及名称将文件添加到创建的根目录中(只适用于将文件添加到创建的根目录)
   * @param {string} fullFileName - 添加的文件名(包含文件后缀)
   * @param {string} fileContent - 添加的文件的内容
   */
  addToTreeByFile(fullFileName: string, fileContent: string) {
    const fullPath = path.resolve(this.rootDirectory, fullFileName);
    const fileNameSplit = fullFileName.split(".");
    let fileName; // 文件名称(不包含文件后缀)
    if (fileNameSplit.length <= 2) {
      fileName = fileNameSplit[0];
    } else {
      fileName = fileNameSplit.slice(0, -1).join(".");
    }
    // 全文件名.分割的最后一位作为拓展名(babel.config.js、.browserslistrc、.eslintrc.js等等)
    const fileExtension = fileNameSplit[fileNameSplit.length - 1];
    this.fileData.children.push({
      path: fullPath,
      children: [],
      type: "file",
      describe: { fileName, fileContent, fileExtension },
    });
  }
  /**
   * 统一渲染所有文件
   */
  async renderAllFiles(parentDir: string, fileData: FileData = this.fileData) {
    // 渲染根fileTree对象中的children中的内容 --> 根目录内的文件
    for (const item of fileData.children) {
      if (item.type === "dir") {
        const filePath = path.resolve(parentDir, item.describe.fileName);
        // 创建文件夹
        !fs.existsSync(filePath) && fs.mkdirSync(filePath);
        // 如果是文件夹类型则递归生成
        const dirName = path.resolve(parentDir, item.describe.fileName);
        await this.renderAllFiles(dirName, item);
      } else {
        // 如果是文件类型直接生成
        const fileName = `${item.describe.fileName}.${item.describe.fileExtension}`;
        const fileContent = item.describe.fileContent;
        await createFiles(parentDir, {
          [fileName]: fileContent,
        });
      }
    }
  }
}
export default FileTree;
