# animated.macro

A tiny language for arithmetic over React Native's [Animated](https://facebook.github.io/react-native/docs/animations.html) values.

[![Codeship Status for motiz88/animated.macro][codeship-badge]][codeship]
[![npm version][npm-version-badge]][npm-version]
[![Babel Macro][babel-plugin-macros-badge]][babel-plugin-macros]

[![MIT license][license-badge]][license]
[![Try it on Expo Snack][expo-snack-badge]][expo-snack]

[codeship-badge]: https://img.shields.io/codeship/462bfdb0-f022-0135-7380-3a28d0350dfa/master.svg
[codeship]: https://app.codeship.com/projects/271231
[npm-version-badge]: https://img.shields.io/npm/v/animated.macro.svg
[npm-version]: https://www.npmjs.com/animated.macro
[license-badge]: https://img.shields.io/github/license/motiz88/animated.macro.svg
[license]: https://github.com/motiz88/animated.macro/blob/master/LICENSE.md
[babel-plugin-macros-badge]: https://img.shields.io/badge/babel%20macro-%F0%9F%8E%A3-f5da55.svg
[babel-plugin-macros]: https://github.com/kentcdodds/babel-plugin-macros
[expo-snack-badge]: https://img.shields.io/badge/try%20it%20on-Expo%20Snack%20%F0%9F%93%B1-488CCD.svg
[expo-snack]: https://snack.expo.io/HJQfFaj8f

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
