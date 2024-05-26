/**
 * 包含可用模板的名称列表。
 * @type {string[]}
 */
const template: string[] = [
  "common-lib",
  "react-ui",
  "react-web-js",
  "react-web-ts",
  "vue-web-js",
  "vue-web-ts",
  "commit",
];
/**
 * 包版本号。
 * @constant {string}
 */
export const packageVersion = "1.0.1";
/**
 * 根据模板名称生成对应的项目链接。
 * @param {string[]} templates - 模板名称列表。
 * @returns {Map<string, string>} 包含模板名称和对应项目链接的映射。
 */
const getProjectLink = (templates: string[]): Map<string, string> =>
  new Map(
    templates.map((template) => [
      template,
      `https://registry.npmjs.org/@laconic/template-${template}/-/template-${template}-${packageVersion}.tgz`,
    ]),
  );
/**
 * 包含模板名称和对应项目链接的映射。
 * @type {Map<string, string>}
 */
export const projectLink: Map<string, string> = getProjectLink(template);
/**
 * 相对于根目录的路径。
 * @constant {string}
 */
export const relativePathToRoot = "../../../../";

export const webpackConfigDevDependencies = {
  webpack: "^5.91.0",
};
