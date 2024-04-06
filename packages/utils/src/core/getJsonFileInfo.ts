import { readFileSync, existsSync } from "fs";

/**
 * 获取 JSON 文件信息。
 * @param router JSON 文件路径。
 * @returns JSON 文件的内容。
 */
export function getJsonFileInfo(router: string) {
  if (existsSync(router)) return JSON.parse(readFileSync(router).toString());
}
