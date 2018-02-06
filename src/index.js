const RuntimeCompiler = require("./RuntimeCompiler");

module.exports = function animated(strings, ...values) {
  return new RuntimeCompiler().evaluateTemplate(strings, ...values);
};
