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

module.exports = devServerConfig;
