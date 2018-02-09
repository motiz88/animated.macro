# animated.macro

A tiny language for arithmetic over React Native's [Animated](https://facebook.github.io/react-native/docs/animations.html) values.

| JS                                          | `animated.macro`            |
| ------------------------------------------- | --------------------------- |
| `Animated.add(x, y)`                        | `` animated`${x} + ${y}` `` |
| `Animated.multiply(x, y)`                   | `` animated`${x} * ${y}` `` |
| `Animated.divide(x, y)`                     | `` animated`${x} / ${y}` `` |
| `Animated.add(x, Animated.multiply(-1, y))` | `` animated`${x} - ${y}` `` |
| `Animated.modulo(x, y)`                     | `` animated`${x} % ${y}` `` |

## Installation

```sh
npm install --save-dev animated.macro
```

For the best experience, install and configure [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) if you haven't already. Alternatively, this package also exports a standalone Babel plugin for use with Babel 6 or 7, under the name `animated.macro/plugin`.

> Note: Whether you use the macro or the plugin, always import `animated` from `"animated.macro"`, as seen below.

## Example

```js
import { Animated } from "react-native";
import animated from "animated.macro";

const a = new Animated.Value(1);
const b = animated`1 / ${a}`;

Animated.spring(a, { toValue: 2 }).start();
```

## Runtime compiler

This package also includes a pure-runtime implementation, mainly intended for use in sandbox environments like Expo Snack, where setting up `babel-plugin-macros` is impractical. You should not rely on it for real-world use in your app, as the compilation overhead may be noticeable.
