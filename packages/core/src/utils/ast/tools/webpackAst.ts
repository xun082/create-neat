import traverse from "@babel/traverse";
import { objectExpression, regExpLiteral, stringLiteral, arrayExpression } from "@babel/types";

import { Build_Tool, Rule_Prop } from "../../../constants/ast";
import { createObjectProperty, createNewExpression } from "../uno/commonAst";

import { BaseAst } from "./baseAst";

// 格式化正则: 去掉字符串两端的/
const formatReg = (str: string) => str.substring(1, str.length - 1);

export class WebpackAst extends BaseAst {
  private rules;
  private plugins;

  constructor(options, ast) {
    super(Build_Tool.WEBPACK, options, ast);

    this.rules = options.rules;
    this.plugins = options.plugins;
  }

  /**
   * 处理 rule 中的 include、exclude、loader 属性
   */
  dealRuleIsArrayOrRegExp(prop: string, value: string | string[]) {
    switch (prop) {
      case Rule_Prop.INCLUDE || Rule_Prop.EXCLUDE:
        if (Array.isArray(value)) {
          // 如果 value 为数组
          return arrayExpression(value.map((item) => stringLiteral(item)));
        } else {
          // 如果 value 为正则
          return regExpLiteral(formatReg(`${value}`));
        }
      case Rule_Prop.LOADER:
        if (Array.isArray(value)) {
          // 如果 value 为数组
          return arrayExpression(value.map((item) => stringLiteral(item)));
        } else {
          // 如果 value 为字符串
          return stringLiteral(value);
        }
      default:
        return undefined;
    }
  }

  /**
   * 合并 webpack config ast
   * 目前支持 loaders、plugins
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
              const parseIncludeAst = this.dealRuleIsArrayOrRegExp(Rule_Prop.INCLUDE, rule.include);
              const parseExcludeAst = this.dealRuleIsArrayOrRegExp(Rule_Prop.EXCLUDE, rule.exclude);
              const parseLoaderAst = rule.loader
                ? this.dealRuleIsArrayOrRegExp(Rule_Prop.LOADER, rule.loader)
                : undefined;
              let ruleAstNode;

              if (rule.loader) {
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
