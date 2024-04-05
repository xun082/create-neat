import os from "node:os";

/**
 * 获取本地计算机的 IPv4 地址。
 * 
 * @returns IPv4 地址的字符串表示形式。
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
