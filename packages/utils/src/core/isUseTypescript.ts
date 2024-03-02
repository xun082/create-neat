import fs from "node:fs";

import { resolveApp } from "./getResolveApp";

const isUseTypescript: boolean = fs.existsSync(resolveApp("./tsconfig.json"));

export { isUseTypescript };
