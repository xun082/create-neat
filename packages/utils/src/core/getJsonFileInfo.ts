import { readFileSync, existsSync } from "fs";
/**
 * 获取 JSON 文件的信息。
 * @param {string} router JSON 文件的路径。
 * @returns {any | undefined} 如果文件存在，则返回 JSON 内容，否则返回 undefined。
 */
export function getJsonFileInfo(router: string) {
  if (existsSync(router)) return JSON.parse(readFileSync(router).toString());
}
