import pluginTester from "babel-plugin-tester";
import plugin from "../plugin";

pluginTester({
  plugin,
  snapshot: true,
  babelOptions: { filename: __filename },
  tests: require("./expressions").map(
    src => `
      import { Animated } from "react-native";
      import animated from "animated.macro";
      
      ${src}
  `
  )
});
