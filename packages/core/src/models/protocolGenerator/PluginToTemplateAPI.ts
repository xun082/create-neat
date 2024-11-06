import ProtocolGeneratorAPI from "./ProtocolGeneratorAPI";

// enum Location {
//   BeforeMatchStructure = "BeforeMatchStructure",
//   AfterMatchStructureImport = "AfterMatchStructureImport",
//   AfterMatchStructureUse = "AfterMatchStructureUse",
//   InMatchStructure = "InMatchStructure",
//   WrapMatchStructure = "WrapMatchStructure",
// }

/**
 * 插件影响框架的协议处理器
 * @param protocols 协议内容
 */

class PluginToTemplateAPI extends ProtocolGeneratorAPI {
  constructor(protocols) {
    super(protocols);
  }

  /**
   * 根据位置信息处理内容插入
   * @param fileContent 原文件内容
   * @param location 插入位置
   * @param match 正则匹配结果
   * @param content 要插入的内容
   * @param wrapStructure 包装结构（可选）
   */
  // private handleContentInsertion(
  //   fileContent: string,
  //   location: Location,
  //   match: RegExpMatchArray,
  //   content: string,
  //   wrapStructure?: string,
  // ): string {
  //   switch (location) {
  //     case Location.BeforeMatchStructure:
  //       return fileContent.slice(0, match.index) + content + fileContent.slice(match.index);

  //     case Location.AfterMatchStructureImport:
  //       const importRegex = /^import\s+.*$/gm;
  //       const imports = fileContent.match(importRegex);
  //       if (imports?.length) {
  //         const lastImport = imports[imports.length - 1];
  //         const lastImportIndex = fileContent.lastIndexOf(lastImport);
  //         const endOfLastImportIndex = lastImportIndex + lastImport.length;
  //         return (
  //           fileContent.substring(0, endOfLastImportIndex) +
  //           content +
  //           fileContent.substring(endOfLastImportIndex)
  //         );
  //       }
  //       return content + "\n" + fileContent;

  //     case Location.AfterMatchStructureUse:
  //       const afterIndex = match.index! + match[0].length;
  //       return fileContent.slice(0, afterIndex) + content + fileContent.slice(afterIndex);

  //     case Location.InMatchStructure:
  //       return fileContent.replace(match[0], content);

  //     case Location.WrapMatchStructure:
  //       if (wrapStructure) {
  //         const [wrapStart, wrapEnd] = wrapStructure.split("%*#$");
  //         const [contentStart, contentEnd] = content.split("%*#$");
  //         const newContent = `${wrapStart}${contentStart}${match[1]}${contentEnd}${wrapEnd}`;
  //         return fileContent.replace(match[0], newContent);
  //       }
  //       return fileContent;

  //     default:
  //       return fileContent;
  //   }
  // }

  // /**
  //  * 写入配置到模板
  //  */
  // public writeConfigIntoTemplate(fileContent: string, plugin: any, baseName: string): string {
  //   if (!plugin.paths?.includes(baseName)) {
  //     return fileContent;
  //   }

  //   let updatedContent = fileContent;

  //   for (let i = 0; i < plugin.paths.length; i++) {
  //     if (plugin.paths[i] === baseName) {
  //       const match = fileContent.match(plugin.regexps[i]);
  //       if (match) {
  //         updatedContent = this.handleContentInsertion(
  //           updatedContent,
  //           plugin.locations[i],
  //           match,
  //           plugin.contents[i],
  //           plugin.wrapStructures?.[i],
  //         );
  //       }
  //     }
  //   }

  //   return updatedContent;
  // }
}

export default PluginToTemplateAPI;
