import traverse from "@babel/traverse";
import { objectExpression, regExpLiteral, stringLiteral, arrayExpression } from "@babel/types";

import { Build_Tool } from "../../../constants/ast";
import { createObjectProperty, createNewExpression } from "../uno/commonAst";

import { BaseAst } from "./baseAst";

export class WebpackAst extends BaseAst {
  private rules;
  private plugins;

  constructor(options, ast) {
    super(Build_Tool.WEBPACK, options, ast);

    this.rules = options.rules;
    this.plugins = options.plugins;
  }

  /**
   * 合并webpack config ast
   * 目前支持loaders、plugins
   */
  mergeConfig() {
    if (!this.plugins) return;
    traverse(this.ast, {
      ExpressionStatement: (path) => {
        const astNode = path.node;
        // 只匹配模板中的module.exports部分
        if (!astNode.expression.left.object) return;
        if (astNode.expression.left.object.name !== "module") return;
        // 遍历module.exports对象中的每个属性的ast节点
        astNode.expression.right.properties.forEach((property) => {
          // 匹配到plugins属性，根据传入的options中的plugin生成ast进行插入
          if (property.key.name === "plugins") {
            const pluginAstNodes = [];
            this.plugins.forEach((plugin) => {
              pluginAstNodes.push(createNewExpression(plugin.name, []));
            });
            pluginAstNodes.forEach((ast) => property.value.callee.object.elements.push(ast));
          }
          // 匹配到module属性，将传入的options中的rules转化为ast进行插入
          if (property.key.name === "module") {
            const rulesAstNodes = [];
            this.rules.forEach((rule) => {
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
    return this.ast;
  }
}
