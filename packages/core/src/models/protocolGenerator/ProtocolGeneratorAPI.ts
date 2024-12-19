import fs from "fs";
import path from "path";

import { ProtocolProps } from "../BaseAPI";
import { Protocol } from "../../types/protocol";

/**
 * 通用类，为 插件/框架/构建工具 之间的影响定义协议处理器
 * @param protocols 协议内容
 */
class ProtocolGeneratorAPI {
  protected protocols: Record<string, object>; // todo 类型考虑优化
  protected props: ProtocolProps;
  protected protocol: Protocol;

  constructor(protocols, props, protocol) {
    this.protocols = protocols;
    this.props = props;
    this.protocol = protocol;
  }

  generator() {
    // todo: 加入优先级调度
    for (const protocol in this.protocols) {
      this[protocol](this.protocols[protocol]);
    }
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
}

export default ProtocolGeneratorAPI;
