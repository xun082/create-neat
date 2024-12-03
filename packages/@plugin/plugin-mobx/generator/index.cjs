const path = require('path');
const fs = require('fs')
const protocol = require("../../../core/src/configs/protocol.ts");
const { getSrcDir } = require('../../../core/src/utils/transformFileData.ts')
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generate = require("@babel/generator").default;

const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;

function processReactFiles(fileData) {
  const filePath = path.join(__dirname, '../../../core/template/template-react/generator/template/src/App.jsx');
  const code = fs.readFileSync(filePath, "utf8");
  // 解析为 AST
  const ast = parser.parse(code, { sourceType: "module", plugins: ["jsx"] });

  // 遍历并修改 AST
  traverse(ast, {
    Program(path) {
      // 新的 import 声明
      const mobxImport = t.importDeclaration(
        [t.importSpecifier(t.identifier("observer"), t.identifier("observer"))],
        t.stringLiteral("mobx-react-lite")
      );

      const storeImport = t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier("store"))],
        t.stringLiteral("./store")
      );

      // 找到最后一个 ImportDeclaration
      const importNodes = path.get("body").filter((p) => p.isImportDeclaration());

      if (importNodes.length > 0) {
        // 最后一个 import 的路径
        const lastImport = importNodes[importNodes.length - 1];
        // 在最后一个 import 后插入
        lastImport.insertAfter([mobxImport, storeImport]);
      }
    },
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;

      // 用 observer 包裹导出组件
      path.node.declaration = t.callExpression(t.identifier("observer"), [
        declaration,
      ]);
    },
  });

  // 生成修改后的代码
  const output = generate(ast, {}, code);

  const srcFileData = getSrcDir(fileData)
  for (let i = 0; i < srcFileData.children.length; i++) {
    const fileName = path.basename(srcFileData.children[i].path);
    if (fileName === 'App.jsx') {
      const file = srcFileData.children[i].describe
      file.fileContent = output.code
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
