const { createMacro } = require("babel-plugin-macros");

module.exports = function createMacroWithRuntime(macro, runtime, options) {
  const baseMacro = createMacro(macro, options);
  macroWrapper.isBabelMacro = true;
  macroWrapper.options = baseMacro.options;
  return macroWrapper;
  function macroWrapper(...args) {
    const { isBabelMacrosCall } = args[0] || { isBabelMacrosCall: false };
    if (!isBabelMacrosCall) {
      return runtime(...args);
    }
    return baseMacro(...args);
  }
};
