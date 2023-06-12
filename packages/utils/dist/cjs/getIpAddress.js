"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_os_1 = __importDefault(require("node:os"));
function getIPAddress() {
    const interfaces = node_os_1.default.networkInterfaces();
    for (const devName in interfaces) {
        const iface = interfaces[devName];
        for (let i = 0; i < iface.length; i++) {
            const alias = iface[i];
            if (alias.family === "IPv4" &&
                alias.address !== "127.0.0.1" &&
                !alias.internal) {
                return alias.address;
            }
        }
    }
}
exports.default = getIPAddress;
