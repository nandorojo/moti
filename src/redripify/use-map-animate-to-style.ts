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
  useDerivedValue,
} from 'react-native-reanimated'
import { PackageName } from '../constants/package-name'
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

export default function useMapAnimateToStyle<Animate = ViewStyle & TextStyle>({
  animate,
  initial = false,
  transition,
  delay: defaultDelay,
  animator,
  stylePriority = 'animator',
}: DripifyProps<Animate>) {
  const isMounted = useSharedValue(false)

  const initialSV = useSharedValue(initial)
  const animateSV = useSharedValue(animate)

  const initialDerived = useDerivedValue(() => {
    return JSON.stringify(initialSV.value ?? {})
  })
  const animateDerived = useDerivedValue(() => {
    return JSON.stringify(animateSV.value ?? {})
  })
  const variantDerived = useDerivedValue(() => {
    return JSON.stringify(animator?.__state?.value ?? {})
  })

  const style = useAnimatedStyle(() => {
    const final = {}
    // const animateStyle = animateSV.value || {}
    // const variantStyle: Animate = animator?.__state?.value || {}
    const variantStyle: Animate = JSON.parse(variantDerived.value)

    const animateStyle: Animate = JSON.parse(animateDerived.value)
    const initialStyle: Animate = JSON.parse(initialDerived.value)
    // const initialStyle = initialSV.value || {}

    let mergedStyles: Animate
    if (stylePriority === 'animator') {
      mergedStyles = { ...animateStyle, ...variantStyle }
    } else {
      mergedStyles = { ...variantStyle, ...animateStyle }
    }

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
        config = {
          // solve the missing velocity bug in 2.0.0-rc.0
          velocity: 2,
        } as Animated.WithSpringConfig
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
        if (__DEV__) {
          console.error(
            `[${PackageName}]: You passed ${key}: ${value}, but color values aren't supported yet due to a bug in Reanimated 2. ☹️ 
                
Please go to https://github.com/software-mansion/react-native-reanimated/issues/845 and comment so that this bug can get fixed!`
          )
        }
        value = processColor(value)
      }

      if (Array.isArray(value)) {
        // transforms
        final[key] = []

        value.forEach((transformProp) => {
          const transformKey = Object.keys(transformProp)[0]
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
