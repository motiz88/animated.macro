const compile = require("../");
const { Animated } = require("react-native");
const { Node: AnimatedNode } = Animated;

describe("RuntimeCompiler", () => {
  test("cast literal to AnimatedNode", () => {
    expect(compile`1`).toBeInstanceOf(AnimatedNode);
  });

  test("cast numeric placeholder to AnimatedNode", () => {
    expect(compile`${1}`).toBeInstanceOf(AnimatedNode);
  });

  test("pass through Animated.Value placeholder", () => {
    const value = new Animated.Value(10);
    expect(compile`${value}`).toBe(value);
  });

  test("adding two placeholders", () => {
    const value = new Animated.Value(10);
    const compiled = compile`${value} + ${value}`;
    expect(compiled).toBeInstanceOf(AnimatedNode);
    expect(compiled).toMatchSnapshot();
  });

  test("adding two literals", () => {
    const compiled = compile`1 + 2`;
    expect(compiled).toBeInstanceOf(AnimatedNode);
    expect(compiled).toMatchSnapshot();
  });

  test("modulo doesn't cast rhs to Animated", () => {
    const compiled = compile`5 % 3`;
    expect(compiled).toBeInstanceOf(AnimatedNode);
    expect(compiled).toMatchSnapshot();

    // NOTE: Depends on an implementation detail of AnimatedModulo
    expect(compiled._modulus).toBe(3);
  });

  test("inverting a placeholder", () => {
    const value = new Animated.Value(10);
    const compiled = compile`1 / ${value}`;
    expect(compiled).toBeInstanceOf(AnimatedNode);
    expect(compiled).toMatchSnapshot();
  });

  test("multiplying a placeholder and a literal", () => {
    const value = new Animated.Value(10);
    const compiled = compile`${value} * 3`;
    expect(compiled).toBeInstanceOf(AnimatedNode);
    expect(compiled).toMatchSnapshot();
  });

  test("multiplying literal and a placeholder", () => {
    const value = new Animated.Value(10);
    const compiled = compile`3 * ${value}`;
    expect(compiled).toBeInstanceOf(AnimatedNode);
    expect(compiled).toMatchSnapshot();
  });

  test("inverting a parenthesized addition", () => {
    const value = new Animated.Value(0);
    const compiled = compile`1 / (${value} + 1)`;
    expect(compiled).toBeInstanceOf(AnimatedNode);
    expect(compiled).toMatchSnapshot();
  });
});
