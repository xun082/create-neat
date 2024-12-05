// todo 因为文件中的函数或方法被index.cjs调用，导致无法用ts和esm导出写法
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generate = require("@babel/generator").default;

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

/**
 * 根据fileData找出src目录
 */
const getSrcDir = (fileData) => {
  for (let i = 0; i < fileData.children.length; i++) {
    // 先寻找 src 文件夹
    const dirName = path.basename(fileData.children[i].path);
    if (dirName === "src") {
      const srcFileData = fileData.children[i];
      return srcFileData;
    }
  }
  return null;
};

/**
 * 封装遍历ast中ImportDeclaration的通用函数
 * @param {object} path
 * @param {object} t
 * @param {function} options import的配置
 */
function importDeclarationUtils(path, t, options) {
  const programBody = path.parent.body; // 当前 Program 节点的所有顶级节点
  const importDeclarations = programBody.filter((node) => node.type === "ImportDeclaration");
  // 去重，检查目标导入是否已经存在
  const existingImports = new Set(importDeclarations.map((node) => node.source.value));

  const needImports = [];
  for (let i = 0; i < options.length; i++) {
    const importInfo = options[i];
    const isNeed = !existingImports.has(importInfo.path);
    if (isNeed) {
      const importModule = t.importDeclaration(
        [t.importDefaultSpecifier(t.identifier(importInfo.name))],
        t.stringLiteral(importInfo.path),
      );
      needImports.push(importModule);
    }
  }
  // 找到最后一个 ImportDeclaration 节点
  if (importDeclarations.length > 0 && needImports.length > 0) {
    const lastImportPath = path.getSibling(importDeclarations.length - 1);
    lastImportPath.insertAfter(needImports);
  }
}

/**
 * 封装遍历ast中ExportDefaultDeclaration的通用函数
 * @param {object} path
 * @param {object} t
 * @param {function} options 要包裹导出的字符串
 */
function exportDefaultDeclarationUtils(path, t, content) {
  const declaration = path.node.declaration;
  path.node.declaration = t.callExpression(t.identifier(content), [declaration]);
}

/**
 * 封装AST操作的通用函数
 * @param {string} fileContent 源代码字符串
 * @param {function} operations 用户定义的操作函数，接收AST和path对象
 * @param {object} parserOptions 解析器选项（可选）
 * @returns {string} 修改后的代码
 */
function transformCode(fileContent, operations, parserOptions) {
  // 1. 解析源代码为AST
  const ast = parse(fileContent, parserOptions);

  // 2. 遍历AST，应用用户定义的操作逻辑
  traverse(ast, {
    Program(path) {
      if (operations.Program) {
        operations.Program(path, t);
      }
    },
    ImportDeclaration(path) {
      if (operations.ImportDeclaration) {
        operations.ImportDeclaration(path, t);
      }
    },
    ExportDefaultDeclaration(path) {
      if (operations.ExportDefaultDeclaration) {
        operations.ExportDefaultDeclaration(path, t);
      }
    },
    ExportNamedDeclaration(path) {
      if (operations.ExportNamedDeclaration) {
        operations.ExportNamedDeclaration(path, t);
      }
    },
    VariableDeclaration(path) {
      if (operations.VariableDeclaration) {
        operations.VariableDeclaration(path, t);
      }
    },
    FunctionDeclaration(path) {
      if (operations.FunctionDeclaration) {
        operations.FunctionDeclaration(path, t);
      }
    },
    ArrowFunctionExpression(path) {
      if (operations.ArrowFunctionExpression) {
        operations.ArrowFunctionExpression(path, t);
      }
    },
    ClassDeclaration(path) {
      if (operations.ClassDeclaration) {
        operations.ClassDeclaration(path, t);
      }
    },
    ClassMethod(path) {
      if (operations.ClassMethod) {
        operations.ClassMethod(path, t);
      }
    },
    ExpressionStatement(path) {
      if (operations.ExpressionStatement) {
        operations.ExpressionStatement(path, t);
      }
    },
    CallExpression(path) {
      if (operations.CallExpression) {
        operations.CallExpression(path, t);
      }
    },
    JSXElement(path) {
      if (operations.JSXElement) {
        operations.JSXElement(path, t);
      }
    },
    JSXAttribute(path) {
      if (operations.JSXAttribute) {
        operations.JSXAttribute(path, t);
      }
    },
    Literal(path) {
      if (operations.Literal) {
        operations.Literal(path, t);
      }
    },
    // 其他常见节点类型可以继续扩展
  });

  // 3. 生成新的代码
  return generate(ast, {}, fileContent).code;
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
  getSrcDir,
  transformCode,
  importDeclarationUtils,
  exportDefaultDeclarationUtils,
};
