import BaseAPI from "./BaseAPI";
import Generator from "./Generator";

/**
 * 为 Generator 类提供辅助功能，用于操纵模板数据、管理依赖和配置
 * @param generator Generator实例
 */

class TemplateAPI extends BaseAPI {
  constructor(generator: Generator) {
    super(generator);
  }
}

export default TemplateAPI;
