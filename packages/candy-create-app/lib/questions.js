import chalk from "chalk";

export function removeExitMatter(matter, type = "directory") {
  return [
    {
      type: "list",
      name: "action",
      message: `Target ${type} ${chalk.cyan(
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

export const mkdirFileName = [
  {
    type: "input",
    message: "请输入文件名",
    name: "filename",
  },
];
