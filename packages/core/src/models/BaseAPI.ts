import fs from "fs";
import path from "path";

import Generator from "./Generator";

interface ConfigFileData {
  file: Record<string, string[]>;
}

/**
 * 通用类，为 generator 和 template 提供 API
 * @param plugin 插件名
 * @param generator 生成器实例
 * @param options 传入的生成器选项
 * @param rootOptions 根目录执行选项
 */
class BaseAPI {
  protected generator: Generator;
  protected configFilesData: Record<string, ConfigFileData> = {};
  protected packageData = { dependencies: {}, devDependencies: {}, scripts: {} };
  private dependenciesKeys = ["dependencies", "devDependencies"];

  constructor(generator: Generator) {
    this.generator = generator;
  }

  /**
   * 添加依赖。
   * @param {string} optionsType - 依赖类型。
   * @param {string} name - 依赖名称。
   * @param {string} [version="latest"] - 依赖版本。
   */
  addDependency(optionsType: string, name: string, version: string = "latest") {
    if (this.dependenciesKeys.indexOf(optionsType) !== -1) {
      this.packageData[optionsType][name] = version;
    }
  }

  /**
   * 删除依赖。
   * @param {string} optionsType - 依赖类型。
   * @param {string} name - 依赖名称。
   */
  removeDependency(optionsType: string, name: string) {
    if (this.dependenciesKeys.indexOf(optionsType) !== -1) {
      delete this.packageData[optionsType][name];
    }
  }

  /**
   * 扩展项目的 package.json
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
    const pkg = this.generator.pkg;
    // 将fields合并到package.json中
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
    this.writeToPackageJSON("package.json", pkg);
  }

  /**
   * 写入 Package.json。
   * @param {string} fileName - 文件名。
   * @param {object} data - 数据源。
   */
  writeToPackageJSON(fileName: string, data: object) {
    const pkgPath = path.resolve(this.generator.getRootDirectory(), fileName);
    try {
      fs.writeFileSync(pkgPath, JSON.stringify(data, null, 2));
    } catch (err) {
      console.error(`Failed to write package.json: ${err}`);
      return;
    }
  }

  /**
   * 调用 Generator 的方法来将收集到的数据应用到模板和配置文件中。
   */
  generateFiles() {
    this.extendPackage(this.packageData);
    for (const [fileName, data] of Object.entries(this.configFilesData)) {
      this.generator.extendConfigFile(fileName, data);
    }
  }

  /**
   * 提供一个获取当前收集状态的方法，供 Generator 在渲染前查询。
   * @returns {object} 当前收集状态的数据。
   */
  getData() {
    return {
      packageData: this.packageData,
      configFilesData: this.configFilesData,
    };
  }
}

export default BaseAPI;
