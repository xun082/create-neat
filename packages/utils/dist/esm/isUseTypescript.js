import fs from "node:fs";
import resolveApp from "./getPaths";
const isUseTypescript = fs.existsSync(resolveApp("./tsconfig.json"));
export default isUseTypescript;
