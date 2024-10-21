import { Build_Tool } from "../../../constants/ast";

import { BaseAst } from "./baseAst";

export class VitepackAst extends BaseAst {
  constructor(options, ast) {
    super(Build_Tool.VITE, options, ast);
  }
}
