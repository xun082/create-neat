module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    devDependencies: {
      typescript: "~5.4.0",
      "@types/node": "^20.11.28",
      "ts-loader": "~9.5.1"
    },
  });
  generatorAPI.render('./template/tsconfig.json')
  //process.env.useTypeScript=true //这样设置环境变量，还是创建一个env文件

};
