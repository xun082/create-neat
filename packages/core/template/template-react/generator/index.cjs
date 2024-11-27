const protocol = require("../../../src/configs/protocol.ts")
const templateToBuildToolProtocol = protocol.templateToBuildToolProtocol;

module.exports = (templateAPI) => {
  templateAPI.extendPackage({
    dependencies: {
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    },
    devDependencies: {},
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
