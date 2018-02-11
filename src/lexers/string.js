const moo = require("moo");

const prototypeLexer = moo.compile({
  WS: { match: /\s+/, lineBreaks: true },
  LineComment: /\/\/.*?$/,
  BlockComment: { match: /\/\*[^]*?\*\//, lineBreaks: true },
  Operator: ["++", "--", "**", "+", "-", "*", "/", "%"],
  LeftParen: "(",
  RightParen: ")",
  NumericLiteral: [
    /(?:0|[1-9][0-9]*)\.[0-9]*(?:e[+\-]?[0-9]+)?/, // 1.0, 1.0e1
    /\.[0-9]*(?:e[+\-]?[0-9]+)?/, // .0, .0e1
    /(?:0|[1-9][0-9]*)(?:e[+\-]?[0-9]+)?/ // 0, 1, 0e1, 1e1
  ]
});

const { clone: superClone } = prototypeLexer;

function patch() {
  this.clone = clone;
  this.formatError = formatError;
  return this;
}

function clone() {
  other = superClone.apply(this);
  patch.apply(this);
  return this;
}

function formatError(token, message) {
  const value = token.value;
  const index = token.offset;
  const eol = token.lineBreaks ? value.indexOf("\n") : value.length;
  const start = Math.max(0, index - token.col + 1);
  const firstLine = this.buffer.substring(start, index + eol);
  message += " near:\n\n";
  message += "  " + firstLine + "\n";
  message += "  " + Array(token.col).join(" ") + "^";
  return message;
}

module.exports = patch.apply(prototypeLexer);
