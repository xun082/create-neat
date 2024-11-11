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
        content: 'Specil plugin',
      },
      priority: 1,
    },
  })
};
