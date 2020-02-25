const packConfig = require("./pack");
const prodConfig = require("./prod");
const merge = require("webpack-merge");

module.exports = function(env, argv) {
  let config;
  switch (process.env.NODE_ENV) {
    case "development":
      config = packConfig;
      break;
    default:
      config = [merge(packConfig, prodConfig)];
  }

  return config;
};
