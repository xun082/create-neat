const globalProtocol = {
  ENTRY_FILE: "ENTRY_FILE", // 入口文件配置，如：入口文件引入全局 less、scss
};

// 插件对框架的协议
exports.pluginToTemplateProtocol = {
  ...globalProtocol,
};

// 插件对构建工具的协议
exports.pluginToBuildToolProtocol = {
  ...globalProtocol,
  ADD_CONFIG: "ADD_CONFIG",
};
// 框架对构建工具的协议
exports.templateToBuildToolProtocol = {
  ...globalProtocol,
  ADD_CONFIG: "ADD_CONFIG", //根据框架，不同的打包工具需要不同的插件，有些是都需要用的，有些是框架独有的
};
