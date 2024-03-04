import { RollupOptions, OutputOptions } from "rollup";
import * as fs from "fs-extra";
// import { concatAllArray } from "jpjs";
import { resolveApp } from "@laconic/utils";

import { InnOptions, NormalizedOptions } from "../types";

import { createRollupConfig } from "./rollupConfig";

let InnConfig = {
  rollup(config: RollupOptions, _options: InnOptions) {
    return config;
  },
};

const userRollupConfig = resolveApp("rollup.config.js");
if (fs.existsSync(userRollupConfig)) InnConfig = require(userRollupConfig);

export async function createBuildConfigs(options: NormalizedOptions): Promise<any> {
  const allInputs = options.input
    .map((input: string) =>
      createAllFormats(options, input).map((options: InnOptions, index: number) => ({
        ...options,
        writeMeta: index === 0,
        // 确保这里包含 output 属性
        output: {
          /* 这里填入 OutputOptions 需要的字段 */
        },
      })),
    )
    .flat();

  return await Promise.all(
    allInputs.map(async (options: InnOptions & { output: OutputOptions }, index: number) => {
      const config = await createRollupConfig(options, index);

      // 确保 config 对象包含 output 属性，并且该属性符合 OutputOptions 类型
      // 这可能需要你调整 createRollupConfig 和 InnConfig.rollup 的实现
      return InnConfig.rollup(config, options);
    }),
  );
}

function createAllFormats(opts: NormalizedOptions, input: string): [InnOptions, ...InnOptions[]] {
  return [
    opts.format.includes("cjs") && {
      ...opts,
      format: "cjs",
      env: "development",
      input,
    },
    opts.format.includes("cjs") && {
      ...opts,
      format: "cjs",
      env: "production",
      input,
    },
    opts.format.includes("esm") && { ...opts, format: "esm", input },
    opts.format.includes("umd") && {
      ...opts,
      format: "umd",
      env: "development",
      input,
    },
    opts.format.includes("umd") && {
      ...opts,
      format: "umd",
      env: "production",
      input,
    },
    opts.format.includes("system") && {
      ...opts,
      format: "system",
      env: "development",
      input,
    },
    opts.format.includes("system") && {
      ...opts,
      format: "system",
      env: "production",
      input,
    },
  ].filter(Boolean) as [InnOptions, ...InnOptions[]];
}
