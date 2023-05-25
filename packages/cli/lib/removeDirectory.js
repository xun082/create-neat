import { deleteSync } from "del";
import { resolveApp } from "@obstinate/utils";
import chalk from "chalk";

/**
 * @author moment
 * @param router 删除文件的路径,默认 node_modules
 */
export default function removeDirectory(router = "node_modules", flag = true) {
  if (flag) console.log(chalk.blue(`${router} 文件正在删除,请骚等......`));
  deleteSync([resolveApp(`${router}`)], {
    force: true,
  });
  if (flag) console.log(chalk.green(`\n${router} 删除成功`));
}
