const Compiler = require("../Compiler");
const { AnimatedSyntaxError } = Compiler;

module.exports = class BabelCompiler extends Compiler {
  tokenizeTemplateLiteral(path) {
    const t = this._babelTypes;
    if (path.isTaggedTemplateExpression()) {
      return this.tokenizeTemplateLiteral(path.get("quasi"));
    }
    return this.tokenizeTemplate(
      path.get("quasis"),
      ...path.get("expressions")
    );
  }

  tokenizeString(path) {
    return super.tokenizeString(path.node.value.cooked);
  }

  _animatedCall(method, ...args) {
    const t = this._babelTypes;
    return t.callExpression(
      t.memberExpression(t.identifier("Animated"), t.identifier(method)),
      args
    );
  }

  _createAnimatedValue(a) {
    const t = this._babelTypes;
    return t.newExpression(
      t.memberExpression(t.identifier("Animated"), t.identifier("Value")),
      [a]
    );
  }

  _pureCheckedCast(node) {
    const t = this._babelTypes;

    return t.conditionalExpression(
      t.binaryExpression(
        "===",
        t.unaryExpression("typeof", node),
        t.stringLiteral("number")
      ),
      this._createAnimatedValue(node),
      node
    );
  }

  _ensureAnimated(path) {
    const t = this._babelTypes;
    const { value, confident } = path.evaluate();
    let knownType;
    if (typeof value === "number" && confident) {
      knownType = "number";
    }
    const uncheckedCast = this._createAnimatedValue(path.node);

    if (knownType === "number") {
      return this._createAnimatedValue(path.node);
    } else if (path.isPure()) {
      return this._pureCheckedCast(path.node);
    } else {
      const id = path.scope.generateUidIdentifierBasedOnNode(path.node);
      path.scope.push({ id });
      return t.sequenceExpression([
        t.assignmentExpression("=", id, path.node),
        this._pureCheckedCast(id)
      ]);
    }
  }

  constructor({ types }) {
    super();

    this._babelTypes = types;

    const t = this._babelTypes;

    this.ANIMATED_UNARY_OPS = {
      "+": a => a,
      "-": a =>
        this._animatedCall(
          "multiply",
          t.unaryExpression("-", t.numericLiteral(1)),
          a
        )
    };

    this.ANIMATED_BINARY_OPS = {
      "+": (a, b) => this._animatedCall("add", a, b),
      "-": (a, b) =>
        this._animatedCall("add", a, this.ANIMATED_UNARY_OPS["-"](b)),
      "/": (a, b) => this._animatedCall("divide", a, b),
      "*": (a, b) => this._animatedCall("multiply", a, b),
      "%": (a, b) => this._animatedCall("modulo", a, b)
    };
  }

  // Compile animated.macro AST nodes to Babel AST nodes
  compileAst(animNode) {
    const t = this._babelTypes;

    switch (animNode.type) {
      case "BinaryExpression":
        return this.ANIMATED_BINARY_OPS[animNode.operator](
          this.compileAst(animNode.left),
          this.compileAst(animNode.right)
        );
        break;
      case "UnaryExpression":
        return this.ANIMATED_UNARY_OPS[animNode.operator](
          this.compileAst(animNode.argument)
        );
      case "NumericLiteral": {
        const value = t.numericLiteral(parseFloat(animNode.value));

        if (animNode.exprType === "Animated.Value") {
          return this._createAnimatedValue(value);
        }
        return value;
      }
      case "Placeholder":
        const babelPath = animNode.value;
        if (animNode.exprType === "Animated.Value") {
          return this._ensureAnimated(babelPath);
        }
        return babelPath.node;
    }
  }

  parseTemplateLiteral(node) {
    return this.parseTokens(this.tokenizeTemplateLiteral(node));
  }

  compileTemplate(strings, ...values) {
    return this.compileAst(this.parseTemplate(strings, ...values));
  }

  compileTemplateLiteral(node) {
    return this.compileAst(this.parseTemplateLiteral(node));
  }
};
