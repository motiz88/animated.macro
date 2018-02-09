const Compiler = require("../Compiler");
const { Animated } = require("react-native");

const ANIMATED_UNARY_OPS = {
  "+": a => a,
  "-": a => Animated.multiply(-1, a)
};

const ANIMATED_BINARY_OPS = {
  "+": Animated.add.bind(Animated),
  "-": (a, b) => Animated.add(a, ANIMATED_UNARY_OPS["-"](b)),
  "/": Animated.divide.bind(Animated),
  "*": Animated.multiply.bind(Animated),
  "%": Animated.modulo.bind(Animated)
};

function ensureAnimated(animatedOrNumber) {
  if (typeof animatedOrNumber === "number") {
    return new Animated.Value(animatedOrNumber);
  }
  return animatedOrNumber;
}

module.exports = class RuntimeCompiler extends Compiler {
  evaluateAst(node) {
    switch (node.type) {
      case "BinaryExpression":
        return ANIMATED_BINARY_OPS[node.operator](
          this.evaluateAst(node.left),
          this.evaluateAst(node.right)
        );
        break;
      case "UnaryExpression":
        return ANIMATED_UNARY_OPS[node.operator](
          this.evaluateAst(node.argument)
        );
      case "NumericLiteral": {
        const value = parseFloat(node.value);
        if (node.exprType === "Animated.Value") {
          return new Animated.Value(value);
        }
        return value;
      }
      case "Placeholder":
        const value = node.value;
        if (node.exprType === "Animated.Value") {
          return ensureAnimated(value);
        }
        return value;
    }
  }

  evaluateTemplate(strings, ...values) {
    return this.evaluateAst(this.parseTemplate(strings, ...values));
  }
};
