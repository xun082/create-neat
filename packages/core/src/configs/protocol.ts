// 插件对框架的协议
exports.pluginToTemplateProtocol = {
  ENTRY_FILE: "ENTRY_FILE", // 入口文件配置，如：入口文件引入全局 less、scss
  // ……
};

// 插件对构建工具的协议
exports.pluginToBuildToolProtocol = {};
// 框架对构建工具的协议
exports.templateToBuildToolProtocol = {
  ENTRY_FILE: "ENTRY_FILE", //入口文件配置，比如根据不同框架引入不同方法
  ADD_CONFIG: "ADD_CONFIG", //根据框架，不同的打包工具需要不同的插件，有些是都需要用的，有些是框架独有的
  ADD_DEPENDENCIES: "ADD_DEPENDENCIES", //框架所需要的依赖，已有现成方法，可以直接调用
};
