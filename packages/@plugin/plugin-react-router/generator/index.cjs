const path = require("path");

const protocol = require("../../../core/src/configs/protocol.ts");
const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;

/**
 * 处理 React Router 文件函数
 */
function processReactRouter(plugin, fileData) {
  const reactRouterRegexpJSX = /return\s*\(([\s\S]*?)\);/s;
  const fileImport = /^import.*$/gm;

  for (let i = 0; i < fileData.children.length; i++) {
    const dirName = path.basename(fileData.children[i].path);
    if (dirName === "src") {
      const appFile = fileData.children[i].children.find(
        (child) =>
          path.basename(child.path) === "App.jsx" || path.basename(child.path) === "App.tsx",
      );

      if (appFile && appFile.describe) {
        let content = appFile.describe.fileContent;

        // 添加 import
        const importContent =
          "\nimport { BrowserRouter as Router, Switch, Route } from 'react-router-dom';\n";
        const imports = content.match(fileImport);
        if (imports && imports.length > 0) {
          const lastImport = imports[imports.length - 1];
          const lastImportIndex = content.lastIndexOf(lastImport);
          const endOfLastImportIndex = lastImportIndex + lastImport.length;
          content =
            content.substring(0, endOfLastImportIndex) +
            importContent +
            content.substring(endOfLastImportIndex);
        }

        // 包裹 Router
        const match = content.match(reactRouterRegexpJSX);
        if (match) {
          const matchedContent = match[1] || match[0];
          const wrappedContent = `\n<Router>${matchedContent}</Router>\n`;
          content =
            content.slice(0, match.index) +
            `return (${wrappedContent})` +
            content.slice(match.index + match[0].length);
        }

        appFile.describe.fileContent = content;
      }
    }
  }
  return fileData;
}

module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    dependencies: {
      "react-router-dom": "^6.0.0",
    },
  });

  generatorAPI.protocolGenerate({
    [pluginToTemplateProtocol.PROCESS_ROUTER_PLUGIN]: {
      params: {
        content: {
          processReactRouter,
        },
      },
    },
  });
};
