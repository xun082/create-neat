const template: string[] = [
  "common-lib",
  "react-ui",
  "react-web-js",
  "react-web-ts",
  "vue-web-js",
  "vue-web-ts",
  "commit",
];

export const packageVersion = "1.0.1";

function getProjectLink(templates: string[]): Map<string, string> {
  const map = new Map();
  templates.forEach((template: string) => {
    map.set(
      template,
      `https://registry.npmjs.org/@laconic/template-${template}/-/template-${template}-${packageVersion}.tgz`
    );
  });
  return map;
}

export const projectLink: Map<string, string> = new Map(
  getProjectLink(template)
);
