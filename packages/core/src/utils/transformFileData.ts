// todo 因为文件中的函数或方法被index.cjs调用，导致无法用ts和esm导出写法

// 定义 LocationCode 枚举，用于指定插件内容插入的位置
/**
 * 插入位置
 * @enum
 * @property {number} BeforeMatchStructure - 在匹配结构之前
 * @property {number} InMatchStructure - 在匹配结构中
 * @property {number} AfterMatchStructureImport - 在匹配结构导入之后
 * @property {number} AfterMatchStructureUse - 在匹配结构使用之后
 * @property {number} WrapMatchStructure - 包裹匹配结构
 */
const LocationCode = {
  BeforeMatchStructure: 0,
  InMatchStructure: 1,
  AfterMatchStructureImport: 2,
  AfterMatchStructureUse: 3,
  WrapMatchStructure: 4,
};

const RegExpEnum = {
  reactRouterRegexpJSX: "reactRouterRegexpJSX",
  fileImport: "fileImport",
  createAppRegex: "createAppRegex",
  exportDefaultRexg: "exportDefaultRexg",
};

const RegExpMap = {
  [RegExpEnum.reactRouterRegexpJSX]: /return\s*\(([\s\S]*?)\);/s,
  [RegExpEnum.fileImport]: /^import.*$/gm,
  [RegExpEnum.createAppRegex]: /const\s+app\s*=\s*createApp\s*\(\s*App\s*\)/,
  [RegExpEnum.exportDefaultRexg]: /export\s+default\s+(\w+);/,
};

function insertBefore(content, index, insertion) {
  return content.slice(0, index) + insertion + content.slice(index);
}

function insertAfter(content, index, insertion) {
  return content.slice(0, index) + insertion + content.slice(index);
}

function insertAfterLastImport(content, insertion) {
  const importRegex = /^import\s+.*$/gm;
  const imports = content.match(importRegex);
  if (imports && imports.length > 0) {
    const lastImport = imports[imports.length - 1];
    const lastImportIndex = content.lastIndexOf(lastImport);
    const endOfLastImportIndex = lastImportIndex + lastImport.length;
    return (
      content.substring(0, endOfLastImportIndex) +
      insertion +
      content.substring(endOfLastImportIndex)
    );
  }
  return insertion + "\n" + content;
}

function wrapContent(content, match, wrapper, structure) {
  const matchedContent = match[1] || match[0];
  const wrappedContent = wrapper.replace("%*#$", matchedContent);
  return (
    content.slice(0, match.index) +
    structure.replace("%*#$", wrappedContent) +
    content.slice(match.index + match[0].length)
  );
}

function applyPluginTransformation(content, plugin, index) {
  const match = content.match(plugin.regexps[index]);
  if (!match) return content;

  let result = content;

  switch (plugin.locations[index]) {
    case LocationCode.BeforeMatchStructure:
      result = insertBefore(content, match.index, plugin.contents[index]);
      break;
    case LocationCode.AfterMatchStructureImport:
      result = insertAfterLastImport(content, plugin.contents[index]);
      break;
    case LocationCode.AfterMatchStructureUse:
      result = insertAfter(content, match.index + match[0].length, plugin.contents[index]);
      break;
    case LocationCode.WrapMatchStructure:
      if (plugin.wrapStructures && plugin.wrapStructures[index]) {
        result = wrapContent(content, match, plugin.contents[index], plugin.wrapStructures[index]);
      }
      break;
    default:
      break;
  }

  return result;
}

module.exports = {
  LocationCode,
  RegExpEnum,
  RegExpMap,
  insertBefore,
  insertAfter,
  insertAfterLastImport,
  wrapContent,
  applyPluginTransformation,
};
