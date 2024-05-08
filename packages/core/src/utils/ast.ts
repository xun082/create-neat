import {
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  newExpression,
  objectExpression,
  objectProperty,
  regExpLiteral,
  stringLiteral,
  arrayExpression,
  callExpression,
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
 * @example legacy({ target: ["> 1%"] })------{ target: ["> 1%"] }
 * 创建回调函数内对象ast
 * @param name 函数名
 * @param parameters 函数参数
 */
export const createCallExpression = (
  name: string,
  parameters: Parameters<typeof newExpression>[1],
) =>
  callExpression(
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

/**
 * 合并vite config ast
 * 目前支持plugins中的第三方插件。例如：legacy
 * 其余基础配置可配置到基础模版
 * @param plugins 本次合并的插件
 * @param ast 初始ast
 */
export const mergeViteConfigAst = (plugins, ast) => {
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
        // 收集plugins配置函数ast
        const pluginAsts = [];
        // 收集配置中的参数项
        plugins.forEach((plugin) => {
          const pluginFunArgsAsts = [];
          Object.keys(plugin.params).forEach((key) => {
            const propertyList = [];
            // 收集参数项中的值
            const stringLiteralList = []; //元素值
            // 判断值是字符串还是数组
            if (Array.isArray(plugin.params[key])) {
              plugin.params[key].map((value) => stringLiteralList.push(stringLiteral(value)));
            } else {
              stringLiteralList.push(stringLiteral(plugin.params[key]));
            }
            propertyList.push(createObjectProperty(key, arrayExpression(stringLiteralList)));
            pluginFunArgsAsts.push(objectExpression(propertyList));
          });
          pluginAsts.push(createCallExpression(plugin.name, pluginFunArgsAsts));
        });
        pluginAsts.forEach((ast) => path.parent.value.elements.push(ast));
      }
    },
  });
  return ast;
};
