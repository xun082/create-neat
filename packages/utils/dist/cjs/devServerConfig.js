"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getPaths_1 = __importDefault(require("./getPaths"));
const getHttpsConfig_1 = __importDefault(require("./getHttpsConfig"));
const host = process.env.HOST || "0.0.0.0";
const sockHost = process.env.WDS_SOCKET_HOST;
const sockPath = process.env.WDS_SOCKET_PATH; // default: '/ws'
const sockPort = process.env.WDS_SOCKET_PORT;
const devServerConfig = {
    host,
    hot: true,
    compress: true,
    historyApiFallback: true,
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
    https: (0, getHttpsConfig_1.default)(),
    static: {
        watch: {
            ignored: (0, getPaths_1.default)("src"),
        },
    },
};
exports.default = devServerConfig;
