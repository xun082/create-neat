import fs from "fs";
import path from "path";

/**
 * 删除指定目录下所有子文件
 * @param {*} path
 */
export default function removeDirectory(url) {
  /**
   * 返回文件和子目录的数组
   */
  const files = fs.readdirSync(url);

  files.forEach(function (file, index) {
    const curPath = path.join(url, file);
    /**
     * fs.statSync同步读取文件夹文件，如果是文件夹，在重复触发函数
     */
    if (fs.statSync(curPath).isDirectory()) removeDirectory(curPath);
    else fs.unlinkSync(curPath);
  });
  fs.rmdirSync(url);
}
