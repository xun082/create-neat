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
interface ConfigParamters {
  content?: string;
  perset: Preset;
  buildToolConfigAst: any;
}

/**
 * 插件影响构建工具的协议处理器
 * @param protocols 协议内容
 */

class PluginToBuildToolAPI extends ProtocolGeneratorAPI {
  protected declare protocols: Record<string, object>; // todo 类型考虑优化

  constructor(protocols) {
    super(protocols);
    this.protocols = protocols;
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

  async ADD_CONFIG(params: ConfigParamters) {
    const content = params.content;
    if (content) {
      console.log(content);
    }

    const { buildTool, template, plugins } = params.perset;
    const buildToolConfigAst = params.buildToolConfigAst;
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

export default PluginToBuildToolAPI;
