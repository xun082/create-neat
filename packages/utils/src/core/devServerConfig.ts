import { resolveApp } from "./getResolveApp";
/**
 * 主机地址，可以从环境变量中获取，默认为 "0.0.0.0"。
 * @type {string}
 */
const host = process.env.HOST || "0.0.0.0";
/**
 * WebSocket 主机地址，从环境变量中获取。
 * @type {string|undefined}
 */
const sockHost = process.env.WDS_SOCKET_HOST;
/**
 * WebSocket 路径，从环境变量中获取，默认为 '/ws'。
 * @type {string|undefined}
 */
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
/**
 * WebSocket 端口，从环境变量中获取。
 * @type {string|undefined}
 */
const sockPort = process.env.WDS_SOCKET_PORT;
/**
 * 开发服务器配置对象。
 * @type {object}
 */
export const devServerConfig = {
  host, // webpack.config.js 文件中的 host 配置优先级最高
  hot: true,
  compress: true, // 是否启用 gzip 压缩
  historyApiFallback: true, // 解决前端路由刷新404现象
  client: {
    webSocketURL: {
      hostname: sockHost,
      pathname: sockPath,
      port: sockPort,
    },
    logging: "info",
    overlay: {
      errors: true,
      warnings: false,
    },
  },
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*",
  },
  // server: "https",
  static: {
    watch: {
      ignored: resolveApp("src"),
    },
  },
};
