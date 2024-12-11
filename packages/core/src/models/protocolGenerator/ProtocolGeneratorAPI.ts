import fs from "fs";
import path from "path";

import { ProtocolProps } from "../BaseAPI";
import { getTargetFileData } from "../../utils/commonUtils";
import { exportDefaultDeclarationUtils } from "../../utils/ast/commonAst";
import { transformCode } from "../../utils/ast/utils";

/**
 * 通用类，为 插件/框架/构建工具 之间的影响定义协议处理器
 * @param protocols 协议内容
 */
class ProtocolGeneratorAPI {
  protected protocols: Record<string, object>; // todo 类型考虑优化
  protected props: ProtocolProps;
  protected protocol: any;

  constructor(protocols, props, protocol) {
    this.protocols = protocols;
    this.props = props;
    this.protocol = protocol;
  }

  generator() {
    // todo: 加入优先级调度
    const protocol = this.protocol;
    const protocols = this.protocols;
    this[protocol](protocols[protocol]);
  }

  ENTRY_FILE(params) {
    // todo: 路径可能存在问题
    const srcDir = path.resolve(__dirname, "src"); // src 目录路径
    const content = params.content;

    // 处理入口文件
    if (content) {
      const entryFilePath = path.join(srcDir, "index.js"); // 假设入口文件为 index.js
      let entryContent = fs.readFileSync(entryFilePath, "utf-8");

      entryContent += content;

      // 文件重写，实现插入
      // todo: 具体如何实现，其实很灵活，甚至可以借助 AST 进行
      fs.writeFileSync(entryFilePath, entryContent, "utf-8");
    }
  }

  /**
   * 更新目标文件导出内容协议，根据给定的文件路径和新的导出内容更新文件数据。
   *
   * @param {Object} params 包含文件路径和新的导出内容的参数对象。
   * @param {string} params.url 目标文件的路径。
   * @param {string} params.exportContent 要更新的导出内容。
   * @param {string} params.parserOptions ast的解析器
   */
  UPDATE_EXPORT_CONTENT_PROTOCOL({ params }) {
    const { url, exportContent, parserOptions } = params;
    const rootFileTree = this.props.files.getFileData();
    const fileData = getTargetFileData(rootFileTree, url);
    const fileContent = fileData.describe.fileContent;
    const operations = {
      ExportDefaultDeclaration(path, t) {
        const content = exportContent;
        exportDefaultDeclarationUtils(path, t, content);
      },
    };
    // const parserOptions = { sourceType: "module", plugins: ["jsx"] };
    fileData.describe.fileContent = transformCode(fileContent, operations, parserOptions);
  }
}

export default ProtocolGeneratorAPI;
