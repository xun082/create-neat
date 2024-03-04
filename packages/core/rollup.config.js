import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        entryFileNames: "[name].js",
        format: "esm",
        dir: "dist",
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }), // 指定 tsconfig.json
      del({ targets: "dist/*" }),
      terser(),
      resolve({
        preferBuiltins: true,
      }),
      commonjs(),
      json(),
    ],
    external: ["@laconic/utils"],
  },
];
