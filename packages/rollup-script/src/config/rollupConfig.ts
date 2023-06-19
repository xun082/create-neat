import { safePackageName, safeVariableName, external } from "../utils";
import { resolveApp } from "@laconic/utils";
import { RollupOptions } from "rollup";
import { terser } from "rollup-plugin-terser";
import { DEFAULT_EXTENSIONS as DEFAULT_BABEL_EXTENSIONS } from "@babel/core";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve, {
  DEFAULTS as RESOLVE_DEFAULTS,
} from "@rollup/plugin-node-resolve";
import sourceMaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import ts from "typescript";

import { extractErrors } from "../utils/errors/extractErrors";
import { babelPluginsConfig } from "./babelConfig";
import { InnOptions } from "../types";

const errorCodeOpts = {
  errorMapFilePath: resolveApp("errors/codes.json"),
};

let shebang: any = {};

export async function createRollupConfig(
  options: InnOptions,
  outputNumber: number
): Promise<RollupOptions> {
  const findAndRecordErrorCodes = await extractErrors({
    ...errorCodeOpts,
    ...options,
  });

  const isEsm = options.format.includes("es") || options.format.includes("esm");

  const shouldMinify =
    options.minify !== undefined
      ? options.minify
      : options.env === "production" || isEsm;

  const formatString = ["esm", "cjs"].includes(options.format)
    ? ""
    : options.format;
  const fileExtension = options.format === "esm" ? "mjs" : "cjs";

  const outputName = [
    resolveApp(`dist/${safePackageName(options.name)}`),
    formatString,
    options.env,
    shouldMinify ? "min" : "",
    fileExtension,
  ]
    .filter(Boolean)
    .join(".");

  const tsconfigPath = options.tsconfig || resolveApp("tsconfig.json");
  const tsconfigJson = ts.readConfigFile(tsconfigPath, ts.sys.readFile).config;
  const tsCompilerOptions = ts.parseJsonConfigFileContent(
    tsconfigJson,
    ts.sys,
    "./"
  ).options;

  return {
    input: options.input,
    external: (id: string) => {
      if (id.startsWith("regenerator-runtime")) return false;
      return external(id);
    },
    treeshake: {
      propertyReadSideEffects: false,
    },
    output: {
      file: outputName,
      format: options.format,
      freeze: false,
      esModule: Boolean(tsCompilerOptions?.esModuleInterop),
      name: options.name || safeVariableName(options.name),
      sourcemap: true,
      globals: {
        react: "React",
        "react-native": "ReactNative",
        "lodash-es": "lodashEs",
        "lodash/fp": "lodashFp",
      },
      exports: "named",
    },
    plugins: [
      !!options.extractErrors && {
        async transform(code: string) {
          try {
            await findAndRecordErrorCodes(code);
          } catch (e) {
            return null;
          }
          return { code, map: null };
        },
      },
      resolve({
        mainFields: [
          "module",
          "main",
          options.target !== "node" ? "browser" : undefined,
        ].filter(Boolean) as string[],
        extensions: [...RESOLVE_DEFAULTS.extensions, ".cjs", ".mjs", ".jsx"],
      }),
      commonjs({
        // use a regex to make sure to include eventual hoisted packages
        include:
          options.format === "umd"
            ? /\/node_modules\//
            : /\/regenerator-runtime\//,
      }),
      json(),
      {
        transform(code: string) {
          let reg = /^#!(.*)/;
          let match = code.match(reg);

          shebang[options.name] = match ? "#!" + match[1] : "";

          code = code.replace(reg, "");

          return {
            code,
            map: null,
          };
        },
      },
      typescript({
        typescript: ts,
        tsconfig: options.tsconfig,
        tsconfigDefaults: {
          exclude: [
            // all TS test files, regardless whether co-located or in test/ etc
            "**/*.spec.ts",
            "**/*.test.ts",
            "**/*.spec.tsx",
            "**/*.test.tsx",
            // TS defaults below
            "node_modules",
            "bower_components",
            "jspm_packages",
            resolveApp("dist"),
          ],
          compilerOptions: {
            sourceMap: true,
            declaration: true,
            jsx: "react",
          },
        },
        tsconfigOverride: {
          compilerOptions: {
            // TS -> esnext, then leave the rest to babel-preset-env
            target: "esnext",
            // don't output declarations more than once
            ...(outputNumber > 0
              ? { declaration: false, declarationMap: false }
              : {}),
          },
        },
        check: !options.transpileOnly && outputNumber === 0,
        useTsconfigDeclarationDir: Boolean(tsCompilerOptions?.declarationDir),
      }),
      babelPluginsConfig({
        exclude: "node_modules/**",
        extensions: [...DEFAULT_BABEL_EXTENSIONS, "ts", "tsx"],
        passPerPreset: true,
        custom: {
          targets: options.target === "node" ? { node: "14" } : undefined,
          extractErrors: options.extractErrors,
          format: options.format,
        },
        babelHelpers: "bundled",
      }),
      replace({
        preventAssignment: true,
        "process.env.NODE_ENV": JSON.stringify(options.env),
      }),
      sourceMaps(),

      shouldMinify &&
        terser({
          output: { comments: false },
          compress: {
            keep_infinity: true,
            pure_getters: true,
            passes: 10,
          },
          ecma: options.legacy ? 5 : 2020,
          module: isEsm,
          toplevel: options.format === "cjs" || isEsm,
          warnings: true,
        }),
      {
        renderChunk: async (code: string, chunk: any) => {
          if (chunk.exports.includes("default") || !isEsm) {
            return null;
          }

          return {
            code: `${code}\nexport default {};`,
            map: null,
          };
        },
      },
    ],
  };
}
