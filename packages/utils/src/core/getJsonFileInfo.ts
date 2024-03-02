import { readFileSync, existsSync } from "fs";

export function getJsonFileInfo(router: string) {
  if (existsSync(router)) return JSON.parse(readFileSync(router).toString());
}
