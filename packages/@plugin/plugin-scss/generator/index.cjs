const { pluginToTemplateProtocol } = require("'../../../core/src/configs/protocol.ts'"); // todo: 新增 alias

module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    devDependencies: {
      scss: "latest", // todo: 暂时的版本
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
  });
};
