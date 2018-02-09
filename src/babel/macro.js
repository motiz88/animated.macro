const createMacroWithRuntime = require("./utils/createMacroWithRuntime");

module.exports = createMacroWithRuntime(
  ({ references, state, babel }) => {
    const transform = require("./transform");
    return transform(babel.types, references);
  },
  (...args) => {
    const runtime = require("../runtime");
    return runtime(...args);
  }
);
