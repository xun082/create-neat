import { traverse } from "@babel/traverse";

import { Options, BuildToolType } from "../../../types/ast";

export class BaseAst {
  protected buildTool: BuildToolType;
  protected options: Options;
  protected ast: any;

  constructor(buildTool: BuildToolType, options: Options, ast) {
    this.buildTool = buildTool;
    this.options = options;
    this.ast = ast;
  }

  mergeConfig() {
    traverse(this.ast, {});
  }
}
