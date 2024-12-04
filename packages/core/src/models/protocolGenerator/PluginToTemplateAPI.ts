import { FileData } from "../FileTree";

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
  constructor(protocols, props) {
    super(protocols);
    this.protocols = protocols;
    this.props = props;
  }
  /**
   * Pinia 插件协议
   * @param params
   */
  PROCESS_PINIA_PLUGIN(params) {
    const content = params.params.content;
    const plugins = this.props.preset.plugins;
    const template = this.props.preset.template;
    const fileData: FileData = this.props.files.getFileData();
    try {
      for (const plugin in plugins) {
        if (plugin === "pinia") {
          content.processPiniaFiles("pinia", fileData, template);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * React Router 插件协议
   * @param params
   */
  PROCESS_ROUTER_PLUGIN(params) {
    const content = params.params.content;
    const plugins = this.props.preset.plugins;
    const template = this.props.preset.template;
    const fileData: FileData = this.props.files.getFileData();
    try {
      for (const plugin in plugins) {
        if (plugin === "react-router") {
          content.processReactRouter("react-router", fileData, template);
        }
      }
    } catch (error) {
      console.log(error);
    }
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
}

export default PluginToTemplateAPI;
