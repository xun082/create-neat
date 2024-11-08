const { default: traverse } = require('@babel/traverse');
const t = require('@babel/types');
const babel = require('@babel/core');

/**
 * 在指定节点的前后插入 AST 内容
 * @param {Object} ast - AST 的根节点
 * @param {Object} content - 需要插入的 AST 内容
 * @param {Function} target - 判断目标节点的函数
 * @param {string} position - 插入位置，可以是 'before' 或 'after'
 * @returns {Object} - 修改完成的 AST
 */
function insertAstNode(ast, content, target, position = 'after') {
  traverse(ast, {
    enter(path) {
      // 判断当前节点是否是目标节点
      if (target(path.node)) {
        // 根据 position 参数决定插入的位置
        if (position === 'after') {
          path.insertAfter(content);
        } else if (position === 'before') {
          path.insertBefore(content);
        } else {
          console.error("无效的插入位置，插入失败");
        }
        // 找到目标后停止遍历
        path.stop();
      }
    },
  });

  return ast;
}

// 寻找特殊节点，这两个比较常用一点
const isImportStatement = (node) => t.isImportDeclaration(node);
const isCreateAppAssignment = (node) =>     //实际上是 找到 ‘const app = createApp(App) ’这个语句，需要注意的是 vue2 和 vue3 有可能不同
  t.isVariableDeclaration(node) && 
  node.declarations.length === 1 && 
  t.isVariableDeclarator(node.declarations[0]) && 
  node.declarations[0].id.name === 'app' && 
  t.isCallExpression(node.declarations[0].init) && 
  node.declarations[0].init.callee.name === 'createApp';


// 使用示例

//  Vue3 main.js,这个可以从模板文件获取，或者后期手动组装一个。
const code = `
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)

app.mount('#root')
`;

// 解析代码为 AST
const ast = babel.parseSync(code);

// 要插入的内容，暂时写两个场景，一个是 import，一个是 app.use(),其它特殊需求也是一样的思路，只能看协议使用者怎么找到特殊节点了,这里暂时提供两个比较常用的。
const content = 'app.use(ElementPlus);'
const useElementPlus = babel.parseSync(content);

const importStyle = t.importDeclaration(
  [t.importDefaultSpecifier(t.identifier('style'))],
  t.stringLiteral('./style/index.scss')
);



// 目前只能插入第一个 import 语句
insertAstNode(ast, importStyle, isImportStatement, 'before');

// 在 main 函数之后插入 app.use(ElementPlus)
insertAstNode(ast, useElementPlus, isCreateAppAssignment, 'after');

// 将 AST 转换回代码
const newCode = babel.transformFromAstSync(ast, null, { code: true }).code;
console.log(newCode);

module.exports = {
  insertAstNode,
  isImportStatement,
  isCreateAppAssignment
}