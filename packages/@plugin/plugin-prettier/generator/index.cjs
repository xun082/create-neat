module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    prettier: {
        tabWidth: 2,                // 每个缩进级别的空格数
        printWidth: 80,             // 每行代码的最大长度
        useTabs: false,             // 使用空格代替制表符进行缩进
        semi: true,                 // 在语句末尾添加分号
        singleQuote: true,          // 使用单引号代替双引号  
    },
    devDependencies: {
      "prettier": "^3.1.0",
    },
    scripts:{
      "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\"",
    }
  });
};
