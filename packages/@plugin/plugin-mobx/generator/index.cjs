const path = require('path');
const protocol = require("../../../core/src/configs/protocol.ts");
const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;
const { applyPluginTransformation, LocationCode, RegExpMap } = require('../../../core/src/utils/transformFileData.ts')

const reactMobx = {
  plugin: "reactMobx",
  paths: ["App.jsx", "App.jsx", "App.jsx"],
  contents: [
    "\nimport { observer } from 'mobx-react-lite';",
    "\nimport store from './store';",
    "observer(%*#$)",
  ],
  regexps: [RegExpMap.fileImport, RegExpMap.fileImport, RegExpMap.exportDefaultRexg],
  locations: [
    LocationCode.AfterMatchStructureImport,
    LocationCode.AfterMatchStructureImport,
    LocationCode.WrapMatchStructure,
  ],
  wrapStructures: ["", "", "export default %*#$;"],
};

function processReactFiles(fileData) {
  for (let i = 0; i < fileData.children.length; i++) {
    // 先寻找 src 文件夹
    const dirName = path.basename(fileData.children[i].path);
    if (dirName === "src") {
      const srcFileData = fileData.children[i];
      for (let j = 0; j < srcFileData.children.length; j++) {
        const fileName = path.basename(srcFileData.children[j].path);
        for (let k = 0; k < reactMobx.paths.length; k++) {
          if (fileName === reactMobx.paths[k]) {
            const fileContent = srcFileData.children[j].describe
            fileContent.fileContent = applyPluginTransformation(fileContent.fileContent, reactMobx, k)
          }
        }
      }
    }
  }
  return fileData
}

module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    devDependencies: {
      mobx: "^6.6.4",
      "mobx-react-lite": "^3.2.2",
    },
  });

  generatorAPI.protocolGenerate({
    [pluginToTemplateProtocol.PROCESS_TEMPLATE_PLUGIN]: {
      params: {
        content: {
          processReactFiles
        }
      },
      priority: 1, // 优先级
    }
  });
};
