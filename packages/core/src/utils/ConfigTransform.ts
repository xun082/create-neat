interface ConfigFileData {
  file: Record<string, string[]>;
}

const transformJS = {
  /**
   * @description 写文件
   * @param filename 文件名称
   * @param context 上下文
   * @param value 原始文件值
   * @returns 转化后的文件值
   */
  write(filename, context, value) {
    return `module.exports = ${JSON.stringify(value, null, 2)}`;
  },
};

const transforms = {
  js: transformJS,
};

/**
 * @description 配置文件转化类
 */
export default class ConfigTransform {
  private fileDesc: Record<string, string[]>; // 文件类型描述

  constructor(fileDesc) {
    this.fileDesc = fileDesc.file;
  }

  /**
   * @description 扩展配置文件
   * @param data 配置文件数据
   */
  extend(data: ConfigFileData) {
    this.fileDesc = { ...this.fileDesc, ...data.file };
  }

  /**
   * @description 获取文件类型和文件名
   * @returns {type, filename} type为需要生成的文件类型，filename为文件名
   */
  getDefaultFile() {
    const [type] = Object.keys(this.fileDesc);
    const [filename] = this.fileDesc[type];
    return { type, filename };
  }

  /**
   * @description 文件转化
   * @param value 文件初始内容
   * @param files file tree对象(目前没用到)
   * @param context 上下文
   * @returns {filename, content} filename为文件名 content为转化后的文件内容
   */
  transform(value, files, context) {
    const file = this.getDefaultFile();
    const { type, filename } = file;
    const transform = transforms[type];
    const content = transform.write(filename, context, value);
    return { filename, content };
  }
}
