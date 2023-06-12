"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const appDirectory = node_fs_1.default.realpathSync(process.cwd());
function resolveApp(relativePath) {
    return node_path_1.default.resolve(appDirectory, relativePath);
}
exports.default = resolveApp;
