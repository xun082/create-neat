import Generator from "./Generator";
import GeneratorAPI from "./GeneratorAPI";

interface ConfigFileData {
  file: Record<string, string[]>;
}

/**
 * @description 为 Generator 类提供辅助功能，用于操纵模板数据、管理依赖和配置
 * @param generator Generator实例
 */
class TemplateAPI {
  /**
   * 临时的依赖数据，需要调用 GeneratorAPI 的 extendPackage 方法将其应用到 package.json 中。
   * @private
   * @type {object}
   */
  private packageData = { dependencies: {}, devDependencies: {}, scripts: {} };
  /**
   * 临时的配置文件数据，需要调用 Generator 的 extendConfigFile 方法将其应用到模板中。
   * @private
   * @type {Record<string, ConfigFileData>}
   */
  private configFilesData: Record<string, ConfigFileData> = {};
  private generator: Generator;
  private generatorAPI: GeneratorAPI;

  constructor(generator: Generator) {
    this.generator = generator;
    this.generatorAPI = new GeneratorAPI(generator);
  }

  /**
   * 添加依赖。
   * @method
   * @param {string} name - 依赖名称。
   * @param {string} [version="latest"] - 依赖版本。
   */
  addDependency(name: string, version: string = "latest") {
    this.packageData.dependencies[name] = version;
  }

  /**
   * 添加开发依赖。
   * @method
   * @param {string} name - 依赖名称。
   * @param {string} [version="latest"] - 依赖版本。
   */
  addDevDependency(name: string, version: string = "latest") {
    this.packageData.devDependencies[name] = version;
  }

  /**
   * 添加脚本。
   * @method
   * @param {string} name - 脚本名称。
   * @param {string} command - 脚本命令。
   */
  addScript(name: string, command: string) {
    this.packageData.scripts[name] = command;
  }

  /**
   * 扩展 package.json。
   * @method
   * @param {object} fields - 需要扩展的字段。
   */
  extendPackage(fields: object) {
    Object.assign(this.packageData, fields);
  }

  /**
   * 扩展配置文件。
   * @method
   * @param {string} fileName - 配置文件名称。
   * @param {ConfigFileData} data - 配置文件数据。
   */
  extendConfigFile(fileName: string, data: ConfigFileData) {
    // 如果不存在，则初始化
    if (!this.configFilesData[fileName]) this.configFilesData[fileName] = { file: {} };
    Object.assign(this.configFilesData[fileName], data);
  }

  /**
   * 调用 Generator 的方法来将收集到的数据应用到模板和配置文件中。
   * @method
   */
  generateFiles() {
    // 1. 将依赖数据应用到 package.json 中
    this.generatorAPI.extendPackage(this.packageData);

    // 2. 将配置文件数据应用到模板中
    for (const [fileName, data] of Object.entries(this.configFilesData)) {
      this.generator.extendConfigFile(fileName, data);
    }
  }
  /**
   * 提供一个获取当前收集状态的方法，供 Generator 在渲染前查询。
   * @method
   * @returns {object} 当前收集状态的数据。
   */
  getTemplateData() {
    return {
      packageData: this.packageData,
      configFilesData: this.configFilesData,
    };
  }
}

export default TemplateAPI;
