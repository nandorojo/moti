import { useEffect } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
  // TODO rename to withDelay after 2.0.0-alpha.8
  delay,
  processColor,
} from 'react-native-reanimated'
import { DripifyProps, TransitionConfig } from './types'

const styleToColors = (props: ViewStyle & TextStyle) => {
  'worklet'
  const {
    backgroundColor,
    borderBottomColor,
    borderColor,
    borderEndColor,
    borderLeftColor,
    borderRightColor,
    borderStartColor,
    borderTopColor,
    color,
  } = props

  const colors = {
    backgroundColor,
    borderBottomColor,
    borderColor,
    borderEndColor,
    borderLeftColor,
    borderRightColor,
    borderStartColor,
    borderTopColor,
    color,
  }

  const result = { ...props }
  Object.keys(colors).map((key) => {
    const value = colors[key as keyof typeof colors]
    if (value != undefined) {
      result[key] = processColor(value)
    }
  })
}

// type Props = DripifyProps<ViewStyle & TextStyle>

const animationScales = {
  // opacity: {
  //   type: 'timing',
  // },
  // width: {
  //   type: 'spring',
  // },
  // height: {
  //   type: 'spring',
  // },
}

const animationDefaults = {
  timing: {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  },
}

export default function useMapAnimateToStyle<Animate>({
  animate,
  initial,
  exit,
  visible,
  transition,
  delay: defaultDelay,
}: DripifyProps<Animate>) {
  const isMounted = useSharedValue(false)

  const initialStyle = initial || {}
  const exitStyle = exit || {} // TODO?

  const style = useAnimatedStyle(() => {
    const final = {}

    Object.keys(animate).forEach((key) => {
      const value = animate[key]

      const initialValue = initialStyle[key]

      if (isMounted.value === false && initialValue != null) {
        final[key] = initialValue
        return
      }

      let animationType: TransitionConfig['type'] = 'spring'
      // say that we're looking at `width`
      // first, check if we have transition.width.type
      if (transition?.[key as keyof Animate]?.type) {
        animationType = transition[key as keyof Animate].type
      } else if (transition?.type) {
        // otherwise, fallback to transition.type
        animationType = transition.type
      }

      let delayMs: TransitionConfig['delay'] = defaultDelay

      if (transition?.[key as keyof Animate]?.delay != null) {
        delayMs = transition?.[key as keyof Animate]?.delay
      } else if (transition?.delay != null) {
        delayMs = transition.delay
      }

      let finalValue: null | (() => number) = null

      if (transition?.[key as keyof Animate]) {
      }

      if (animationType === 'timing') {
        const duration =
          (transition?.[key as keyof Animate] as Animated.WithTimingConfig)
            ?.duration ?? (transition as Animated.WithTimingConfig)?.duration

        // put them into functions so they don't run immediately(?)
        finalValue = () => {
          'worklet'
          return withTiming(value, {
            duration,
          })
        }
      } else if (animationType === 'spring') {
        finalValue = () => {
          'worklet'
          return withSpring(value, animationDefaults[animationType])
        }
      } else if (animationType === 'decay') {
        finalValue = () => {
          'worklet'
          return withDecay(value, animationDefaults[animationType])
        }
      }

      // an extra check for TS
      if (finalValue) {
        if (delayMs != null) {
          final[key] = delay(delayMs, finalValue())
        } else {
          final[key] = finalValue()
        }
      }
    })

    return final
  })

  useEffect(() => {
    isMounted.value = true
  }, [isMounted])

  return {
    // style: animate,
    style,
    initialStyle,
  }
}
