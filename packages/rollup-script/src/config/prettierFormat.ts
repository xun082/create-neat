import fs from "node:fs";
import path from "node:path";
import prettier from "prettier";
import { ESLint } from "eslint";
import { resolveApp } from "@obstinate/utils";

async function formatFiles(dir: string) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry: any) => {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) formatFiles(fullPath);
    else if (
      (entry.isFile() && path.extname(fullPath) === ".ts") ||
      path.extname(fullPath) === ".tsx" ||
      path.extname(fullPath) === ".js"
    ) {
      formatFile(fullPath);
    }
  });
}

function formatFile(file: string) {
  fs.readFile(file, "utf8", (error: any, code) => {
    if (error) {
      console.error(`Error reading file: ${file}`);
      return;
    }

    const formattedCode = prettier.format(code, { parser: "typescript" });

    fs.writeFile(file, formattedCode, "utf8", (error) => {
      if (error) console.error(`Error writing file: ${file}`);
    });
  });
}

export default async function formatCode() {
  const srcDirectory = resolveApp("src");
  const tsExtname = path.join(srcDirectory, "/**/*.ts");
  const tsxExtname = path.join(srcDirectory, "/**/*.tsx");

  const eslint = new ESLint({ fix: true });
  const lintResults = await eslint.lintFiles([tsExtname, tsxExtname]);

  const formatter = await eslint.loadFormatter("stylish");
  const resultText = formatter.format(lintResults);
  console.log(resultText);

  await ESLint.outputFixes(lintResults);

  await formatFiles(srcDirectory);
}
