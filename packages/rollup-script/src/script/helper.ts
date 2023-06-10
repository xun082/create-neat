import { resolveApp, packageInfo } from "@obstinate/utils";
import * as fs from "fs-extra";
import { safePackageName } from "../utils";
import { NormalizedOptions, WatchOptions, ModuleFormat } from "../types";
import { concatAllArray } from "jpjs";
import glob from "tiny-glob/sync";
const createLogger = require("progress-estimator");

export async function cleanDistFolder() {
  await fs.remove(resolveApp("dist"));
}

export function writeCjsEntryFile(name: string) {
  const baseLine = `module.exports = require('./${safePackageName(name)}`;
  const contents = `
'use strict'

if (process.env.NODE_ENV === 'production') {
  ${baseLine}.production.min.cjs')
} else {
  ${baseLine}.development.cjs')
}
`;
  return fs.outputFile(resolveApp("dist/index.cjs"), contents);
}

export function writeMjsEntryFile(name: string) {
  const contents = `
export { default } from './${name}.min.mjs';
export * from './${name}.min.mjs';
  `;
  return fs.outputFile(resolveApp("dist/index.mjs"), contents);
}

export async function moveTypes() {
  const appDistSrc = resolveApp("dist/src");

  const pathExists = await fs.pathExists(appDistSrc);
  if (!pathExists) return;

  await fs.copy(appDistSrc, resolveApp("dist"), {
    overwrite: true,
  });

  await fs.remove(appDistSrc);
}

export async function normalizeOptions(
  options: WatchOptions
): Promise<NormalizedOptions> {
  return {
    ...options,
    name: options.name || packageInfo.name,
    input: await getInputs(options.entry, packageInfo.source),
    format: options.format.split(",").map((format: string) => {
      if (format === "es") {
        return "esm";
      }
      return format;
    }) as [ModuleFormat, ...ModuleFormat[]],
  };
}

export async function createProgressEstimator() {
  const cache = resolveApp("node_modules/.cache/.progress-estimator");
  await fs.ensureDir(cache);
  return createLogger({
    storagePath: cache,
  });
}

const isDir = (name: string) =>
  fs
    .stat(name)
    .then((stats) => stats.isDirectory())
    .catch(() => false);

const isFile = (name: string) =>
  fs
    .stat(name)
    .then((stats) => stats.isFile())
    .catch(() => false);

async function jsOrTs(filename: string) {
  const extension = (await isFile(resolveApp(filename + ".ts")))
    ? ".ts"
    : (await isFile(resolveApp(filename + ".tsx")))
    ? ".tsx"
    : (await isFile(resolveApp(filename + ".jsx")))
    ? ".jsx"
    : ".js";

  return resolveApp(`${filename}${extension}`);
}

async function getInputs(
  entries?: string | string[],
  source?: string
): Promise<string[]> {
  return concatAllArray(
    ([] as any[])
      .concat(
        entries && entries.length
          ? entries
          : (source && resolveApp(source)) ||
              ((await isDir(resolveApp("src"))) && (await jsOrTs("src/index")))
      )
      .map((file) => glob(file))
  );
}
