import fs from "fs-extra";
import path from "path";

/**
 * 生成一系列指定的文件
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

/**
 * 生成 readme 文件
 * @param packageManager 包管理器
 * @param template 框架名称
 * @returns 返回 readme.md 字符串
 */

function createReadmeString(packageManager: string, template: string, fileName: string) {
  try {
    const readmeInfo = fs
      .readFileSync(path.join(__dirname, "../../template/", fileName))
      .toString();
    // 框架首字母大写 Vue React
    const newTemplate = template.charAt(0).toUpperCase() + template.slice(1);
    if (!readmeInfo) throw new Error("README info is undefined.");
    const newReadmeInfo = readmeInfo
      .replace(/\${packageManager}/g, packageManager)
      .replace(/\${template}/g, newTemplate);
    return newReadmeInfo;
  } catch (error) {
    console.error(`Error creating readme.md :`, error);
    process.exit(1);
  }
}

export { createFiles, createReadmeString };
