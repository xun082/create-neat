const path = require('path');
const protocol = require("../../../core/src/configs/protocol.ts");
const pluginToTemplateProtocol = protocol.pluginToTemplateProtocol;

const StyleReg = {
  css: /css$/i,
  scss: /scss$/i, // 匹配以 .scss 结尾的文件
  less: /less$/i, // 匹配以 .less 结尾的文件
};

/**
 * 处理 sass、less 文件函数
 * @param plugin 插件名
 * @param fileData 文件内容
 * @returns
 */
function processStyleFiles(plugin, fileData, template, contentCallback) {
  const regexps = StyleReg["css"];
  for (let i = 0; i < fileData.children.length; i++) {
    // 先寻找 src 文件夹
    const dirName = path.basename(fileData.children[i].path);
    if (dirName === "src") {
      const srcFileData = fileData.children[i];
      for (let j = 0; j < srcFileData.children.length; j++) {
        const dirName = path.basename(srcFileData.children[j].path);
        const extension = dirName.split(".").pop();
        if (regexps.test(extension)) {
          const child = fileData.children[i].children[j];
          const fileDescribe = child.describe;
          // 更新文件扩展名和路径
          if (child.path && child.path.endsWith(`.${fileDescribe.fileExtension}`)) {
            child.describe.fileExtension = plugin;
            child.path = child.path.replace(child.path.match(regexps)[0], `.${plugin}`);
          }
          // 文件内容由回调函数处理
          if (fileDescribe && typeof fileDescribe.fileContent === "string") {
            fileData = contentCallback(fileData, template);
          }
        }
      }
    }
  }

  return fileData;
}

// 处理 sass 的回调函数，
function processScss(fileData, template) {
  for (let i = 0; i < fileData.children.length; i++) {
    const dirName = path.basename(fileData.children[i].path);
    if (dirName === "src") {
      if (template === "vue") {
        const vueData = fileData.children[i].children[0].describe;
        vueData.fileContent = vueData.fileContent.replace(
          `</script>\n\n<style scoped>\n@import "./index.css";\n</style>\n`,
          `</script>\n\n<style scoped lang="scss">\n@import "./index.scss";\n</style>\n`,
        );
      } else if (template === "react") {
        const reactData = fileData.children[i].children[0].describe;
        reactData.fileContent = reactData.fileContent.replace(
          `import "./index.css"`,
          `import "./index.scss"`,
        );
      }
    }
  }
  return fileData;
}

module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    devDependencies: {
      scss: "^1.81.0", // todo: 暂时的版本
    },
  });

  generatorAPI.protocolGenerate({
    [pluginToTemplateProtocol.ENTRY_FILE]: {
      // 入口文件引入全局 scss 文件
      params: {
        content: "import './styles/main.scss'", // 全局样式文件路径
        // ……
      },
      priority: 1, // 优先级
    },
    [pluginToTemplateProtocol.PROCESS_STYLE_PLUGIN]: {
      params: {
        content: {
          processStyleFiles,
          processScss
        }
      }
    }
  });
};