const protocol = require("../../../src/configs/protocol.ts")
const templateToBuildToolProtocol = protocol.templateToBuildToolProtocol;
module.exports = (templateAPI) => {
  templateAPI.extendPackage({
    dependencies: {
      vue: "^3.2.47",
    },
    devDependencies: {
      "vue-template-compiler": "^2.7.16",
    },
  });

  templateAPI.protocolGenerate({
    [templateToBuildToolProtocol.ADD_CONFIG]: {
      params: {
        content: {
          buildToolName: 'webpack',  //这里怎么拿选项呢？
          template: 'vue',
          options: '' //补全一下定义
        }
      },
      priority: 1,
    },
  })
};
