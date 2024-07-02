import traverse from "@babel/traverse";
import {
  identifier,
  objectExpression,
  regExpLiteral,
  stringLiteral,
  objectProperty,
  arrayExpression,
} from "@babel/types";

import {
  createImportDeclaration,
  createNewExpression,
  createCallExpression,
  createObjectProperty,
} from "./commonAst";

enum BuildToolType {
  VITE = "vite",
  WEBPACK = "webpack",
}
type BuildTool = `${BuildToolType}`;

interface Import {
  /** 导出内容 */
  name: string;
  /** 导出的包 */
  from: string;
}

interface Plugin {
  /** 导出内容 */
  name: string;
  /** 配置参数 */
  params: object;
  /** 导出配置 */
  import: Import;
}

interface Options {
  /** rules配置项 */
  rules: any;
  /** 插件配置 */
  plugins: Plugin[];
}

/**
 * 将传入配置转换成ast
 * @param buildTool 构建工具选择
 * @param options 配置
 * @param ast 初始化ast
 */
export const createConfigByParseAst = (buildTool: BuildTool, options: Options, ast) => {
  if (buildTool === BuildToolType.VITE) {
    mergeViteConfigAst(options, ast);
  }
  if (buildTool === BuildToolType.WEBPACK) {
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
