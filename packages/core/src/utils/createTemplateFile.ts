import { readFileSync } from "node:fs";
import { join } from "node:path";

export default function createTemplateFile(file: string) {
  return readFileSync(join(__dirname, "../../template/", file)).toString();
}
