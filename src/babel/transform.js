const BabelCompiler = require("./BabelCompiler");
const { MacroError } = require("babel-plugin-macros");

module.exports = function transform(t, references) {
  const compiler = new BabelCompiler({ types: t });
  for (const path of references.default || []) {
    if (path.parentPath.isTaggedTemplateExpression() && path.key === "tag") {
      if (!path.scope.hasBinding("Animated")) {
        throw new MacroError("Animated must be in scope");
      }
      path.parentPath.replaceWith(
        compiler.compileTemplateLiteral(path.parentPath.get("quasi"))
      );
    }
  }
};
