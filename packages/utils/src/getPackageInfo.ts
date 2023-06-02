import { readFileSync, existsSync } from "fs";
import resolveApp from "./getPaths";

const filePath = resolveApp("./package.json");
const packageInfo: any = JSON.parse(
  existsSync(filePath) ? readFileSync(filePath).toString() : '{}'
);

export default packageInfo;
