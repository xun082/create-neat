import { RollupOptions, OutputOptions } from "rollup";

interface SharedOptions {
  target: "node" | "browser";
  tsconfig?: string;
  extractErrors?: boolean;
}

export type ModuleFormat = "cjs" | "umd" | "esm" | "system";

export interface BuildOptions extends SharedOptions {
  name?: string;
  entry?: string | string[];
  format: "cjs,esm";
  target: "browser";
}

export interface WatchOptions extends BuildOptions {
  verbose?: boolean;
  noClean?: boolean;
  // callback hooks
  onFirstSuccess?: string;
  onSuccess?: string;
  onFailure?: string;
}

export interface NormalizedOptions extends Omit<WatchOptions, "name" | "input" | "format"> {
  name: string;
  input: string[];
  format: [ModuleFormat, ...ModuleFormat[]];
}

export interface InnOptions extends SharedOptions {
  // Name of package
  name: string;
  // path to file
  input: string;
  // Environment
  env: "development" | "production";
  // Module format
  format: ModuleFormat;
  /** If `true`, Babel transpile and emit ES5. */
  legacy: boolean;
  // Is minifying?
  minify?: boolean;
  // Is this the very first rollup config (and thus should one-off metadata be extracted)?
  writeMeta?: boolean;
  // Only transpile, do not type check (makes compilation faster)
  transpileOnly?: boolean;
}

export interface TestOptions {
  config?: string;
}

export interface PackageJson {
  name: string;
  source?: string;
  jest?: any;
  eslint?: any;
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
  engines?: {
    node?: string;
  };
}

export type Many<T> = T | T[];

export type buildConfigsType = RollupOptions & { output: OutputOptions };

export interface LintParams {
  fix: boolean;
  "ignore-pattern": string;
  "write-file": boolean;
  "report-file": string;
  "max-warnings": number;
  _: string[];
}

export interface eslintResult {
  filePath: string;
  messages: unknown;
  errorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  source?: string;
}
