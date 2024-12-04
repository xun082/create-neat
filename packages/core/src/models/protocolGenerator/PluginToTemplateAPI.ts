import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import generator from "@babel/generator";

import { FileData } from "../FileTree";
import { createImportDeclaration } from "../../utils/ast/commonAst";
import { getTargetFileData } from "../../utils/commonUtils";

import ProtocolGeneratorAPI from "./ProtocolGeneratorAPI";

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
  constructor(protocols = {}, props = {}, protocol = {}) {
    super(protocols, props, protocol);
  }

  /**
   * 样式类插件协议
   * @param params
   */
  PROCESS_STYLE_PLUGIN(params) {
    const content = params.params.content;
    const plugins = this.props.preset.plugins;
    const template = this.props.preset.template;
    const fileData: FileData = this.props.files.getFileData();
    try {
      for (const plugin in plugins) {
        if (plugin === "scss") {
          content.processStyleFiles("scss", fileData, template, content.processScss);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * 处理 Import 语句的插入
   * @param params - 导入配置参数
   * @param params.imports - 导入配置数组
   * @param params.imports[].dir - 目标文件路径
   * @param params.imports[].name - 导入的模块名称
   * @param params.imports[].from - 导入的模块路径
   */
  INSERT_IMPORT(params) {
    const fileData: FileData = this.props.files.getFileData();
    if (params?.params?.imports?.length) {
      const imports = params.params.imports;

      for (const importConfig of imports) {
        const targetFile = getTargetFileData(fileData, importConfig.dir);
        if (targetFile?.describe?.fileContent) {
          const content = targetFile.describe.fileContent;

          // 解析代码为 AST
          const ast = parse(content, {
            sourceType: "module",
            plugins: ["typescript", "jsx"],
          });

          // 查找最后一个 import 语句的位置
          let lastImportIndex = 0;
          traverse(ast, {
            ImportDeclaration(path) {
              const endLine = path.node.loc?.end?.line ?? 0;
              lastImportIndex = Math.max(lastImportIndex, endLine);
            },
          });

          // 创建新的导入语句 AST
          const newImportAst = createImportDeclaration(importConfig.name, importConfig.from);

          // 在最后一个 import 后插入新的 Import 语句
          traverse(ast, {
            Program(path) {
              path.node.body.splice(lastImportIndex, 0, newImportAst);
            },
          });

          // 生成新内容
          const newContent = generator(ast).code;
          targetFile.describe.fileContent = newContent;
        }
      }
    }
  }
}

export default PluginToTemplateAPI;
