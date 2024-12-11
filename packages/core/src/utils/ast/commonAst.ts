import {
  identifier,
  importDeclaration,
  importDefaultSpecifier,
  newExpression,
  objectProperty,
  stringLiteral,
  callExpression,
} from "@babel/types";

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
 * 封装遍历ast中ExportDefaultDeclaration的通用函数
 * @param {object} path
 * @param {object} t
 * @param {string} content 要包裹导出的字符串
 */
export const exportDefaultDeclarationUtils = (path: any, t: any, content: string) => {
  const declaration = path.node.declaration;
  path.node.declaration = t.callExpression(t.identifier(content), [declaration]);
};
