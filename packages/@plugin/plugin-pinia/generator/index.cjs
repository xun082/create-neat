const protocol = require("../../../core/src/configs/protocol.ts");
const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;

module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    dependencies: {
      pinia: "^2.2.2",
    },
  });

  generatorAPI.protocolGenerate({
    [pluginToTemplateProtocol.INSERT_IMPORT]: {
      params: {
        imports: [
          {
            dir: "src/main.js",
            name: "{ createPinia }",
            from: "pinia",
          },
        ],
      },
    },
  });
};
