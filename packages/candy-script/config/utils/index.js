const path = require("path");

const paths = (filePath) => path.resolve(process.cwd(), filePath);

module.exports = {
  paths,
};
