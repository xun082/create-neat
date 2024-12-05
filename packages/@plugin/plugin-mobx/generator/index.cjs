const path = require('path');
const protocol = require("../../../core/src/configs/protocol.ts");
const { getSrcDir, transformCode, importDeclarationUtils, exportDefaultDeclarationUtils } = require('../../../core/src/utils/transformFileData.ts')

const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;

function processReactFiles(fileData) {
  const srcFileDir = getSrcDir(fileData)
  for (let i = 0; i < srcFileDir.children.length; i++) {
    const fileName = path.basename(srcFileDir.children[i].path);
    if (fileName === 'App.jsx') {
      const file = srcFileDir.children[i].describe
      const operations = {
        ImportDeclaration(path, t) {
          const options = [
            { name: 'mobx', path: 'mobx-react-lite' },
            { name: 'store', path: './store' }
          ]
          importDeclarationUtils(path, t, options)
        },
        ExportDefaultDeclaration(path, t) {
          const content = 'mobx.observer'
          exportDefaultDeclarationUtils(path, t, content)
        },
      }
      const parserOptions = { sourceType: "module", plugins: ["jsx"] }
      const modifiedCode = transformCode(file.fileContent, operations, parserOptions);
      file.fileContent = modifiedCode
      break
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
    [pluginToTemplateProtocol.PROCESS_MOBX_PLUGIN]: {
      params: {
        content: {
          processReactFiles
        }
      },
      priority: 1, // 优先级
    }
  });
};
