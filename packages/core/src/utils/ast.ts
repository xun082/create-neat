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

export const createImportDeclaration = () => {
  return importDeclaration([importDefaultSpecifier(identifier("React"))], stringLiteral("react"));
};

export const mergeWebpackConfigAst = (rules, plugins, ast) => {
  traverse(ast, {
    ExpressionStatement(path) {
      plugins.forEach((plugin) => {
        // 不是default也得处理
        path.container.unshift(
          importDeclaration(
            [importDefaultSpecifier(identifier(plugin.import.name))],
            stringLiteral(plugin.import.from),
          ),
        );
      });

      path.node.expression.right.properties.forEach((item) => {
        // 合并定义的webpack plugin
        if (item.key.name === "plugins") {
          const pluginAsts = [];
          plugins.forEach((plugin) => {
            pluginAsts.push(
              newExpression(
                identifier(plugin.name), // 对象标识符
                [], // 构造函数参数
              ),
            );
          });
          pluginAsts.forEach((ast) => item.value.elements.push(ast));
        }
        // 合并定义的webpack loader
        if (item.key.name === "module") {
          const rulesAsts = [];
          rules.forEach((rule) => {
            const formatReg = (str) => str.substring(1, str.length - 1);
            const ruleAstNode = objectExpression([
              objectProperty(identifier("test"), regExpLiteral(formatReg(`${rule.test}`))),
              objectProperty(identifier("exclude"), regExpLiteral(formatReg(`${rule.exclude}`))),
              objectProperty(
                identifier("use"),
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
