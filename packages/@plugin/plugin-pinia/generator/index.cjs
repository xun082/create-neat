const path = require("path");

const protocol = require("../../../core/src/configs/protocol.ts");
const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;

/**
 * 处理 Pinia 文件函数
 */
function processPiniaFiles(plugin, fileData) {
  const importRegex = /^import.*$/gm;
  const mountRegex = /app\.mount\(.*\)/;

  for (let i = 0; i < fileData.children.length; i++) {
    const dirName = path.basename(fileData.children[i].path);
    if (dirName === "src") {
      const mainFile = fileData.children[i].children.find(
        (child) =>
          path.basename(child.path) === "main.js" || path.basename(child.path) === "main.ts",
      );

      if (mainFile && mainFile.describe) {
        let content = mainFile.describe.fileContent;

        // 找到最后一个 import 语句
        const imports = content.match(importRegex);
        if (imports) {
          const lastImport = imports[imports.length - 1];
          const lastImportIndex = content.lastIndexOf(lastImport);
          const endOfLastImportIndex = lastImportIndex + lastImport.length;

          // 在最后一个 import 后添加 pinia 相关导入
          const importContent =
            "\n\nimport { createPinia } from 'pinia'\nconst pinia = createPinia()\n";
          content =
            content.substring(0, endOfLastImportIndex) +
            importContent +
            content.substring(endOfLastImportIndex);
        }

        // 在 mount 之前添加 app.use(pinia)
        const mountMatch = content.match(mountRegex);
        if (mountMatch) {
          const useContent = "app.use(pinia)\n\n";
          const mountIndex = mountMatch.index;
          content = content.substring(0, mountIndex) + useContent + content.substring(mountIndex);
        }

        // 处理多余的空行
        content = content.replace(
          /\n\n\nconst app = createApp\(App\)/,
          "\nconst app = createApp(App)",
        );
        content = content.replace(
          /const app = createApp\(App\)\n\n\n/,
          "const app = createApp(App)\n\n",
        );

        mainFile.describe.fileContent = content;
      }
    }
  }
  return fileData;
}

module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    dependencies: {
      pinia: "^2.2.2",
    },
  });

  generatorAPI.protocolGenerate({
    [pluginToTemplateProtocol.PROCESS_PINIA_PLUGIN]: {
      params: {
        content: {
          processPiniaFiles,
        },
      },
    },
  });
};
