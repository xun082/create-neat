import fs from "fs";
import path from "path";

import Generator from "./Generator";

/**
 * @description 为执行 generator 提供系一列 api
 * @param plugin 插件名
 * @param generator 生成器实例
 * @param options 传入的生成器选项
 * @param rootOptions 根目录执行选项
 */

class GeneratorAPI {
  private generator: Generator;

  constructor(generator: Generator) {
    this.generator = generator;
  }

  /**
   * @description 扩展项目的 package.json 内容
   * @param fields 合并内容
   * @param {object} [options] 操作选项
   */
  extendPackage(fields: object, options: object = {}) {
    // 扩展 package.json
    // options 就是一个可扩展对象
    const extendOptions = {
      // 是否进行修剪操作
      prune: false,
      // 合并字段
      merge: true,
      // 是否警告不兼容的版本
      warnIncompatibleVersions: true,
      // 是否强制覆盖
      forceOverwrite: false,
      // 传入的配置项
      ...options,
    };
    // 获取当前项目的package.json
    const pkgPath = path.resolve(this.generator.getRootDirectory(), "package.json");
    // 获取当前项目的package.json
    const pkg = this.generator.pkg;
    // 将filds合并到package.json中
    for (const key in fields) {
      const value = fields[key];
      const existing = pkg[key];
      // 如果merge为false或者key不在package.json中 则直接赋值
      if (!extendOptions.merge || !(key in pkg)) {
        pkg[key] = value;
      } else if (Array.isArray(value) && Array.isArray(existing)) {
        // 如果是数组则合并 且去重
        pkg[key] = existing.concat(value.filter((v) => existing.indexOf(v) < 0));
      } else if (typeof value === "object" && typeof existing === "object") {
        // 如果是对象则合并
        pkg[key] = { ...existing, ...value };
      } else {
        pkg[key] = value;
      }
    }
    // 如果prune为true 则删除空字段
    if (extendOptions.prune) {
      for (const key in pkg) {
        if (pkg[key] === null) {
          delete pkg[key];
        }
      }
    }
    // 写入package.json
    try {
      console.log("explosion", pkg);
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    } catch (err) {
      console.error(`Failed to write package.json: ${err}`);
      return;
    }
  }
}

export default GeneratorAPI;
