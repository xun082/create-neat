import path from "path";

import { createConfigByParseAst } from "../../utils/ast/parseAst";
import { relativePathToRoot } from "../../utils/constants";
import { Preset } from "../../utils/preset";

import ProtocolGeneratorAPI from "./ProtocolGeneratorAPI";

/**
 * ADD_CONFIG传入参数
 * @property {string} content - 特殊插件 content
 * @property {Preset} perset - 用户选项配置
 * @property {any} buildToolConfigAst - 构建工具 AST
 */
<<<<<<< HEAD
=======
interface ConfigParamters {
  content?: string;
  perset: Preset;
  buildToolConfigAst: any;
}
>>>>>>> upstream/feat/generator-upgrade

/**
 * 框架对构建工具协议
 * @param protocols 协议内容
 */
class TemplateToBuildToolAPI extends ProtocolGeneratorAPI {
  protected declare protocols: Record<string, object>; // todo 类型考虑优化

  constructor(protocols, props) {
    super(protocols);
    this.protocols = protocols;
    this.props = props;
  }

  generator() {
    for (const protocol in this.protocols) {
      this[protocol](this.protocols[protocol]);
    }
  }
  async loadModule(modulePath: string, rootDirectory: string) {
    /**
     * 解析后的路径。
     * @type {string}
     */
    const resolvedPath = path.resolve(rootDirectory, modulePath);
    try {
      const module = await require(resolvedPath);
      return module;
    } catch (error) {
      console.error(`Error loading module at ${resolvedPath}:`, error);
      return null;
    }
  }

  async ADD_CONFIG(params) {
    //这里 有两种插入方式，一种是利用传进来的 content 手动配置去加，另一种是利用已有的插件（例如 plugin-babel）来做固定的配置插入（实际上是原有方案。
    //这样就解决了普通插件和特殊插件的配置插入问题，比如如果是个特殊插件或者是框架独有的，可以用 content 插入，而普通的通用插件，则使用第二种方式插入。
    const content = params.content;
    if (content) {
      console.log(content);
    }

    const { buildTool, template, plugins } = this.props.preset;
    const buildToolConfigAst = this.props.buildToolConfigAst;
    for (const plugin in plugins) {
      if (Object.prototype.hasOwnProperty.call(plugins, plugin)) {
        // 确保只遍历对象自身的属性
        const entryPath = `@plugin/plugin-${plugin}/index.cjs`;
        // 执行 plugin或模板的入口文件，把 config 合并到构建工具原始配置中
        const baseEntry = await this.loadModule(
          entryPath,
          path.resolve(__dirname, relativePathToRoot),
        );
        // 处理构建工具配置
        if (typeof baseEntry === "function") {
          // 解析配置项成 ast 语法树,并且和原始配置的 ast 合并
          createConfigByParseAst(buildTool, baseEntry(buildTool, template), buildToolConfigAst);
        }
      }
    }
  }
}

export default TemplateToBuildToolAPI;
