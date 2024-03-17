import { createFiles } from "./createFiles";
import GeneratorAPI from "./GeneratorAPI";
/**
 * @description 生成器，创建
 */

class Generator {
  private rootDirectory: string;
  private plugins: Record<string, any>;
  private files: Record<string, any>;
  private rootOptions: Record<string, any>;

  constructor(rootDirectory, plugins = {}) {
    this.rootDirectory = rootDirectory;
    this.plugins = plugins;
  }

  // 创建所有插件的相关文件
  async generate() {
    // 为每个 plugin 创建 GenerateAPI 实例，调用插件中的 generate
    Object.keys(this.plugins).forEach((plugin) => {
      const generatorAPI = new GeneratorAPI(plugin, this, {}, this.rootOptions);
      console.log(generatorAPI);
      // const pluginGenerator = loadModule(`${plugin}/generator`, this.rootDirectory)

      // 调用 generate
    });

    // 整合需要安装的文件

    // 安装文件
    await createFiles(this.rootDirectory, this.files);
    console.log("Files have been generated and written to disk.");
  }
}

export default Generator;
