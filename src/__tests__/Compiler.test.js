const Compiler = require("../Compiler");

describe("Compiler", () => {
  let parse;

  beforeAll(() => {
    const compiler = new Compiler();

    parse = (strings, ...values) => ({
      tokens: [...compiler.tokenizeTemplate(strings, ...values)],
      ast: compiler.parseTemplate(strings, ...values)
    });
  });

  test("numeric literals", () => {
    expect(parse` 1 `).toMatchSnapshot();
    expect(parse` 5. `).toMatchSnapshot();
    expect(parse` 1.2e10 `).toMatchSnapshot();
    expect(parse` 22e-1 `).toMatchSnapshot();
  });

  test("binary operators", () => {
    expect(parse` ${Math.PI}+1 `).toMatchSnapshot();
    expect(parse` ${Math.PI}-5. `).toMatchSnapshot();
    expect(parse` ${Math.PI} * 1.2e10 `).toMatchSnapshot();
    expect(parse` ${Math.PI} / 22e-1 `).toMatchSnapshot();
    expect(parse` ${Math.PI} % ${2} `).toMatchSnapshot();
  });

  test("reserved binary operators", () => {
    expect(() => parse` ${Math.PI} ** 1 `).toThrowErrorMatchingSnapshot();
  });

  test("reserved unary operators", () => {
    expect(() => parse` ++ ${Math.PI} `).toThrowErrorMatchingSnapshot();
    expect(() => parse` -- ${Math.PI} `).toThrowErrorMatchingSnapshot();
    expect(() => parse` ${Math.PI} ++ `).toThrowErrorMatchingSnapshot();
    expect(() => parse` ${Math.PI} -- `).toThrowErrorMatchingSnapshot();
  });

  test("operator precedence", () => {
    expect(parse` 1 + 2 * 3 `).toMatchSnapshot();
    expect(parse` (1 + 2) * 3 `).toMatchSnapshot();
    expect(parse` 1 - 2 / 3 `).toMatchSnapshot();
    expect(parse` (1 - 2) / 3 `).toMatchSnapshot();
    expect(parse` (1 - 2 - 3)`).toMatchSnapshot();
    expect(parse` 1 / (0 + 1) `).toMatchSnapshot();
  });

  test("binary operators", () => {
    expect(parse` ${Math.PI}+1 `).toMatchSnapshot();
    expect(parse` ${Math.PI}-5. `).toMatchSnapshot();
    expect(parse` ${Math.PI} * 1.2e10 `).toMatchSnapshot();
    expect(parse` ${Math.PI} / 22e-1 `).toMatchSnapshot();
    expect(parse` ${Math.PI} % ${2} `).toMatchSnapshot();
  });

  test("block comments", () => {
    expect(parse` /*1*/ 2 / 3 * 4 /* 5 */ `).toMatchSnapshot();
    expect(parse` /* /* 1*/0 `).toMatchSnapshot();
  });

  test("line comments", () => {
    expect(parse` 1 / 2 // 3`).toMatchSnapshot();
    expect(parse` 1 / 2 // 3\n + 4`).toMatchSnapshot();
  });
});
