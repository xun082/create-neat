import os from "node:os";
/**
 * 获取本机的 IPv4 地址。
 * @returns {string} 本机的 IPv4 地址。
 */
export function getIPAddress(): string {
  const interfaces = os.networkInterfaces();
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
        return alias.address;
      }
    }
  }
}
