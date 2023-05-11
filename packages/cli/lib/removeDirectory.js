import fs from "fs";
import path from "path";

export default function removeDirectory(url) {
  const files = fs.readdirSync(url);

  files.forEach(function (file, index) {
    const curPath = path.join(url, file);

    if (fs.statSync(curPath).isDirectory()) removeDirectory(curPath);
    else fs.unlinkSync(curPath);
  });
  fs.rmdirSync(url);
}
