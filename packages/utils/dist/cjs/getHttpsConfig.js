"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const getPaths_1 = __importDefault(require("./getPaths"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_crypto_1 = __importDefault(require("node:crypto"));
function readEnvFile(file, type) {
    if (!node_fs_1.default.existsSync(file)) {
        throw new Error(`You specified ${type} in your env, but the file "${file}" can't be found.`);
    }
    return node_fs_1.default.readFileSync(file);
}
function validateKeyAndCerts({ cert, key, keyFile, crtFile }) {
    let encrypted;
    try {
        encrypted = node_crypto_1.default.publicEncrypt(cert, Buffer.from("test"));
    }
    catch (err) {
        throw new Error(`The certificate "${crtFile}" is invalid.\n${err.message}`);
    }
    try {
        node_crypto_1.default.privateDecrypt(key, encrypted);
    }
    catch (err) {
        throw new Error(`The certificate key "${keyFile}" is invalid.\n${err.message}`);
    }
}
function getHttpsConfig() {
    const { SSL_CRT_FILE, SSL_KEY_FILE, HTTPS } = process.env;
    const isHttps = HTTPS === "true";
    if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
        const crtFile = node_path_1.default.resolve((0, getPaths_1.default)("."), SSL_CRT_FILE);
        const keyFile = node_path_1.default.resolve((0, getPaths_1.default)("."), SSL_KEY_FILE);
        const config = {
            cert: readEnvFile(crtFile, "SSL_CRT_FILE"),
            key: readEnvFile(keyFile, "SSL_KEY_FILE"),
        };
        validateKeyAndCerts({ ...config, keyFile, crtFile });
        return config;
    }
    return isHttps;
}
exports.default = getHttpsConfig;
