import { readFileSync } from "fs";
import resolveApp from "./getPaths";

const packageInfo: any = JSON.parse(
  readFileSync(resolveApp("./package.json")).toString()
);

function useCssPreset(preset) {
  return (
    packageInfo.dependencies.hasOwnProperty(preset) ||
    packageInfo.devDependencies.hasOwnProperty(preset)
  );
}

export default useCssPreset;
