import { Animated } from "react-native";
import macro from "../macro";
const { Node: AnimatedNode } = Animated;
import pluginTester from "babel-plugin-tester";
import plugin from "babel-plugin-macros";

describe("macro", () => {
  test("falls back to runtime", () => {
    expect(macro`1`).toBeInstanceOf(AnimatedNode);
  });
});

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: require("./expressions").map(
    src => `
      import { Animated } from "react-native";
      import animated from "../macro";
      
      ${src}
  `
  )
});
