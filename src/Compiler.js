const OPERATOR_PRECEDENCE = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "%": 2
};

const { BaseError } = require("make-error");

class AnimatedSyntaxError extends BaseError {
  constructor(message) {
    super(message);
  }
}

module.exports = class Compiler {
  static AnimatedSyntaxError = AnimatedSyntaxError;

  *tokenizeTemplate(strings, ...values) {
    for (let i = 0; i < values.length; ++i) {
      yield* this.tokenizeString(strings[i]);
      yield { type: "Placeholder", value: values[i], index: i };
    }
    yield* this.tokenizeString(strings[strings.length - 1]);
  }

  *tokenizeString(s) {
    let index = 0,
      lastMatch;
    function match(pattern) {
      const found = s.substr(index).match(pattern);
      if (found) {
        lastMatch = found[0];
      } else {
        lastMatch = undefined;
      }
      return !!found;
    }
    function consume(pattern) {
      if (match(pattern)) {
        index += lastMatch.length;
        return true;
      }
      return false;
    }
    while (index < s.length) {
      consume(/^\s*/);
      if (consume(/^\/\/.*/)) {
        yield { type: "LineComment", value: lastMatch };
        continue;
      }
      if (consume(/^\/\*[^]*?\*\//)) {
        yield { type: "BlockComment", value: lastMatch };
        continue;
      }
      if (consume(/^(\+\+|--|\*\*)/)) {
        // Reserve operators
        yield { type: "Operator", value: lastMatch };
        continue;
      }
      if (consume(/^[\+\-\*\/\%]/)) {
        yield { type: "Operator", value: lastMatch };
        continue;
      }
      if (consume(/^\(/)) {
        yield { type: "LeftParen", value: lastMatch };
        continue;
      }
      if (consume(/^\)/)) {
        yield { type: "RightParen", value: lastMatch };
        continue;
      }
      if (consume(/^(0|[1-9][0-9]*)\.[0-9]*(e[+\-]?[0-9]+)?/)) {
        yield { type: "NumericLiteral", value: lastMatch };
        continue;
      }
      if (consume(/^\.[0-9]*(e[+\-]?[0-9]+)?/)) {
        yield { type: "NumericLiteral", value: lastMatch };
        continue;
      }
      if (consume(/^(0|[1-9][0-9]*)(e[+\-]?[0-9]+)?/)) {
        yield { type: "NumericLiteral", value: lastMatch };
        continue;
      }
      if (index < s.length) {
        throw new AnimatedSyntaxError(`Unexpected: ${s[index]}`);
      }
    }
  }

  parseTemplate(strings, ...values) {
    return this.parseTokens(this.tokenizeTemplate(strings, ...values));
  }

  parseTokens(tokens) {
    let firstToken;
    function pullToken() {
      do {
        firstToken = tokens.next().value;
      } while (
        firstToken &&
        (firstToken.type === "LineComment" ||
          firstToken.type === "BlockComment")
      );
    }
    function expectType(type) {
      if (!firstToken || firstToken.type !== type) {
        throw new AnimatedSyntaxError(
          `Expected ${type} but ${firstToken ? firstToken.type : "EOF"} found`
        );
      }
    }
    function expectEnd() {
      if (firstToken) {
        throw new AnimatedSyntaxError(
          `Expected EOF but ${firstToken.type} found`
        );
      }
    }
    function parsePrimary() {
      const expr =
        parseParenthesizedExpression() ||
        parseUnaryExpression() ||
        parseLiteralOrPlaceholder();
      pullToken();
      return expr;
    }
    function parseExpressionOp(left, minPrec = 0) {
      let operator, right;
      while (firstToken && firstToken.type === "Operator") {
        operator = firstToken;
        switch (operator.value) {
          case "+":
          /* falls through */
          case "-":
          /* falls through */
          case "*":
          /* falls through */
          case "/":
          /* falls through */
          case "%":
            break;
          default:
            throw new AnimatedSyntaxError(
              `The operator '${
                operator.value
              }' is not supported in this context`
            );
        }
        if (!(OPERATOR_PRECEDENCE[firstToken.value] >= minPrec)) {
          break;
        }

        pullToken();
        right = parsePrimary();
        while (
          firstToken &&
          firstToken.type === "Operator" &&
          OPERATOR_PRECEDENCE[firstToken.value] >
            OPERATOR_PRECEDENCE[operator.value]
        ) {
          right = parseExpressionOp(
            right,
            OPERATOR_PRECEDENCE[firstToken.value]
          );
        }
        left = {
          type: "BinaryExpression",
          operator: operator.value,
          left,
          right
        };
      }
      return left;
    }
    function parseExpression() {
      pullToken();
      return parseExpressionOp(parsePrimary());
    }
    function parseLiteralOrPlaceholder() {
      if (
        firstToken &&
        (firstToken.type === "NumericLiteral" ||
          firstToken.type === "Placeholder")
      ) {
        return firstToken;
      }
    }
    function parseParenthesizedExpression() {
      if (firstToken && firstToken.type === "LeftParen") {
        const expr = parseExpression();
        expectType("RightParen");
        return expr;
      }
    }
    function parseUnaryExpression() {
      if (firstToken && firstToken.type === "Operator") {
        const operator = firstToken;
        switch (operator.value) {
          case "++":
          /* falls through */
          case "--":
            throw new AnimatedSyntaxError(
              `The operator '${
                operator.value
              }' is not supported in this context`
            );
          case "-":
          /* falls through */
          case "+": {
            pullToken();
            const argument =
              parseParenthesizedExpression() ||
              parseUnaryExpression() ||
              parseLiteralOrPlaceholder();
            return {
              type: "UnaryExpression",
              operator: operator.value,
              argument
            };
          }
        }
      }
    }
    const expr = parseExpression();
    expectEnd();
    return this.addExpressionTypes(expr);
  }

  addExpressionTypes(node, parentType = "Animated.Value") {
    switch (node.type) {
      case "BinaryExpression":
        return Object.assign({}, node, {
          exprType: parentType,
          left: this.addExpressionTypes(node.left, parentType),
          right: this.addExpressionTypes(
            node.right,
            node.operator === "%" ? "number" : "Animated.Value"
          )
        });
        break;
      case "UnaryExpression":
        return Object.assign({}, node, {
          exprType: parentType,
          argument: this.addExpressionTypes(node.argument, parentType)
        });

      case "NumericLiteral":
      /* falls through */
      case "Placeholder":
        return Object.assign({}, node, { exprType: parentType });
    }
  }
};
