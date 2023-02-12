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
