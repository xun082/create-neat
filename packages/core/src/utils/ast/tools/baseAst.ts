import { traverse } from "@babel/traverse";

import { ASTOptions } from "../../../types/ast";
import { Build_Tool } from "../../../constants/ast";

export class BaseAst {
  protected buildTool: Build_Tool;
  protected options: ASTOptions;
  protected ast: any;

  constructor(buildTool: Build_Tool, options: ASTOptions, ast) {
    this.buildTool = buildTool;
    this.options = options;
    this.ast = ast;
  }

  mergeConfig() {
    traverse(this.ast, {});
  }
}
