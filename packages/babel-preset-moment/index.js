const create = require("./create");

module.exports = function (api, opts) {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;

  return create(api, opts, env);
};
