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
    message:
      "Please select the language in which your project will be developed:",
    choices: [
      { name: "JavaScript", value: "js" },
      { name: "TypeScript", value: "ts" },
    ],
  },
  {
    type: "list",
    name: "tool",
    message: "Select the package management tool you will use:",
    choices: ["pnpm", "npm", "yarn", "cnpm"],
  },
  {
    type: "list",
    name: "template",
    message: "Please select the project template that you will use:",
    choices: ["default"],
  },
  {
    type: "list",
    name: "lint",
    message: "是否需要添加代码校验:",
    choices: [
      { name: "yes", value: true },
      { name: "no", value: false },
    ],
  },
];

export const mkdirFileName = [
  {
    type: "input",
    message: "Please enter the file name you want to create:",
    name: "filename",
  },
];
