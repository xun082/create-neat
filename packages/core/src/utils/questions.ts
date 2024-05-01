interface ISelectType {
  value: string;
  label: string;
  hint?: string;
}

function createSelectType(value: string, hint?: string): ISelectType {
  return { value, label: value, hint };
}

export const ProjectTypes: ISelectType[] = [
  createSelectType("common-lib", "普通库 🚀"),
  createSelectType("react-ui", "react ui 组件库 🚀"),
  createSelectType("react-web-js", "react+jsx web应用程序 🚀"),
  createSelectType("react-web-ts", "react+tsx web应用程序 🚀"),
  createSelectType("vue-web-js", "vue+js web应用程序 🚀"),
  createSelectType("vue-web-ts", "vue+ts web应用程序 🚀"),
  createSelectType("vue-ui", "vue ui 组件库🚀"),
];

export const PackageManagers: ISelectType[] = [
  { value: "npm", label: "npm" },
  { value: "yarn", label: "yarn" },
  { value: "pnpm", label: "pnpm" },
  { value: "cnpm", label: "cnpm" },
];
