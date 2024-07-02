import Generator from "./Generator";
import BaseAPI from "./BaseAPI";

/**
 * 为执行 generator 提供系一列 api
 * @param plugin 插件名
 * @param generator 生成器实例
 * @param options 传入的生成器选项
 * @param rootOptions 根目录执行选项
 */

class GeneratorAPI extends BaseAPI {
  constructor(generator: Generator) {
    super(generator);
  }
}

export default GeneratorAPI;
