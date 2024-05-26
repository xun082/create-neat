module.exports = (generatorAPI) => {
  generatorAPI.extendPackage({
    prettier: {
        tabWidth: 2,                // 每个缩进级别的空格数
        printWidth: 80,             // 每行代码的最大长度
        useTabs: false,             // 使用空格代替制表符进行缩进
        semi: true,                 // 在语句末尾添加分号
        singleQuote: true,          // 使用单引号代替双引号
        trailingComma: "es5",       // 尾随逗号的使用方式（es5 对象、数组等使用）
        bracketSpacing: true,       // 对象文字中的括号间是否加空格
        arrowParens: "always",      // 箭头函数参数使用圆括号
        endOfLine: "lf"             // 换行符使用 lf (Unix 风格)    
    },
    devDependencies: {
      "@types/prettier": "^3.0.0",
      prettier: "^3.1.0",
    },
    scripts:{
      "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,scss,md}\"",
    }
  });
};
