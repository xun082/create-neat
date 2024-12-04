const protocol = require("../../../core/src/configs/protocol.ts");
const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;

module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    dependencies: {
      "react-router-dom": "^6.0.0",
    },
  });

  generatorAPI.protocolGenerate({
    [pluginToTemplateProtocol.INSERT_IMPORT]: {
      params: {
        imports: [
          {
            dir: "src/App.jsx",
            name: "{ BrowserRouter as Router, Switch, Route }",
            from: "react-router-dom",
          },
        ],
      },
    },
  });
};
