import packageInfo from "./getPackageInfo";

function useCssPreset(preset: string) {
  return (
    packageInfo.dependencies.hasOwnProperty(preset) ||
    packageInfo.devDependencies.hasOwnProperty(preset)
  );
}

export default useCssPreset;
