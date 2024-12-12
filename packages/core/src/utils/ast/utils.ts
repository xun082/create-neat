const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");
const generate = require("@babel/generator").default;

/**
 * 封装AST操作的通用函数
 * @param {string} fileContent 源代码字符串
 * @param {object} operations 用户定义的操作对象
 * @param {object} parserOptions 解析器选项（可选）
 * @returns {string} 修改后的代码
 */
export function transformCode(fileContent: string, operations: any, parserOptions: any) {
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
