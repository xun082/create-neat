const os = require("node:os");
const fs = require("fs");
const path = require("node:path");
const chalk = require("chalk");

const appDirectory = fs.realpathSync(process.cwd());

function AppDirectory(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

/**
 * 获取本机的 IPv4 地址。
 * @returns {string} 本机的 IPv4 地址。
 */
function getIPAddress() {
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

const devServerConfig = {
  host: process.env.HOST || "0.0.0.0",
  hot: true,
  compress: true, // 是否启用 gzip 压缩
  historyApiFallback: true, // 解决前端路由刷新404现象
  client: {
    logging: "info",
    overlay: {
      errors: true,
      warnings: false,
    },
  },
};

const friendlySyntaxErrorLabel = "Syntax error:";

function clearConsole() {
  process.stdout.write(process.platform === "win32" ? "\x1B[2J\x1B[0f" : "\x1B[2J\x1B[3J\x1B[H");
}

function isLikelyASyntaxError(message) {
  return message.indexOf(friendlySyntaxErrorLabel) !== -1;
}

// 清除webpack的错误信息
function formatMessage(message) {
  let lines = [];

  if (typeof message === "string") {
    lines = message.split("\n");
  } else if ("message" in message) {
    lines = message["message"].split("\n");
  } else if (Array.isArray(message)) {
    message.forEach((message) => {
      if ("message" in message) {
        lines = message["message"].split("\n");
      }
    });
  }

  lines = lines.filter((line) => !/Module [A-z ]+\(from/.test(line));
  lines = lines.map((line) => {
    const parsingError = /Line (\d+):(?:(\d+):)?\s*Parsing error: (.+)$/.exec(line);
    if (!parsingError) {
      return line;
    }
    const [, errorLine, errorColumn, errorMessage] = parsingError;
    return `${friendlySyntaxErrorLabel} ${errorMessage} (${errorLine}:${errorColumn})`;
  });

  message = lines.join("\n");
  // Smoosh syntax errors (commonly found in CSS)
  message = message.replace(
    /SyntaxError\s+\((\d+):(\d+)\)\s*(.+?)\n/g,
    `${friendlySyntaxErrorLabel} $3 ($1:$2)\n`,
  );
  // Clean up export errors
  message = message.replace(
    /^.*export '(.+?)' was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$2'.`,
  );
  message = message.replace(
    /^.*export 'default' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$2' does not contain a default export (imported as '$1').`,
  );
  message = message.replace(
    /^.*export '(.+?)' \(imported as '(.+?)'\) was not found in '(.+?)'.*$/gm,
    `Attempted import error: '$1' is not exported from '$3' (imported as '$2').`,
  );
  lines = message.split("\n");

  // Remove leading newline
  if (lines.length > 2 && lines[1].trim() === "") {
    lines.splice(1, 1);
  }
  // Clean up file name
  lines[0] = lines[0].replace(/^(.*) \d+:\d+-\d+$/, "$1");

  // Cleans up verbose "module not found" messages for files and packages.
  if (lines[1] && lines[1].indexOf("Module not found: ") === 0) {
    lines = [
      lines[0],
      lines[1]
        .replace("Error: ", "")
        .replace("Module not found: Cannot find file:", "Cannot find file:"),
    ];
  }

  // Add helpful message for users trying to use Sass for the first time
  if (lines[1] && lines[1].match(/Cannot find module.+sass/)) {
    lines[1] = "To import Sass files, you first need to install sass.\n";
    lines[1] += "Run `npm install sass` or `yarn add sass` inside your workspace.";
  }

  message = lines.join("\n");
  message = message.replace(/^\s*at\s((?!webpack:).)*:\d+:\d+[\s)]*(\n|$)/gm, "");
  message = message.replace(/^\s*at\s<anonymous>(\n|$)/gm, ""); // at <anonymous>
  lines = message.split("\n");

  lines = lines.filter(
    (line, index, arr) =>
      index === 0 || line.trim() !== "" || line.trim() !== arr[index - 1].trim(),
  );

  message = lines.join("\n");
  return message.trim();
}

function formatWebpackMessages(json) {
  const formattedErrors = json.errors.map(formatMessage);
  const formattedWarnings = json.warnings.map(formatMessage);
  const result = { errors: formattedErrors, warnings: formattedWarnings };
  if (result.errors.some(isLikelyASyntaxError)) {
    // If there are any syntax errors, show just them.
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }
  return result;
}

let packageManagement = "cnpm";
if (fs.existsSync("package-lock.json")) packageManagement = "npm";
else if (fs.existsSync("pnpm-lock.yaml")) packageManagement = "pnpm";
else if (fs.existsSync("yarn.lock")) packageManagement = "yarn";

function friendlyPrints(urls) {
  const appName = JSON.parse(fs.readFileSync(AppDirectory("package.json")).toString()).name;
  console.log();
  console.log(`You can now view ${chalk.bold(appName)} in the browser.`);
  console.log();

  if (urls.lanUrlForTerminal) {
    console.log(`  ${chalk.bold("Local:")}            ${urls.localUrlForTerminal}`);
    console.log(`  ${chalk.bold("On Your Network:")}  ${urls.lanUrlForTerminal}`);
  } else {
    console.log(`  ${urls.localUrlForTerminal}`);
  }

  console.log();
  console.log("Note that the development build is not optimized.");
  console.log(
    `To create a production build, use ` + `${chalk.cyan(`${packageManagement} build`)}.`,
  );
  console.log();
}

module.exports = {
  getIPAddress,
  devServerConfig,
  AppDirectory,
  clearConsole,
  friendlyPrints,
  formatWebpackMessages,
};
