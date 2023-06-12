import path from "node:path";
import resolveApp from "./getPaths";
import fs from "node:fs";
import crypto from "node:crypto";
function readEnvFile(file, type) {
    if (!fs.existsSync(file)) {
        throw new Error(`You specified ${type} in your env, but the file "${file}" can't be found.`);
    }
    return fs.readFileSync(file);
}
function validateKeyAndCerts({ cert, key, keyFile, crtFile }) {
    let encrypted;
    try {
        encrypted = crypto.publicEncrypt(cert, Buffer.from("test"));
    }
    catch (err) {
        throw new Error(`The certificate "${crtFile}" is invalid.\n${err.message}`);
    }
    try {
        crypto.privateDecrypt(key, encrypted);
    }
    catch (err) {
        throw new Error(`The certificate key "${keyFile}" is invalid.\n${err.message}`);
    }
}
function getHttpsConfig() {
    const { SSL_CRT_FILE, SSL_KEY_FILE, HTTPS } = process.env;
    const isHttps = HTTPS === "true";
    if (isHttps && SSL_CRT_FILE && SSL_KEY_FILE) {
        const crtFile = path.resolve(resolveApp("."), SSL_CRT_FILE);
        const keyFile = path.resolve(resolveApp("."), SSL_KEY_FILE);
        const config = {
            cert: readEnvFile(crtFile, "SSL_CRT_FILE"),
            key: readEnvFile(keyFile, "SSL_KEY_FILE"),
        };
        validateKeyAndCerts(Object.assign(Object.assign({}, config), { keyFile, crtFile }));
        return config;
    }
    return isHttps;
}
export default getHttpsConfig;
