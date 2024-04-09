export default class ConfigTransform {
  private fileDesc; // 文件类型描述
  constructor(fileDesc) {
    this.fileDesc = fileDesc.file;
  }

  thransform(value, files, context) {
    const file = this.getDefaultFile();
    const { type, filename } = file;
    const transform = transforms[type];
    const content = transform.write(filename, context, value);
    return {
      filename,
      content,
    };
  }

  getDefaultFile() {
    const [type] = Object.keys(this.fileDesc);
    const [filename] = this.fileDesc[type];
    return { type, filename };
  }
}

const transformJS = {
  write(filename, context, value) {
    return `module.exports = ${JSON.stringify(value, null, 2)}`;
  },
};

const transforms = {
  js: transformJS,
};
