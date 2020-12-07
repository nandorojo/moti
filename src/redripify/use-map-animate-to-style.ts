import { useEffect } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
  withDelay,
  processColor,
} from 'react-native-reanimated'
import { DripifyProps, TransitionConfig } from './types'

const isColor = (styleKey: string) => {
  'worklet'
  return [
    'backgroundColor',
    'borderBottomColor',
    'borderColor',
    'borderEndColor',
    'borderLeftColor',
    'borderRightColor',
    'borderStartColor',
    'borderTopColor',
    'color',
  ].includes(styleKey)
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

  const initialSV = useSharedValue(initial, true)
  const animateSV = useSharedValue(animate, true)

  // const variantSV = animator?.__state

  // useEffect(() => {
  //   initialSV.value = initial
  //   if (animate) {
  //     animateSV.value = animate
  //   }
  // }, [animate, animateSV, initial, initialSV])
  // console.log('jingle', { animator })

  // const exitStyle = exit || {} // TODO?

  const style = useAnimatedStyle(() => {
    const final = {}
    const animateStyle = animateSV.value || {}
    // const animateStyle = animate || {}
    const variantStyle = animator?.__state?.value || {}

    // console.log('variant', variantStyle)

    const initialStyle = initialSV.value || {}

    // variant style

    const mergedStyles = { ...variantStyle, ...animateStyle }
    // const mergedStyles = Object.assign(
    //   {},
    //   Object.assign({}, variantStyle),
    //   animateStyle
    // )

    Object.keys(mergedStyles).forEach((key) => {
      'worklet'

      const initialValue = initialStyle[key]
      let value = animateStyle[key] || variantStyle[key]

      if (initialValue != null) {
        // if we haven't mounted, or if there's no other value to use besides the initial one, use it.
        if (isMounted.value === false || !value) {
          final[key] = initialValue
          return
        }
      }

      let animationType: Required<TransitionConfig>['type'] = 'timing'
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
      const callback: (canceled: boolean) => void = () => {}

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
        config = {}
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
        config = {}
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

      if (isColor(key)) {
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
          const finalValue = animation(transformValue, config, callback)
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
          const finalValue = animation(value, config, callback)

          if (delayMs != null) {
            final[key][innerStyleKey] = withDelay(delayMs, finalValue)
          } else {
            final[key][innerStyleKey] = finalValue
          }
        })
      } else {
        const finalValue = animation(value, config, callback)

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
