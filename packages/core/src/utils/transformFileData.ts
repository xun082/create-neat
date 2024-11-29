// todo 因为文件中的函数或方法被index.cjs调用，导致无法用ts和esm导出写法

// 定义 LocationCode 枚举，用于指定插件内容插入的位置
/**
 * 插入位置
 * @enum {number}
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

// 定义正则表达式枚举，用于标识不同的正则表达式类型
/**
 * 正则表达式枚举
 * @enum {string}
 */
const RegExpEnum = {
  reactRouterRegexpJSX: "reactRouterRegexpJSX",
  fileImport: "fileImport",
  createAppRegex: "createAppRegex",
  exportDefaultRexg: "exportDefaultRexg",
};

// 定义正则表达式映射，将正则表达式枚举映射到实际的正则表达式
/**
 * 正则表达式映射
 * @type {Object.<string, RegExp>}
 */
const RegExpMap = {
  [RegExpEnum.reactRouterRegexpJSX]: /return\s*\(([\s\S]*?)\);/s,
  [RegExpEnum.fileImport]: /^import.*$/gm,
  [RegExpEnum.createAppRegex]: /const\s+app\s*=\s*createApp\s*\(\s*App\s*\)/,
  [RegExpEnum.exportDefaultRexg]: /export\s+default\s+(\w+);/,
};

// 在指定索引之前插入内容
/**
 * 在指定索引之前插入内容
 * @param {string} content - 原始内容
 * @param {number} index - 插入位置的索引
 * @param {string} insertion - 要插入的内容
 * @returns {string} - 插入后的新内容
 */
function insertBefore(content, index, insertion) {
  return content.slice(0, index) + insertion + content.slice(index);
}

// 在指定索引之后插入内容
/**
 * 在指定索引之后插入内容
 * @param {string} content - 原始内容
 * @param {number} index - 插入位置的索引
 * @param {string} insertion - 要插入的内容
 * @returns {string} - 插入后的新内容
 */
function insertAfter(content, index, insertion) {
  return content.slice(0, index) + insertion + content.slice(index);
}

// 在最后一个import语句之后插入内容
/**
 * 在最后一个import语句之后插入内容
 * @param {string} content - 原始内容
 * @param {string} insertion - 要插入的内容
 * @returns {string} - 插入后的新内容
 */
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

// 包裹匹配的内容
/**
 * 包裹匹配的内容
 * @param {string} content - 原始内容
 * @param {RegExpMatchArray} match - 匹配的结果
 * @param {string} wrapper - 包裹的模板
 * @param {string} structure - 包裹的结构
 * @returns {string} - 包裹后的新内容
 */
function wrapContent(content, match, wrapper, structure) {
  const matchedContent = match[1] || match[0];
  const wrappedContent = wrapper.replace("%*#$", matchedContent);
  return (
    content.slice(0, match.index) +
    structure.replace("%*#$", wrappedContent) +
    content.slice(match.index + match[0].length)
  );
}

// 应用插件转换，根据插件配置插入或包裹内容
/**
 * 应用插件转换
 * @param {string} content - 原始内容
 * @param {Object} plugin - 插件对象，包含正则表达式和内容
 * @param {number} index - 插件配置的索引
 * @returns {string} - 转换后的新内容
 */
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

// 导出模块
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
