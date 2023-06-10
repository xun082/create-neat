import fs from "fs-extra";
// import path from "node:path";
import { Linter } from "eslint";
import { getReactVersion } from "../utils";
import { resolveApp } from "@obstinate/utils";

interface CreateEslintConfigArgs {
  pkg: any;
}

export async function createEslintConfig({
  pkg,
}: CreateEslintConfigArgs): Promise<Linter.Config | void> {
  const isReactLibrary = Boolean(getReactVersion(pkg));

  const eslintConfig: Linter.Config = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      ecmaFeatures: {
        jsx: true,
        experimentalObjectRestSpread: true,
      },
    },
    env: {
      browser: true,
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
    ],
    rules: {
      "no-var": "error",
    },
    settings: {
      react: {
        version: isReactLibrary ? "detect" : "999.999.999",
      },
    },
  };

  const file = resolveApp(".eslintrc.js");

  try {
    await fs.writeFile(
      file,
      `module.exports = ${JSON.stringify(eslintConfig, null, 2)}`,
      { flag: "wx" }
    );
  } catch (e: any) {
    if (e.code === "EEXIST") {
      console.error(
        "Error trying to save the Eslint configuration file:",
        `${file} already exists.`
      );
    } else {
      console.error(e);
    }

    return eslintConfig;
  }

  return eslintConfig;
}
