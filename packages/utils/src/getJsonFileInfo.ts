import { readFileSync, existsSync } from "fs";

export default function getJsonFileInfo(router: string) {
  if (existsSync(router)) return JSON.parse(readFileSync(router).toString());
}
