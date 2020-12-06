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
  delay as withDelay,
  processColor,
} from 'react-native-reanimated'
import { DripifyProps, TransitionConfig } from './types'

const colors = [
  'backgroundColor',
  'borderBottomColor',
  'borderColor',
  'borderEndColor',
  'borderLeftColor',
  'borderRightColor',
  'borderStartColor',
  'borderTopColor',
  'color',
]

const parseColorStyles = (props: ViewStyle & TextStyle) => {
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
    if (value != undefined && typeof value == 'string') {
      result[key] = processColor(value)
    }
  })

  return result
}

// function animateStyles(key, style) {
//   'worklet'

//   if (key === 'backgroundColor' || key === 'color') {
//     return processColor(style)
//   } else if (Array.isArray(style)) {
//     // transforms
//     const final = []

//     style.forEach((value) => {
//       const transformKey = Object.keys(value)[0]
//       const transformValue = value[transformKey]
//       const transform = {}
//       transform[transformKey] = animation(transformValue, config)

//       acc[key].push(transform)
//     })
//   } else if (typeof style === 'object') {
//     // shadows and etc
//     acc[key] = {}

//     Object.keys(style).forEach((styleInnerKey) => {
//       acc[key][styleInnerKey] = animation(style, config)
//     })
//   } else {
//     acc[key] = animation(style, config)
//   }
// }

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
  initial = false,
  transition,
  delay: defaultDelay,
  animator,
}: DripifyProps<Animate>) {
  const isMounted = useSharedValue(false)

  const initialSV = useSharedValue(initial)
  const animateSV = useSharedValue(animate)

  const variantSV = animator?.__state

  useEffect(() => {
    initialSV.value = initial
    if (animate) {
      animateSV.value = animate
    }
  }, [animate, animateSV, initial, initialSV])

  // const exitStyle = exit || {} // TODO?

  const style = useAnimatedStyle(() => {
    const final = {}

    const initialStyle = initialSV.value || {}

    const animate = animateSV.value || {}

    // variant style
    const variantStyle = variantSV?.value || {}

    const mergedStyles = { ...variantStyle, ...animate }

    Object.keys(mergedStyles).forEach((key) => {
      'worklet'

      let value = animate[key] || variantStyle[key]

      if (colors.includes(key)) {
        value = processColor(value)
      }

      const initialValue = initialStyle[key]

      if (isMounted.value === false && initialValue != null) {
        final[key] = initialValue
        return
      }

      let animationType: Required<TransitionConfig>['type'] = 'spring'
      // say that we're looking at `width`
      // first, check if we have transition.width.type
      if (transition?.[key as keyof Animate]?.type) {
        animationType = transition[key]?.type
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

      let finalValue: typeof value | number = value

      if (transition?.[key as keyof Animate]) {
      }

      let config = {}
      let animation: Function = withSpring

      if (animationType === 'timing') {
        const duration =
          (transition?.[key as keyof Animate] as Animated.WithTimingConfig)
            ?.duration ??
          (transition as Animated.WithTimingConfig)?.duration ??
          animationDefaults['timing'].duration

        const easing =
          (transition?.[key as keyof Animate] as Animated.WithTimingConfig)
            ?.easing ??
          (transition as Animated.WithTimingConfig)?.easing ??
          animationDefaults['timing'].easing

        // put them into functions so they don't run immediately(?)

        config = {
          duration,
          easing,
        }
        animation = withTiming

        // finalValue = withTiming(value, {
        //   duration,
        //   easing,
        // })
      } else if (animationType === 'spring') {
        animation = withSpring
        config = animationDefaults[animationType as 'spring']
        // finalValue = withSpring(
        //   value,
        //   animationDefaults[animationType as 'spring']
        // )
      } else if (animationType === 'decay') {
        animation = withDecay
        config = animationDefaults[animationType as 'decay']
        // finalValue = withDecay(
        //   value,
        //   animationDefaults[animationType as 'decay']
        // )
      }

      if (Array.isArray(value)) {
        // transforms
        final[key] = []

        value.forEach((transformProp) => {
          const transformKey = Object.keys(transformProp)[0]
          const transformValue = value[transformKey]

          if (transition?.[key][transformKey]?.delay != null) {
            delayMs = transition?.[transformKey]?.delay
          }

          const transform = {}
          transform[transformKey] = animation(transformValue, config)
          if (delayMs != null) {
            transform[transformKey] = withDelay(
              delayMs,
              transform[transformKey]
            )
          }

          final[key].push(transform)
        })
      } else {
        finalValue = animation(value, config)

        if (delayMs != null) {
          final[key] = withDelay(delayMs, finalValue)
        } else {
          final[key] = finalValue
        }
      }
    })

    return final
  })

  useEffect(() => {
    isMounted.value = true
  }, [isMounted])

  return {
    style,
  }
}
