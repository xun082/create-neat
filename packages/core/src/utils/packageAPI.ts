import fs from "fs";

import { createFiles } from "./createFiles";

class packageAPI {
  private filePath: string;

  constructor(filePath: string) {
    this.filePath = filePath;
  }

  // 创建 package.json 文件
  async createPackageJson(content: object) {
    // todo: content 的类型后面约束
    await createFiles(this.filePath, {
      "package.json": JSON.stringify(content, null, 2),
    });
  }

  // 读取 package.json 文件内容
  async readPackageJson(): Promise<object> {
    return new Promise((resolve, reject) => {
      fs.readFile(this.filePath, "utf8", (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  // 更新 package.json 文件内容
  async updatePackageJson(content: object): Promise<string> {
    return new Promise((resolve, reject) => {
      this.readPackageJson()
        .then((data) => {
          const updatedContent = { ...data, ...content };
          return this.createPackageJson(updatedContent);
        })
        .then(() => {
          resolve("package.json file has been updated successfully");
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  // 删除 package.json 文件
  async deletePackageJson(): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.unlink(this.filePath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve("package.json file has been deleted successfully");
        }
      });
    });
  }
}

export default packageAPI;
