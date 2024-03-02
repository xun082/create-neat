import { LintParams } from "../types";
import formatCode from "../config/prettierFormat";

export async function lintProject(_options: LintParams): Promise<void> {
  await formatCode();
}
