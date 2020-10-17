import { useEffect } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

type Props = {
  animate: ViewStyle | TextStyle
}

const animationScales = {
  opacity: {
    type: 'timing',
  },
  width: {
    type: 'spring',
  },
  height: {
    type: 'spring',
  },
}

const animationDefaults = {
  timing: {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  },
}

export default function useMapAnimateToStyle({ animate }: Props) {
  const style = useAnimatedStyle(() => {
    const final = {}

    Object.keys(animate).forEach((key) => {
      const value = animate[key]

      const animationType = animationScales[key]?.type ?? 'spring'

      if (animationType === 'timing') {
        final[key] = withTiming(value, animationDefaults[animationType])
      } else {
        final[key] = withSpring(value, animationDefaults[animationType])
      }
    })

    return final
  })

  return {
    // style: animate,
    style,
  }
}
