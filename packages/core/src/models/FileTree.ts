import path from "path";
import fs from "fs-extra";
import ejs from "ejs";
import chalk from "chalk";

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
    this.fileData = FileTree.buildFileData(this.rootDirectory);

    //如果有 ts 插件则更改相关文件后缀
    process.env.isTs && this.changeFileExtensionToTs();
  }

  /**
   * 根据目录构造文件数对象
   * @static
   * @param {string} src - 文件树根路径
   * @returns {FileData} - 文件树对象
   */
  static buildFileData(src: string) {
    const file: FileData = {
      path: src,
      children: [],
      describe: { fileName: path.basename(src) },
    };
    //对目录和文件处理不同，是目录则要遍历处理children
    if (isDirectoryOrFile(src)) {
      file.type = "dir";
      const entries = fs.readdirSync(src, {
        withFileTypes: true,
      });
      for (const entry of entries) {
        const subTree = this.buildFileData(path.join(src, entry.name));
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
    await fs.writeFile(src, rendered);
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
   * 添加的文件最后渲染也是在根目录
   * @param {string} fileName - 添加的文件名
   * @param {string} fileContent - 添加的文件内容
   * @param {string} [path=""] - 添加的文件的路径
   */
  addToTreeByFile(fileName: string, fileContent: string, path: string = "") {
    const fileNameSplit = fileName.split(".");
    // 文件名.分割的最后一位作为拓展名(babel.config.js、.browserslistrc、.eslintrc.js等等)
    const fileExtension = fileNameSplit[fileNameSplit.length - 1] || "";
    this.fileData.children.push({
      path,
      children: [],
      type: "file",
      describe: { fileName, fileContent, fileExtension },
    });
  }
}
export default FileTree;
