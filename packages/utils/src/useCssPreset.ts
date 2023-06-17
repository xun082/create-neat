import getJsonFileInfo from "./getJsonFileInfo";
import resolveApp from "./getJsonFileInfo";

function useCssPreset(preset: string) {
  return (
    getJsonFileInfo(resolveApp("./package.json")).dependencies.hasOwnProperty(
      preset
    ) ||
    getJsonFileInfo(
      resolveApp("./package.json")
    ).devDependencies.hasOwnProperty(preset)
  );
}

export default useCssPreset;
