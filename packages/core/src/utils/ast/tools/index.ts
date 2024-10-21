import { VitepackAst } from "./viteAst";
import { WebpackAst } from "./webpackAst";

export const mergeAst = {
  webpack: (options, ast) => new WebpackAst(options, ast).mergeConfig(),
  vite: (options, ast) => new VitepackAst(options, ast).mergeConfig(),
};
