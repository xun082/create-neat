const path = require('path');
const protocol = require("../../../core/src/configs/protocol.ts");
const { getSrcDir, transformCode } = require('../../../core/src/utils/transformFileData.ts')

const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;

function processReactFiles(fileData) {
  const srcFileDir = getSrcDir(fileData)
  for (let i = 0; i < srcFileDir.children.length; i++) {
    const fileName = path.basename(srcFileDir.children[i].path);
    if (fileName === 'App.jsx') {
      const file = srcFileDir.children[i].describe
      const operations = {
        ImportDeclaration(path, t) {
          const programBody = path.parent.body; // 当前 Program 节点的所有顶级节点
          const importDeclarations = programBody.filter((node) => node.type === "ImportDeclaration");
          console.log(programBody.length, importDeclarations.length, 'length');
          // 去重，检查目标导入是否已经存在
          const existingImports = new Set(importDeclarations.map((node) => node.source.value));
          const needsMobxImport = !existingImports.has("mobx-react-lite");
          const needsStoreImport = !existingImports.has("./store");

          // 如果需要插入的 import 存在，则准备插入内容
          const importsToAdd = [];
          if (needsMobxImport) {
            importsToAdd.push(
              t.importDeclaration(
                [t.importSpecifier(t.identifier("observer"), t.identifier("observer"))],
                t.stringLiteral("mobx-react-lite")
              )
            );
          }
          if (needsStoreImport) {
            importsToAdd.push(
              t.importDeclaration(
                [t.importDefaultSpecifier(t.identifier("store"))],
                t.stringLiteral("./store")
              )
            );
          }

          // 找到最后一个 ImportDeclaration 节点
          if (importDeclarations.length > 0 && importsToAdd.length > 0) {
            const lastImportPath = path.getSibling(importDeclarations.length - 1);
            lastImportPath.insertAfter(importsToAdd);
          }
        },
        ExportDefaultDeclaration(path, t) {
          // 用 observer 包装导出组件
          const declaration = path.node.declaration;
          path.node.declaration = t.callExpression(t.identifier("observer"), [declaration]);
        },
      }
      const parserOptions = { sourceType: "module", plugins: ["jsx"] }
      const modifiedCode = transformCode(file.fileContent, operations, parserOptions);
      console.log(modifiedCode);
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
