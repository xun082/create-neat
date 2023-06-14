interface selectTypes {
  value: string;
  label: string;
  hint?: string;
}

export const ProjectType: selectTypes[] = [
  { value: "common-lib", label: "common-lib", hint: "普通库 🚀" },
  { value: "react-ui", label: "react-ui", hint: "react ui 组件库 🚀" },
  {
    value: "react-web-js",
    label: "react-web-js",
    hint: "react+jsx web应用程序 🚀",
  },
  {
    value: "react-web-ts",
    label: "react-web-ts",
    hint: "react+tsx web应用程序 🚀",
  },
  { value: "vue-web-js", label: "vue-web-js", hint: "vue+js web应用程序 🚀" },
  { value: "vue-web-ts", label: "vue-web-ts", hint: "vue+ts web应用程序 🚀" },
];

export const packageManage: selectTypes[] = [
  {
    value: "npm",
    label: "npm",
  },
  {
    value: "yarn",
    label: "yarn",
  },
  {
    value: "pnpm",
    label: "pnpm",
  },
  {
    value: "cnpm",
    label: "cnpm",
  },
];
