import { LintParams } from "../types";
import formatCode from "../config/prettierFormat";
// import { exec } from "node:child_process";

export async function lintProject(_options: LintParams): Promise<void> {
  await formatCode();
  // console.log(join(resolveApp(""), "src/index.ts"));
  // console.log(`prettier --write ${join(resolveApp(""), "src/index.ts")}`);
  // exec(
  //   `prettier --write ${join(resolveApp(""), "src/index.ts")}`,
  //   async (error, stdout: string, stderr) => {
  //     console.log(error);
  //     console.log("🚀 ~ file: lint.ts:8 ~ exec ~ stderr:", stderr);
  //     console.log("🚀 ~ file: lint.ts:8 ~ exec ~ stdout:", stdout);
  //   }
  // );
  // exec(
  //   [
  //     "pnpm",
  //     "eslint",
  //     "--color",
  //     "--ignore-pattern",
  //     "**/node_modules/*",
  //     "--ignore-pattern",
  //     "**/*.d.ts",
  //     "--ext",
  //     ".ts",
  //     "--ext",
  //     ".tsx",
  //     "--cache",
  //     "--cache-location",
  //     "node_modules",
  //     "src",
  //   ].join(" "),
  //   { cwd: resolveApp("") }
  // );
}
