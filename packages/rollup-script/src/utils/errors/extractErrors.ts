import fs from "fs-extra";
import { parse, ParserOptions } from "@babel/parser";
import traverse from "@babel/traverse";
import { resolveApp } from "@laconic/utils";
import { pascalCase } from "pascal-case";

import { safeVariableName } from "../index";

import { invertObject, evalToString } from "./helper";

const babelParserOptions: ParserOptions = {
  sourceType: "module",
  plugins: ["classProperties", "flow", "jsx", "objectRestSpread", "trailingFunctionCommas"],
} as ParserOptions;

export async function extractErrors(options: any) {
  if (!options || !options.errorMapFilePath) {
    throw new Error("Missing options. Ensure you pass an object with `errorMapFilePath`.");
  }

  if (!options.name || !options.name) {
    throw new Error("Missing options. Ensure you pass --name flag to rollup-script");
  }

  const errorMapFilePath = options.errorMapFilePath;
  let existingErrorMap: any;

  try {
    const fileContents = await fs.readFile(errorMapFilePath, "utf-8");
    existingErrorMap = JSON.parse(fileContents);
  } catch (e) {
    existingErrorMap = {};
  }

  const allErrorIDs = Object.keys(existingErrorMap);
  let currentID: any;

  if (allErrorIDs.length === 0) {
    currentID = 0;
  } else {
    currentID = Math.max.apply(null, allErrorIDs as any) + 1;
  }

  existingErrorMap = invertObject(existingErrorMap);

  function transform(source: string) {
    const ast = parse(source, babelParserOptions);

    traverse(ast, {
      CallExpression: {
        exit(astPath: any) {
          if (astPath.get("callee").isIdentifier({ name: "invariant" })) {
            const node = astPath.node;

            // error messages can be concatenated (`+`) at runtime, so here's a
            // trivial partial evaluator that interprets the literal value
            const errorMsgLiteral = evalToString(node.arguments[1]);
            addToErrorMap(errorMsgLiteral);
          }
        },
      },
    });
  }

  function addToErrorMap(errorMsgLiteral: any) {
    if (Object.prototype.hasOwnProperty.call(existingErrorMap, errorMsgLiteral)) {
      return;
    }
    existingErrorMap[errorMsgLiteral] = "" + currentID++;
  }

  async function flush() {
    const prettyName = pascalCase(safeVariableName(options.name));
    // Ensure that the ./src/errors directory exists or create it
    await fs.ensureDir(resolveApp("errors"));

    // Output messages to ./errors/codes.json
    await fs.writeFile(
      errorMapFilePath,
      JSON.stringify(invertObject(existingErrorMap), null, 2) + "\n",
      "utf-8",
    );

    // Write the error files, unless they already exist
    await fs.writeFile(
      resolveApp("/ErrorDev.js"),
      `
function ErrorDev(message) {
  const error = new Error(message);
  error.name = 'Invariant Violation';
  return error;
}

export default ErrorDev;
      `,
      "utf-8",
    );

    await fs.writeFile(
      resolveApp("/ErrorProd.js"),
      `
function ErrorProd(code) {
  // TODO: replace this URL with yours
  let url = 'https://reactjs.org/docs/error-decoder.html?invariant=' + code;
  for (let i = 1; i < arguments.length; i++) {
    url += '&args[]=' + encodeURIComponent(arguments[i]);
  }
  return new Error(
    \`Minified ${prettyName} error #$\{code}; visit $\{url} for the full message or \` +
      'use the non-minified dev environment for full errors and additional ' +
      'helpful warnings. '
  );
}

export default ErrorProd;
`,
      "utf-8",
    );
  }

  return async function extractErrors(source: any) {
    transform(source);
    await flush();
  };
}
