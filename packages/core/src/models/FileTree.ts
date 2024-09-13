import path from "path";
import fs from "fs-extra";
import ejs from "ejs";
import chalk from "chalk";

import { createFiles } from "../utils/createFiles";

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
    //初始化文件树对象
    // this.fileData = FileTree.buildFileData(this.rootDirectory);

    //如果有 ts 插件则更改相关文件后缀
    // process.env.isTs && this.changeFileExtensionToTs();
  }

  /**
   * 根据目录构造文件数对象
   * @static
   * @param {string} src - 文件或文件夹的真实路径
   * @param {string} parentDir - 创建文件后的父文件夹路径(根目录下的路径)
   * @returns {FileData} - 文件树对象
   */
  static buildFileData(src: string, parentDir?: string) {
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
   *
   * @param src
   * @param options
   * @param parentDir
   * @returns
   */
  buildFileDataByEjs(src: string, parentDir: string, options: any) {
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
      const ejsTempalte = fs.readFileSync(src, "utf8");
      const fileContent = ejs.render(ejsTempalte, options);
      file.type = "file";
      file.describe = {
        fileName: path.basename(src).split(".")[0],
        fileExtension: process.env.isTs
          ? this.alteration[path.extname(src).slice(1)]
            ? this.alteration[path.extname(src).slice(1)]
            : path.extname(src).slice(1)
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
   * 遍历树的一个方法，对每个fileData对象做一次handleFn处理
   * @param {FileData} file - 文件数对象
   * @param {(file: FileData) => any} handleFn - 处理文件树对象的函数
   */
  traverseTree(file: FileData, handleFn: (file: FileData, getFileByName?: any) => any) {
    handleFn(file);
    if (file.children.length) {
      file.children.forEach((subFile) => this.traverseTree(subFile, handleFn));
    }
  }

  /**
   * 根据文件名返回fileData数组
   * @param name 文件名
   * @returns 匹配文件名的fileData数组
   */
  getFileByName(name: string) {
    let result: FileData[];
    this.traverseTree(this.fileData, (file) => {
      if (file.describe.fileName === name) {
        result.push(file);
      }
    });
    return result;
  }

  /**
   * 传递中间件数组，对文件树对象内容进行逐步修改
   * @param middleware - 中间件函数，提供参数 根file对象,pkg：package.json，getFileByName:根据文件名获取文件
   * @param isTraverse - 是否对每个file对象都使用middleware函数
   */
  changeFileMiddleware(
    middleware: (file: FileData, getFileByName?: (name: string) => any) => any,
    isTraverse: boolean = false,
  ) {
    if (isTraverse) {
      this.traverseTree(this.fileData, middleware);
    } else {
      middleware(this.fileData, this.getFileByName);
    }
  }

  /**
   * 使用中间件将文件后缀从js,jsx更改为ts,tsx
   */
  changeFileExtensionToTs() {
    const alteration = { js: "ts", jsx: "tsx" };
    const keys = Object.keys(alteration);
    function handleExt(file: FileData) {
      if (file.type === "file") {
        const key = file.describe.fileExtension;
        if (keys.includes(key)) {
          file.describe.fileExtension = alteration[key];
        }
      }
    }
    this.changeFileMiddleware(handleExt, true);
  }

  /**
   * 将单个文件树（type==='file'）通过ejs渲染成文件，只渲染文件
   * @async
   * @param {string} src - 目标文件路径
   * @param {FileData} file - 文件树对象
   * @param {*} options - ejs对应的options参数
   */
  async fileRender(src: string, file: FileData, options: any) {
    const rendered = ejs.render(file.describe?.fileContent, options, {});
    await fs.writeFile(src, rendered, { flag: "w" });
  }

  /**
   * 将文件树渲染到指定目录下形成文件
   * @async
   * @param {string} dest - 目标目录路径
   * @param {FileData} [file=this.fileData] - 文件树对象
   * @param {*} [options={}] - ejs对应的Options参数
   */
  async renderTemplates(dest: string, file: FileData = this.fileData, options: any = {}) {
    await fs.ensureDir(dest);
    const promises = file.children.map(async (subFile) => {
      const destPath = path.join(
        dest,
        `${subFile.describe.fileName!}${subFile.type === "file" ? "." + subFile.describe.fileExtension : ""}`,
      );
      if (subFile.type === "dir" && subFile.describe) {
        return this.renderTemplates(destPath, subFile, options);
      } else {
        return this.fileRender(destPath, subFile, options);
      }
    });
    try {
      await Promise.all(promises);
    } catch (err) {
      console.error(chalk.red(`渲染文件失败 ${err}`));
    }
  }

  /**
   * 根据路径向文件树中添加节点，注意只在对应的根目录下添加
   * @param {string} path - 添加文件的路径
   */
  addToTreeByPath(path: string) {
    this.fileData.children.push(FileTree.buildFileData(path));
    //如果有 ts 插件则更改相关文件后缀
    process.env.isTs && this.changeFileExtensionToTs();
  }

  /**
   * 根据template模板路径向文件树中添加节点
   * @param url 添加文件的原始的真实路径
   */
  addToTreeByTemplateDirPath(url: string, parentDir: string) {
    if (path.basename(url) === "template") {
      const entries = fs.readdirSync(url, {
        withFileTypes: true,
      });
      for (const entry of entries) {
        const subTree = FileTree.buildFileData(path.join(url, entry.name), parentDir);
        this.fileData.children.push(subTree);
      }
    }
  }

  addToTreeByTempalteDirPathAndEjs(url: string, parentDir: string, options: any) {
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
   * 添加的文件最后渲染也是在根目录
   * @param {string} fullFileName - 添加的文件名(包含文件后缀)
   * @param {string} fileContent - 添加的文件内容
   * @param {string} [path=""] - 添加的文件的路径
   */
  addToTreeByFile(fullFileName: string, fileContent: string, path: string = "") {
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
      path,
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
    fileData.children.forEach(async (item: FileData) => {
      if (item.type === "dir") {
        // 创建文件夹
        fs.mkdirSync(path.resolve(parentDir, item.describe.fileName));
        // 如果是文件夹类型则递归生成
        const dirName = path.resolve(parentDir, item.describe.fileName);
        this.renderAllFiles(dirName, item);
      } else {
        // 如果是文件类型直接生成
        const fileName = `${item.describe.fileName}.${item.describe.fileExtension}`;
        const fileContent = item.describe.fileContent;
        await createFiles(parentDir, {
          [fileName]: JSON.stringify(fileContent, null, 2),
        });
      }
    });
  }
}
export default FileTree;
