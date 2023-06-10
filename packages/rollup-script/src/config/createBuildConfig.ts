import { RollupOptions, OutputOptions } from "rollup";
import * as fs from "fs-extra";
import { concatAllArray } from "jpjs";
import { InnOptions, NormalizedOptions } from "../types";
import { createRollupConfig } from "./rollupConfig";
import { resolveApp } from "@obstinate/utils";

let InnConfig = {
  rollup(config: RollupOptions, _options: InnOptions) {
    return config;
  },
};

const userRollupConfig = resolveApp("rollup.config.js");
if (fs.existsSync(userRollupConfig)) InnConfig = require(userRollupConfig);

export async function createBuildConfigs(
  options: NormalizedOptions
): Promise<Array<RollupOptions & { output: OutputOptions }>> {
  const allInputs = concatAllArray(
    options.input.map((input: string) =>
      createAllFormats(options, input).map(
        (options: InnOptions, index: number) => ({
          ...options,
          writeMeta: index === 0,
        })
      )
    )
  );

  return await Promise.all(
    allInputs.map(async (options: InnOptions, index: number) => {
      const config = await createRollupConfig(options, index);

      return InnConfig.rollup(config, options);
    })
  );
}

function createAllFormats(
  opts: NormalizedOptions,
  input: string
): [InnOptions, ...InnOptions[]] {
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
