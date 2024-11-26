const protocol = require("../../../core/src/configs/protocol.ts");
const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;
module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    devDependencies: {
      scss: "^1.81.0", // todo: 暂时的版本
    },
  });

  generatorAPI.protocolGenerate({
    [pluginToTemplateProtocol.ENTRY_FILE]: {
      // 入口文件引入全局 scss 文件
      params: {
        content: "import './styles/main.scss'", // 全局样式文件路径
        // ……
      },
      priority: 1, // 优先级
    },
    [pluginToTemplateProtocol.PROCESS_STYLE_PLUGIN]: {
      params: {
        content: '',// sass并没有什么特殊语句要添加，所以内容在 ast 方法内实现
      }
    }
  });
};