declare module "rollup-plugin-babel";
declare module "rollup-plugin-size-snapshot";
declare module "rollup-plugin-terser";
declare module "babel-preset-ts-lib";
declare module "babel-preset-ts-lib/dev";
declare module "babel-preset-ts-lib/production";
declare module "babel-preset-ts-lib/umd";
declare module "rollup-plugin-url";
declare module "@svgr/rollup";
declare module "*.svg";
declare module "@rollup/plugin-image";
declare module "rollup-plugin-sourcemaps";
declare module "@rollup/plugin-json";
declare module "@rollup/plugin-commonjs";
declare module "rollup-plugin-typescript2";
declare module "rollup-plugin-eslint";

declare module "asyncro"; // doesn't have types (unmerged 2+ year old PR: https://github.com/developit/asyncro/pull/10)
declare module "enquirer"; // doesn't have types for Input or Select
declare module "jpjs"; // doesn't ship types (written in TS though)
declare module "tiny-glob/sync"; // /sync isn't typed (but maybe we can use async?)

declare module "@babel/core" {
  export const DEFAULT_EXTENSIONS: string[];
  export function createConfigItem(boop: any[], options: any): any[];
}

// Rollup plugins
declare module "rollup-plugin-terser";
declare module "@babel/traverse";
declare module "@babel/helper-module-imports";

declare module "lodash.merge";
declare module "pascal-case";
