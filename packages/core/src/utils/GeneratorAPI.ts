// import fs from 'fs'

/**
 * @description 为执行插件 generator 提供系一列 api
 * @param plugin 插件名
 * @param generator 生成器实例
 * @param options 传入的生成器选项
 * @param rootOptions 根目录执行选项
 */

class GeneratorAPI {
  private plugin: string;
  private generator: Generator;
  private options: object;
  private rootOptions: object;

  constructor(plugin, generator, options, rootOptions) {
    this.plugin = plugin;
    this.generator = generator;
    this.options = options;
    this.rootOptions = rootOptions;
  }

  /**
   * @description 扩展项目的 package.json 内容
   * @param fields 合并内容
   * @param {object} [options] 操作选项
   */
  extendPackage(fields, options = {}) {
    console.log(fields, options);
  }

  /**
   * @description 将生成器的模板文件渲染到虚拟文件树对象中。
   * @param {string | object | FileMiddleware} source - 可以是以下之一：
   *   - 相对路径到一个目录；
   *   - { sourceTemplate: targetFile } 映射的对象哈希；
   *   - 自定义文件中间件函数。
   * @param {object} [additionalData] - 可供模板使用的额外数据。
   * @param {object} [ejsOptions] - ejs 的选项。
   */
  render(source, additionalData = {}, ejsOptions = {}) {
    console.log(source, additionalData, ejsOptions);
  }
}

export default GeneratorAPI;
