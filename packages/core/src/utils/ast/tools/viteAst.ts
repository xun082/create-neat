import traverse from "@babel/traverse";
import { objectExpression, stringLiteral, arrayExpression } from "@babel/types";

import type { ASTPlugin } from "../../../types/ast";
import { Build_Tool } from "../../../constants/ast";
import {
  createImportDeclaration,
  createCallExpression,
  createObjectProperty,
} from "../uno/commonAst";

import { BaseAst } from "./baseAst";

export class ViteAst extends BaseAst {
  private plugins;

  constructor(options, ast) {
    super(Build_Tool.VITE, options, ast);

    this.plugins = options.plugins;
  }

  /**
   * 解析配置项转换为ast语法树
   * @param plugins 配置
   */
  createPluginAst(plugins: ASTPlugin[]) {
    // 收集plugins配置函数ast
    const pluginAsts = plugins.map((plugin: ASTPlugin) => {
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

  /**
   * 合并vite config ast
   * 目前支持plugins中的第三方插件。例如：legacy
   * 其余基础配置可配置到基础模版
   */
  mergeConfig() {
    if (!this.plugins) return;
    traverse(this.ast, {
      ImportDeclaration: (path) => {
        this.plugins.forEach((plugin) => {
          // 处理导入
          path.container.unshift(createImportDeclaration(plugin.import.name, plugin.import.from));
        });
      },
      enter: (path) => {
        // 处理配置
        if (path.isIdentifier({ name: "plugins" })) {
          const pluginAsts = this.createPluginAst(this.plugins);
          pluginAsts.forEach((ast) => path.parent.value.elements.push(ast));
        }
      },
    });

    return this.ast;
  }
}
