import fs from "node:fs";
import resolveApp from "./getPaths";

const isUseTypescript: boolean = fs.existsSync(resolveApp("./tsconfig.json"));

export default isUseTypescript;
