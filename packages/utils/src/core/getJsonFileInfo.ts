import { readFileSync, existsSync } from "fs";

/**
 * 读取指定 JSON 文件的内容并返回其解析后的对象信息。
 * 
 * @param router - 要读取的 JSON 文件路径。
 * @returns 如果文件存在，则返回解析后的 JSON 对象；否则返回 undefined。
 */
export function getJsonFileInfo(router: string) {
  if (existsSync(router)) return JSON.parse(readFileSync(router).toString());
}
