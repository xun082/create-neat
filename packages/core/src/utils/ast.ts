import {
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  newExpression,
  objectExpression,
  objectProperty,
  regExpLiteral,
  stringLiteral,
} from "@babel/types";
import traverse from "@babel/traverse";

/**
 * 创建default import ast
 * @param name default导出的名
 * @param import from 来源
 */
export const createImportDeclaration = (name: string, from: string) =>
  importDeclaration([importDefaultSpecifier(identifier(name))], stringLiteral(from));

/**
 * 创建新建对象语法ast
 * @param name 构造函数名
 * @param parameters 构造函数参数
 */
export const createNewExpression = (
  name: string,
  parameters: Parameters<typeof newExpression>[1],
) =>
  newExpression(
    identifier(name), // 对象标识符
    parameters, // 构造函数参数
  );

/**
 * 创建对象属性ast
 * @param name 对象属性名
 * @param value 对象属性值
 */
export const createObjectProperty = (name: string, value: Parameters<typeof objectProperty>[1]) =>
  objectProperty(identifier(name), value);

/**
 * 合并webpack config ast
 * 目前支持loaders、plugins
 * @param rules 本次合并的loader rules
 * @param plugins 本次合并的插件
 * @param ast 初始ast
 */
export const mergeWebpackConfigAst = (rules, plugins, ast) => {
  traverse(ast, {
    ExpressionStatement(path) {
      plugins.forEach((plugin) => {
        // 不是default也得处理
        path.container.unshift(createImportDeclaration(plugin.import.name, plugin.import.from));
      });

      path.node.expression.right.properties.forEach((item) => {
        // 合并定义的webpack plugin
        if (item.key.name === "plugins") {
          const pluginAsts = [];
          plugins.forEach((plugin) => {
            pluginAsts.push(createNewExpression(plugin.name, []));
          });
          pluginAsts.forEach((ast) => item.value.elements.push(ast));
        }
        // 合并定义的webpack loader
        if (item.key.name === "module") {
          const rulesAsts = [];
          rules.forEach((rule) => {
            const formatReg = (str) => str.substring(1, str.length - 1);
            const ruleAstNode = objectExpression([
              createObjectProperty("test", regExpLiteral(formatReg(`${rule.test}`))),
              createObjectProperty("exclude", regExpLiteral(formatReg(`${rule.exclude}`))),
              createObjectProperty(
                "use",
                objectExpression([
                  objectProperty(identifier("loader"), stringLiteral(rule.use.loader)),
                ]),
              ),
            ]);

            rulesAsts.push(ruleAstNode);
          });
          const prevRulesAst = item.value.properties.find(
            (property) => property.key.name === "rules",
          );
          rulesAsts.forEach((ast) => prevRulesAst.value.elements.push(ast));
        }
      });
    },
  });
  return ast;
};
