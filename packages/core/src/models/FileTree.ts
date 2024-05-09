import path from "path";
import fs from "fs-extra";
import ejs from "ejs";
/**
 *
 * @param path 路径
 * @returns 返回路径是否为文件夹
 * @description 判断是否为文件夹
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
interface FileDescribe {
  fileName: string;
  fileExtension: string;
  fileContent: any;
}
interface FileData {
  path: string;
  type?: "dir" | "file";
  children: FileData[];
  describe: Partial<FileDescribe>;
}
/**
 * @description 文件树类，可以根据路径生成文件树对象，根据文件树对象创建template文件，修改文件对象后缀属性
 */
class FileTree {
  private rootDirectory: string; //文件树的根目录路径
  private FileData: FileData; //文件树对象
  constructor(rootDirectory: string) {
    (this.rootDirectory = rootDirectory),
      (this.FileData = {
        path: rootDirectory,
        type: "dir",
        children: [],
        describe: { fileName: path.basename(rootDirectory) },
      });
    //初始化文件树对象
    this.FileData = FileTree.buildFileData(this.rootDirectory);
    //根据process.env.isTs更改后缀
    process.env.isTs && this.changeFileExtensionToTs();
  }
  /**
   *
   * @param src 文件树根路径
   * @returns 文件树对象
   * @description 根据目录构造文件数对象
   */
  static buildFileData(src: string) {
    const file: FileData = {
      path: src,
      children: [],
      describe: { fileName: path.basename(src) },
    };
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
   *
   * @param file 文件数对象
   * @param handleFn 处理文件树对象的函数
   * @description  遍历树的一个方法，对每个fileData对象做一次handleFn处理
   */
  traverseTree(file: FileData, handleFn: (file: FileData) => any) {
    handleFn(file);
    if (file.children.length) {
      file.children.forEach((subFile) => this.traverseTree(subFile, handleFn));
    }
  }
  /**
   * @description 根据process.env.isTs来更改文件数对象的后缀属性
   */
  changeFileExtensionToTs() {
    //更改后缀的处理函数
    function handleExt(file: FileData) {
      if (file.type === "file") {
        switch (file.describe?.fileExtension) {
          case "js":
            file.describe.fileExtension = "ts";
            break;
          case "jsx":
            file.describe.fileExtension = "tsx";
            break;
          default:
            break;
        }
      }
    }
    this.traverseTree(this.FileData, handleExt);
  }

  /**
   *
   * @param src 目标文件路径
   * @param file 文件树对象
   * @param options ejs对应的options参数
   * @description 将单个文件树（type==='file'）通过ejs渲染成文件，只渲染文件
   */
  async fileRender(src: string, file: FileData, options: any) {
    const rendered = ejs.render(file.describe?.fileContent, options, {});
    await fs.writeFile(src, rendered);
  }

  /**
   *
   * @param dest 目标目录路径
   * @param file 文件树对象
   * @param options ejs对应的Options参数
   * @description 将文件树渲染到指定目录下形成文件
   */
  async renderTemplates(dest: string, file: FileData = this.FileData, options: any = {}) {
    // 确保目标目录存在
    await fs.ensureDir(dest);
    for (const subFile of file.children) {
      const destPath = path.join(
        dest,
        `${subFile.describe.fileName!}${subFile.type === "file" ? "." + subFile.describe.fileExtension : ""}`,
      );
      if (subFile.type === "dir" && subFile.describe) {
        await this.renderTemplates(destPath, subFile, {});
      } else {
        await this.fileRender(destPath, subFile, options);
      }
    }
  }
  /**
   *
   * @param path 添加文件的路径
   * @description 根据路径向文件树中添加节点，注意只在对应的根目录下添加
   */
  addToTreeByPath(path: string) {
    this.FileData.children.push(FileTree.buildFileData(path));
    //根据process.env.isTs更改后缀
    process.env.isTs && this.changeFileExtensionToTs();
  }
  /**
   *
   * @param fileName 添加的文件名
   * @param fileContent 添加的文件内容
   * @param path 添加的文件的路径
   * @description 添加的文件最后渲染也是在根目录
   */
  addToTreeByFile(fileName: string, fileContent: string, path: string = "") {
    this.FileData.children.push({
      path,
      children: [],
      type: "file",
      describe: { fileName, fileContent, fileExtension: fileName.split(".")[1] || "" },
    });
  }
}
export default FileTree;
