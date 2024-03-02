export interface PackageJsonType {
  name?: string;
  version?: string;
  description?: string;
  main?: string;
  types?: string;
  scripts?: { [scriptName: string]: string };
  repository?: {
    type: string;
    url: string;
  };
  keywords?: string[];
  author?:
    | string
    | {
        name: string;
        email?: string;
        url?: string;
      };
  license?: string;
  dependencies?: { [packageName: string]: string };
  devDependencies?: { [packageName: string]: string };
  peerDependencies?: { [packageName: string]: string };
  optionalDependencies?: { [packageName: string]: string };
  engines?: {
    node?: string;
    npm?: string;
  };
  config?: { [key: string]: any };
  "lint-staged"?: { [globPattern: string]: string | string[] };
}
