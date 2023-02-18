import { createRequire } from "module";
const require = createRequire(import.meta.url);

const getCliPackageInfo = require("../package.json");

export { getCliPackageInfo };
