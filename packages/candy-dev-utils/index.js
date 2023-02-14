const path = require("path");
const fs = require("fs");
const getIPAddress = require("./getIpAddress");
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const isUseTypescript = fs.existsSync(resolveApp("./tsconfig.json"));

const devServerConfig = {
  host: "0.0.0.0",
  hot: true,
  compress: true, // 是否启用 gzip 压缩
  historyApiFallback: true, // 解决前端路由刷新404现象
  client: {
    logging: "info",
    overlay: false,
  },
};

module.exports = {
  resolveApp,
  isUseTypescript,
  devServerConfig,
  getIPAddress,
};
