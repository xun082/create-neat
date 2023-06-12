"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const getPaths_1 = __importDefault(require("./getPaths"));
const isUseTypescript = node_fs_1.default.existsSync((0, getPaths_1.default)("./tsconfig.json"));
exports.default = isUseTypescript;
