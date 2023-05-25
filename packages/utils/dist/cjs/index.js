"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUseTypescript = exports.devServerConfig = exports.resolveApp = exports.getIPAddress = void 0;
const getIpAddress_1 = __importDefault(require("./getIpAddress"));
exports.getIPAddress = getIpAddress_1.default;
const getPaths_1 = __importDefault(require("./getPaths"));
exports.resolveApp = getPaths_1.default;
const devServerConfig_1 = __importDefault(require("./devServerConfig"));
exports.devServerConfig = devServerConfig_1.default;
const isUseTypescript_1 = __importDefault(require("./isUseTypescript"));
exports.isUseTypescript = isUseTypescript_1.default;
