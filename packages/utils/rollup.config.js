import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import { terser } from "rollup-plugin-terser";
import resolve from "@rollup/plugin-node-resolve";

export default [
  {
    input: "src/index.ts",
    output: [
      {
        entryFileNames: "[name].esm.js",
        format: "esm",
        dir: "dist",
      },
      {
        entryFileNames: "[name].cjs.js",
        dir: "dist",
        format: "cjs",
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json" }), // 指定 tsconfig.json
      del({ targets: "dist/*" }),
      terser(),
      resolve({
        preferBuiltins: true,
      }),
    ],
  },
];
