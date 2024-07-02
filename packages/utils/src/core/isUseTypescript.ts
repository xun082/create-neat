import fs from "node:fs";

import { resolveApp } from "./getResolveApp";
/**
 * 是否使用 TypeScript。
 * @type {boolean}
 */
const isUseTypescript: boolean = fs.existsSync(resolveApp("./tsconfig.json"));

export { isUseTypescript };
