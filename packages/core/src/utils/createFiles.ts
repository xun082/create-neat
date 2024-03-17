
import fs from "fs-extra";
import path from "path";

/**
 * @description 生成一系列指定的文件
 * @param dir 生成目录
 * @param files 文件名
 * @example await createFiles(dir, {'.tsconfig': tsConfig })
 */

async function createFiles(dir, files) {
  Object.keys(files).forEach((name) => {
    const filePath = path.join(dir, name);
    fs.ensureDirSync(path.dirname(filePath));
    fs.writeFileSync(filePath, files[name]);
  });
}

export { createFiles };
