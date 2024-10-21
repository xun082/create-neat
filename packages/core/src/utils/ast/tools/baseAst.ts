import { traverse } from "@babel/traverse";

import { Options, BuildToolType } from "../../../types/ast";

export class BaseAst {
  buildTool: BuildToolType;
  options: Options;
  ast: any;

  constructor(buildTool: BuildToolType, options: Options, ast) {
    this.buildTool = buildTool;
    this.options = options;
    this.ast = ast;
  }

  mergeConfig() {
    traverse(this.ast, {});
  }
}
