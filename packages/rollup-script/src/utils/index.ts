import { isAbsolute, resolve } from "path";
import chalk from "chalk";
import { getJsonFileInfo, resolveApp } from "@laconic/utils";
import { PackageJson } from "../types";

const SCOPE_NAME_REGEXP = /^@(.+)\//;
const BLANK_CHARACTER_REGEXP = /((^[^a-zA-Z]+)|[^\w.-])|([^a-zA-Z0-9]+$)/g;

/**
 * @method 获取获取安全的包名称,用于文件路径中
 */
export function safePackageName(packageName: string): string {
  return packageName
    .toLowerCase()
    .replace(SCOPE_NAME_REGEXP, (_, name) => `${name}-`)
    .replace(BLANK_CHARACTER_REGEXP, "");
}

/**
 * @method 获取包名对应的安全的变量名
 */
export function safeVariableName(packageName: string): string {
  return packageName
    .toLowerCase()
    .replace(SCOPE_NAME_REGEXP, "")
    .replace(/-(.)/g, (_, character: string) => character.toUpperCase())
    .replace(BLANK_CHARACTER_REGEXP, "");
}

/**
 * 获取打包js文件的路径
 *
 * @param outDir 输出目录
 * @param format 打包js的格式
 * @param env 运行环境
 * @returns 打包 js 文件的路径
 */
export function getOutputFilePath(
  outDir: string,
  format: "es" | "cjs" | "umd",
  env: "development" | "production"
): string {
  const packageJson = resolveApp("./package.json");
  if (format === "es") {
    return resolve(
      outDir,
      `${safePackageName(getJsonFileInfo(packageJson).name)}.esm.js`
    );
  }
  return resolve(
    outDir,
    `${safePackageName(getJsonFileInfo(packageJson).name)}.${format}.${env}.js`
  );
}

export function external(id: string): boolean {
  return !id.startsWith(".") && !isAbsolute(id);
}

export function getReactVersion({
  dependencies,
  devDependencies,
}: PackageJson) {
  return (
    (dependencies && dependencies.react) ||
    (devDependencies && devDependencies.react)
  );
}

export function getNodeEngineRequirement({ engines }: PackageJson) {
  return engines && engines.node;
}

const stderr = console.error.bind(console);

export function logError(err: any): void {
  const error = err.error || err;
  const description = `${error.name ? `${error.name}: ` : ""}${
    error.message || error
  }`;
  const message = error.plugin
    ? `(${error.plugin} plugin) ${description}`
    : description;

  stderr(chalk.bold.red(message));

  if (error.loc) {
    stderr();
    stderr(`at ${error.loc.file}:${error.loc.line}:${error.loc.column}`);
  }

  if (error.frame) {
    stderr();
    stderr(chalk.dim(error.frame));
  } else if (err.stack) {
    const headlessStack = error.stack.replace(message, "");
    stderr(chalk.dim(headlessStack));
  }

  stderr();
}
