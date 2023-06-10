import { packageInfo, resolveApp } from "@obstinate/utils";
import { createEslintConfig } from "../config/eslintConfig";
import { LintParams } from "../types";
import * as fs from "fs-extra";
import { ESLint } from "eslint";

export async function lintProject(options: LintParams) {
  if (options["_"].length === 0 && !options["write-file"]) {
    const defaultInputs = ["src", "test"].filter(fs.existsSync);
    options["_"] = defaultInputs;
  }

  const config = await createEslintConfig({
    pkg: packageInfo,
  });

  const cli = new ESLint({
    baseConfig: {
      ...config,
      ...require(resolveApp(".eslint.js")),
    },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    fix: options.fix,
    ignorePath: options["ignore-pattern"],
  });
  

  const lintResults = await cli.lintFiles(options["_"]);
  console.log(
    "🚀 ~ file: lint.ts:28 ~ lintProject ~ lintResults:",
    lintResults[1].messages
  );

  if (options.fix) await ESLint.outputFixes(lintResults);

  //   if (options["report-file"]) {
  //     fs.outputFileSync(
  //       options["report-file"],
  //       cli.getFormatter("json")(report.results)
  //     );
  //   }
}
