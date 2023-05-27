import { readFileSync } from "fs";
import resolveApp from "./getPaths";

const packageInfo: any = JSON.parse(
  readFileSync(resolveApp("./package.json")).toString()
);

export default packageInfo;
