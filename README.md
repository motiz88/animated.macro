# animated-expr

A tiny language for arithmetic over React Native's [Animated](https://facebook.github.io/react-native/docs/animations.html) values.

| JS                                          | `animated-expr`             |
| ------------------------------------------- | --------------------------- |
| `Animated.add(x, y)`                        | `` animated`${x} + ${y}` `` |
| `Animated.multiply(x, y)`                   | `` animated`${x} * ${y}` `` |
| `Animated.divide(x, y)`                     | `` animated`${x} / ${y}` `` |
| `Animated.add(x, Animated.multiply(-1, y))` | `` animated`${x} - ${y}` `` |
| `Animated.modulo(x, y)`                     | `` animated`${x} % ${y}` `` |

## Sample code

```js
import { Animated } from "react-native";
import animated from "animated-expr";

const a = new Animated.Value(1);
const b = animated`1 / ${a}`;

Animated.spring(a, { toValue: 2 }).start();
```

## Getting started

The recommended way of using this package is at compile time, via the included Babel plugin. Otherwise, you will end up compiling expressions at runtime, which is slower and likely not what you want for real-world use.

First, install the package:

```sh
npm install --save-dev animated-expr
```

Then, set up the Babel plugin by adding it to the `plugins` array in your `.babelrc` file. (If you don't have a `.babelrc` file yet, [read this](https://github.com/facebook/react-native/tree/master/babel-preset).)

#### .babelrc

```json
{
  "presets": ["react-native"],
  "plugins": ["animated-expr/babel"]
}
```
