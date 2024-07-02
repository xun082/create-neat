const dotenvExpand = require("dotenv-expand");
const dotenv = require("dotenv");
const fs = require("fs");

const { AppDirectory } = require("./utils");

const NODE_ENV = process.env.NODE_ENV;
// 解析 .env 文件路径
const dotenvFiles = [`${AppDirectory(".env")}.${NODE_ENV}`, AppDirectory(".env")].filter(Boolean);
const userConfigEnv = {};

// 读取并解析 .env 文件
dotenvFiles.forEach((dotenvFile) => {
  if (fs.existsSync(dotenvFile)) {
    dotenvExpand.expand(
      dotenv.config({
        path: dotenvFile,
      }),
    );

    const res = fs.readFileSync(dotenvFile).toString();
    const dotEnvContent = res.split(/\n/).map((str) => str.split("=")[0]);

    dotEnvContent.forEach((key) => {
      if (key !== "") userConfigEnv[key] = process.env[key];
    });
  }
});

// 获取客户端环境变量
function getClientEnvironment() {
  const raw = {
    ...userConfigEnv,
    NODE_ENV: process.env.NODE_ENV || "development",
    WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
    WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
    WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
  };

  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { stringified, raw };
}

module.exports = getClientEnvironment;
