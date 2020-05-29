import { Animated } from 'react-native';

function animated(
  template: TemplateStringsArray,
  ...args: (Animated.Animated | number)[]
): Animated.Animated;
export default animated;
