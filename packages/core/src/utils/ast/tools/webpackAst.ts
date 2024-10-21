import { Build_Tool } from "../../../constants/ast";

import { BaseAst } from "./baseAst";

export class WebpackAst extends BaseAst {
  constructor(options, ast) {
    super(Build_Tool.WEBPACK, options, ast);
  }
}
