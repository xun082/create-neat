import chalk from "chalk";

export function isRemoveExitMatter(matter) {
  return [
    {
      type: "list",
      name: "action",
      message: `Target directory ${chalk.cyan(
        matter
      )} already exists. Pick an action:`,
      choices: [
        { name: "Overwrite", value: true },
        { name: "Cancel", value: false },
      ],
    },
  ];
}

export const createAppType = [
  {
    type: "list",
    name: "language",
    message: "选择js或者ts",
    choices: [
      { name: "JavaScript", value: "js" },
      { name: "TypeScript", value: "ts" },
    ],
  },
  {
    type: "list",
    name: "tool",
    message: "Select the package management tool you will use:",
    choices: ["npm", "yarn", "cnpm", "pnpm"],
  },
  {
    type: "list",
    name: "template",
    message: "Please select the project template that you will use:",
    choices: ["default", "axios"],
  },
];

export const commitType = [
  {
    type: "list",
    name: "commit",
    message: "请选择文件提交类型",
    choices: [
      { name: "feat: 增加新功能", value: "feat" },
      { name: "fix: 修复bug", value: "fix" },
      {
        name: "build: 修改webpack配置等",
        value: "build",
      },
      { name: "docs: 文档更新", value: "docs" },
      { name: "perf: 性能，体验优化", value: "perf" },
      { name: "feat: 增加新功能", value: "feat" },
      { name: "style: 增加新功能", value: "style" },
    ],
  },
  {
    type: "input",
    message: "请输入要提交的信息",
    name: "commitInfo",
  },
];
