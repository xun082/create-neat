import boxen from "boxen";
import chalk from "chalk";
/**
 * 创建项目成功后显示的信息。
 * @function createSuccessInfo
 * @param {string} name - 项目名称。
 * @param {string} packageManage - 包管理器名称。
 */
export default function createSuccessInfo(name: string, packageManage: string) {
  /**
   * 结束消息，包含项目名称。
   * @type {string}
   */
  const END_MSG = `${chalk.blue(
    "🎉 created project " + chalk.greenBright(name) + " Successfully",
  )}\n\n 🙏 Thanks for using Create-Neat !`;
  /**
   * Boxen 的配置。
   * @type {object}
   */
  const BOXEN_CONFIG = {
    padding: 1,
    margin: { top: 1, bottom: 1 },
    borderColor: "cyan",
    align: "center",
    borderStyle: "double",
    title: "🚀 Congratulations",
    titleAlignment: "center",
  };

  process.stdout.write(boxen(END_MSG, BOXEN_CONFIG as any));

  console.log("👉 Get started with the following commands:");
  console.log(`\n\r\r cd ${chalk.cyan(name)}`);
  console.log(`\r\r ${chalk.cyan(packageManage)} start \r\n`);
}
