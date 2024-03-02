const create = require("./create");

module.exports = function (api, opts) {
  return create(api, { helpers: false, ...opts }, "production");
};
