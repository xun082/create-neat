import traverse from "@babel/traverse";
import { objectExpression, regExpLiteral, stringLiteral, arrayExpression } from "@babel/types";

import type { BuildToolType, Options, Plugin } from "../../../types/ast";
import { Build_Tool } from "../../../constants/ast";
import {
  createImportDeclaration,
  createNewExpression,
  createCallExpression,
  createObjectProperty,
} from "../uno/commonAst";

/**
 * 将传入配置转换成ast
 * @param buildTool 构建工具选择
 * @param options 配置
 * @param ast 初始化ast
 */
export const createConfigByParseAst = (buildTool: BuildToolType, options: Options, ast) => {
  if (buildTool === Build_Tool.VITE) {
    mergeViteConfigAst(options, ast);
  }
  if (buildTool === Build_Tool.WEBPACK) {
    mergeWebpackConfigAst(options, ast);
  }
};

/**
 * 合并webpack config ast
 * 目前支持loaders、plugins
 * @param rules 本次合并的loader rules
 * @param plugins 本次合并的插件
 * @param ast 初始ast
 */
function mergeWebpackConfigAst(options: Options, ast) {
  const { rules, plugins } = options;
  if (!plugins) return;
  traverse(ast, {
    ExpressionStatement(path) {
      const astNode = path.node;
      // 只匹配模板中的module.exports部分
      if (!astNode.expression.left.object) return;
      if (astNode.expression.left.object.name !== "module") return;
      // 遍历module.exports对象中的每个属性的ast节点
      astNode.expression.right.properties.forEach((property) => {
        // 匹配到plugins属性，根据传入的options中的plugin生成ast进行插入
        if (property.key.name === "plugins") {
          const pluginAstNodes = [];
          plugins.forEach((plugin) => {
            pluginAstNodes.push(createNewExpression(plugin.name, []));
          });
          pluginAstNodes.forEach((ast) => property.value.callee.object.elements.push(ast));
        }
        // 匹配到module属性，将传入的options中的rules转化为ast进行插入
        if (property.key.name === "module") {
          const rulesAstNodes = [];
          rules.forEach((rule) => {
            const formatReg = (str) => str.substring(1, str.length - 1);
            let parseIncludeAst;
            let parseExcludeAst;
            let parseLoaderAst;
            let ruleAstNode;
            // 如果include属性为数组
            if (Array.isArray(rule.include)) {
              parseIncludeAst = arrayExpression(rule.include.map((item) => stringLiteral(item)));
            } else {
              // 如果include属性值为正则表达式
              parseIncludeAst = regExpLiteral(formatReg(`${rule.include}`));
            }
            // 如果exclude属性值为数组
            if (Array.isArray(rule.exclude)) {
              parseExcludeAst = arrayExpression(
                rule.exclude.map((item) => regExpLiteral(formatReg(`${item}`))),
              );
            } else {
              // 如果exclude属性值为正则
              parseExcludeAst = regExpLiteral(formatReg(`${rule.exclude}`));
            }
            if (rule.loader) {
              if (Array.isArray(rule.loader)) {
                parseLoaderAst = arrayExpression(rule.loader.map((item) => stringLiteral(item)));
              } else {
                parseLoaderAst = stringLiteral(rule.loader);
              }
              ruleAstNode = objectExpression([
                createObjectProperty("test", regExpLiteral(formatReg(`${rule.test}`))),
                createObjectProperty("include", parseIncludeAst),
                createObjectProperty("exclude", parseExcludeAst),
                createObjectProperty("loader", parseLoaderAst),
              ]);
            }
            if (rule.use) {
              const parseUseAst = arrayExpression(
                rule.use.map((item) => {
                  if (typeof item === "string") {
                    return stringLiteral(item);
                  } else {
                    return objectExpression([
                      createObjectProperty("loader", stringLiteral(item.loader)),
                    ]);
                  }
                }),
              );
              ruleAstNode = objectExpression([
                createObjectProperty("test", regExpLiteral(formatReg(`${rule.test}`))),
                createObjectProperty("include", parseIncludeAst),
                createObjectProperty("exclude", parseExcludeAst),
                createObjectProperty("use", parseUseAst),
              ]);
            }

            rulesAstNodes.push(ruleAstNode);
          });
          const prevRulesAst = property.value.properties.find(
            (property) => property.key.name === "rules",
          );
          rulesAstNodes.forEach((ast) => prevRulesAst.value.callee.object.elements.push(ast));
        }
      });
    },
  });
  return ast;
}

/**
 * 合并vite config ast
 * 目前支持plugins中的第三方插件。例如：legacy
 * 其余基础配置可配置到基础模版
 * @param plugins 本次合并的插件
 * @param ast 初始ast
 */
function mergeViteConfigAst(options: Options, ast) {
  const { plugins } = options;
  if (!plugins) return;
  traverse(ast, {
    ImportDeclaration: (path) => {
      plugins.forEach((plugin) => {
        // 处理导入
        path.container.unshift(createImportDeclaration(plugin.import.name, plugin.import.from));
      });
    },
    enter(path) {
      // 处理配置
      if (path.isIdentifier({ name: "plugins" })) {
        const pluginAsts = createPluginAst(plugins);
        pluginAsts.forEach((ast) => path.parent.value.elements.push(ast));
      }
    },
  });
  return ast;
}

/**
 * 解析配置项转换为ast语法树
 * @param plugins 配置
 */
function createPluginAst(plugins: Plugin[]) {
  // 收集plugins配置函数ast
  const pluginAsts = plugins.map((plugin: Plugin) => {
    // 收集配置中的参数项，并创建参数对象
    const pluginParams = Object.keys(plugin.params).reduce(
      (acc, key) => {
        const value = plugin.params[key];
        const stringLiteralList = Array.isArray(value)
          ? value.map(stringLiteral)
          : [stringLiteral(value)];
        acc[key] = arrayExpression(stringLiteralList);
        return acc;
      },
      {} as Record<string, any>,
    ); // 初始化一个空对象作为累加器

    // 创建一个对象表达式来表示参数
    const pluginFunArgs = [
      objectExpression(
        Object.entries(pluginParams).map(([key, value]) => createObjectProperty(key, value)),
      ),
    ];

    // 创建一个调用表达式来表示插件函数调用
    return createCallExpression(plugin.name, pluginFunArgs);
  });

  // 返回一个新的AST节点数组
  return pluginAsts;
}
