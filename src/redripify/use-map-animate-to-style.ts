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
// import set from 'lodash.set'

// const aliases = {
//   y: 'transform[0].translateY',
//   x: 'transform[1].translateX',
//   scale: 'transform[2].scale',
// } as const

// type Aliases = typeof aliases

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
    const animateStyle = animateSV.value || {}
    const variantStyle = variantSV?.value || {}

    const initialStyle = initialSV.value || {}

    // variant style

    const mergedStyles = { ...variantStyle, ...animateStyle }

    Object.keys(mergedStyles).forEach((key) => {
      'worklet'

      const initialValue = initialStyle[key]
      let value = animateStyle[key] || variantStyle[key]

      if (initialValue != null) {
        // if we haven't mounted, or if there's no other value to use besides the initial one, use it.
        if (isMounted.value === false || !value) {
          final[key] = initialValue
        }
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

        config = {
          duration,
          easing,
        }
        animation = withTiming
      } else if (animationType === 'spring') {
        animation = withSpring
        const configKeys: (keyof Animated.WithSpringConfig)[] = [
          'damping',
          'mass',
          'overshootClamping',
          'restDisplacementThreshold',
          'restSpeedThreshold',
          'stiffness',
          'velocity',
        ]
        configKeys.forEach((configKey) => {
          const styleSpecificConfig = transition?.[key]?.[configKey]
          const transitionConfigForKey = transition?.[configKey]

          if (styleSpecificConfig) {
            config[configKey] = styleSpecificConfig
          } else if (transitionConfigForKey) {
            config[configKey] = transitionConfigForKey
          }
        })
      } else if (animationType === 'decay') {
        animation = withDecay
        const configKeys: (keyof Animated.WithDecayConfig)[] = [
          'clamp',
          'velocity',
          'deceleration',
        ]
        configKeys.forEach((configKey) => {
          const styleSpecificConfig = transition?.[key]?.[configKey]
          const transitionConfigForKey = transition?.[configKey]

          if (styleSpecificConfig) {
            config[configKey] = styleSpecificConfig
          } else if (transitionConfigForKey) {
            config[configKey] = transitionConfigForKey
          }
        })
      }

      if (colors.includes(key)) {
        value = processColor(value)
      }

      if (Array.isArray(value)) {
        // transforms
        final[key] = []

        value.forEach((transformProp) => {
          const transformKey = Object.keys(transformProp)[0]
          // const transformValue = value[index][transformKey]
          const transformValue = transformProp[transformKey]

          if (transition?.[key][transformKey]?.delay != null) {
            delayMs = transition?.[transformKey]?.delay
          }

          const transform = {}
          const finalValue = animation(transformValue, config)
          if (delayMs != null) {
            transform[transformKey] = withDelay(delayMs, finalValue)
          } else {
            transform[transformKey] = finalValue
          }

          final[key].push(transform)
        })
      } else if (typeof value === 'object') {
        // shadows
        final[key] = {}
        Object.keys(value).forEach((innerStyleKey) => {
          const finalValue = animation(value, config)

          if (delayMs != null) {
            final[key][innerStyleKey] = withDelay(delayMs, finalValue)
          } else {
            final[key][innerStyleKey] = finalValue
          }
        })
      } else {
        const finalValue = animation(value, config)

        if (delayMs != null && typeof delayMs === 'number') {
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
