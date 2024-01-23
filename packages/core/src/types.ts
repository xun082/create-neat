export interface PackageJson {
  name?: string;
  dependencies?: { [packageName: string]: string };
  version: string;
  devDependencies?: { [packageName: string]: string };
  engines?: {
    node?: string;
  };
  author?: string;
  peerDependencies?: Object;
  config?: Object;
  'lint-staged'?: Object;
}
