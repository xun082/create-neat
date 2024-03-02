const fs = require("fs");
const { resolveApp } = require("@laconic/utils");
const dotenvExpand = require("dotenv-expand");
const dotenv = require("dotenv");

const NODE_ENV = process.env.NODE_ENV;

const dotenvFiles = [`${resolveApp(".env")}.${NODE_ENV}`, resolveApp(".env")].filter(Boolean);

const userConfigEnv = {};

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

const REACT_APP = /^REACT_APP_/i;

function getClientEnvironment() {
  const raw = Object.keys(process.env)
    .filter((key) => REACT_APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV || "development",
        WDS_SOCKET_HOST: process.env.WDS_SOCKET_HOST,
        WDS_SOCKET_PATH: process.env.WDS_SOCKET_PATH,
        WDS_SOCKET_PORT: process.env.WDS_SOCKET_PORT,
        ...userConfigEnv,
      },
    );

  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };
  return { stringified, raw };
}

module.exports = getClientEnvironment;
