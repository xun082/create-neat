import { ProtocolProps } from "../BaseAPI";

import ProtocolGeneratorAPI from "./ProtocolGeneratorAPI";

/**
 * 插件影响框架的协议处理器
 * @param protocols 协议内容
 */
class GlobalProtocolAPI extends ProtocolGeneratorAPI {
  constructor(protocols: Record<string, object>, props: ProtocolProps) {
    super(protocols, props);
  }

  PROCESS_EXPORT_PROTOCOL(params) {
    console.log(params);
  }
}

export default GlobalProtocolAPI;
