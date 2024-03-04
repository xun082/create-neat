import { rollup } from "rollup";

import { BuildOptions, buildConfigsType } from "../types";
import { createBuildConfigs } from "../config/createBuildConfig";
import { logError } from "../utils";

import {
  normalizeOptions,
  cleanDistFolder,
  createProgressEstimator,
  writeCjsEntryFile,
  writeMjsEntryFile,
  moveTypes,
} from "./helper";

export default async function buildProject(dirtyOptions: BuildOptions) {
  const options = await normalizeOptions(dirtyOptions);
  const buildConfigs = await createBuildConfigs(options);

  await cleanDistFolder();

  const logger = await createProgressEstimator();

  if (options.format.includes("cjs")) {
    const promise = writeCjsEntryFile(options.name).catch(logger);
    logger(promise, "Creating CJS entry file");
  }

  if (options.format.includes("esm")) {
    const promise = writeMjsEntryFile(options.name).catch(logError);
    logger(promise, "Creating MJS entry file");
  }
  try {
    const promise = map(buildConfigs, async (inputOptions: buildConfigsType) => {
      const bundle = await rollup(inputOptions);
      await bundle.write(inputOptions.output);
    })
      .catch((e: any) => {
        throw e;
      })
      .then(() => {
        moveTypes();
      });

    logger(promise, "Building modules");
    await promise;
  } catch (error: any) {
    logError(error);
    process.exit(1);
  }
}

function map(array: buildConfigsType[], mapper: any) {
  return Promise.all(array.map(mapper));
}
