import { useEffect } from 'react'
import { TextStyle, TransformsStyle, ViewStyle } from 'react-native'
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
  withRepeat,
  withSequence,
} from 'react-native-reanimated'
import { PackageName } from '../constants/package-name'
import { DripifyProps, Transforms, TransitionConfig } from './types'

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

const isTransform = (styleKey: string) => {
  'worklet'
  const transforms: (keyof Transforms)[] = [
    'perspective',
    'rotate',
    'rotateX',
    'rotateY',
    'rotateZ',
    'scale',
    'scaleX',
    'scaleY',
    'translateX',
    'translateY',
    'skewX',
    'skewY',
  ]
  return transforms.includes(styleKey as keyof Transforms)
}

const animationDefaults = {
  timing: {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  },
}

// function animate(
//   key: string,
//   value: any,
//   config: any,
//   transition: object,
//   delay?: number
// ) {
//   let finalValue
//   if (isColor(key)) {
//     if (__DEV__) {
//       console.error(
//         `[${PackageName}]: You passed ${key}: ${value}, but color values aren't supported yet due to a bug in Reanimated 2. ☹️

// Please go to https://github.com/software-mansion/react-native-reanimated/issues/845 and comment so that this bug can get fixed!`
//       )
//     }
//     value = processColor(value)
//   }

//   if (isTransform(key)) {
//     final['transform'] = final['transform'] || []
//     // const transformKey = Object.keys(transformProp)[0]
//     // const transformValue = transformProp[transformKey]

//     if (transition?.[key]?.delay != null) {
//       delayMs = transition?.[key]?.delay
//     }

//     const transform = {}
//     const finalValue = animation(value, config, callback)
//     if (delayMs != null) {
//       transform[key] = withDelay(delayMs, finalValue)
//     } else {
//       transform[key] = finalValue
//     }

//     final[key].push(transform)

//     return
//   }
//   if (typeof value === 'object') {
//     // shadows
//     final[key] = {}
//     Object.keys(value).forEach((innerStyleKey) => {
//       const finalValue = animation(value, config, callback)

//       if (delayMs != null) {
//         final[key][innerStyleKey] = withDelay(delayMs, finalValue)
//       } else {
//         final[key][innerStyleKey] = finalValue
//       }
//     })
//   } else {
//     const finalValue = animation(value, config, callback)

//     if (delayMs != null && typeof delayMs === 'number') {
//       final[key] = withDelay(delayMs, finalValue)
//     } else {
//       final[key] = finalValue
//     }
//   }
// }

function animationConfig<Animate>(
  styleProp: string,
  transition: DripifyProps<Animate>['transition'],
  defaultDelay: number
) {
  'worklet'

  const key = styleProp
  // first, let's get the config & delay for this animation
  let animationType: Required<TransitionConfig>['type'] = 'spring'
  // say that we're looking at `width`
  // first, check if we have transition.width.type
  if ((transition as any)?.[key as keyof Animate]?.type) {
    animationType = (transition as any)[key]?.type
  } else if (transition?.type) {
    // otherwise, fallback to transition.type
    animationType = transition.type
  }

  let delayMs: TransitionConfig['delay'] = defaultDelay

  if ((transition as any)?.[key as keyof Animate]?.delay != null) {
    delayMs = (transition as any)?.[key as keyof Animate]?.delay
  } else if (transition?.delay != null) {
    delayMs = transition.delay
  }

  let config = {}
  let animation: Function = withSpring

  if (animationType === 'timing') {
    const duration =
      ((transition as any)?.[key as keyof Animate] as Animated.WithTimingConfig)
        ?.duration ??
      (transition as Animated.WithTimingConfig)?.duration ??
      animationDefaults['timing'].duration

    const easing =
      ((transition as any)?.[key as keyof Animate] as Animated.WithTimingConfig)
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
    // TODO this doesn't work for now
    // if (__DEV__) {
    //   console.error(
    //     `[${PackageName}]: You passed transition type: decay, but this isn't working for now. Honestly, not sure why yet. Try passing other transition fields, like clamp, velocity, and deceleration. If that solves it, please open an issue at let me know.`
    //   )
    // }
    animation = withDecay
    config = {
      velocity: 2,
    }
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

  return {
    animation,
    config,
    delayMs,
  }
}

export default function useMapAnimateToStyle<Animate>({
  animate,
  from = false,
  transition,
  delay: defaultDelay,
  state,
  stylePriority = 'animator',
}: DripifyProps<Animate>) {
  const isMounted = useSharedValue(false)

  // is any of this necessary?
  const initialSV = useSharedValue(from)
  const animateSV = useSharedValue(animate)
  // memoize to strings so that the UAS hook doesn't re-run?
  const initialDerived = useDerivedValue(() => {
    return JSON.stringify(initialSV.value ?? {})
  })
  const animateDerived = useDerivedValue(() => {
    return JSON.stringify(animateSV.value ?? {})
  })
  const variantDerived = useDerivedValue(() => {
    return JSON.stringify(state?.__state?.value ?? {})
  })

  const style = useAnimatedStyle(() => {
    const final = {}
    // const animateStyle = animateSV.value || {}
    const variantStyle: Animate = state?.__state?.value || {}
    // const variantStyle: Animate = JSON.parse(variantDerived.value)

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

      if (key === 'transform' && __DEV__) {
        console.error(
          'Used `transform` array prop for animating styles. This is not supported. Instead of transform: [{ scale: 1 }] please use the values directly, such as {scale: 1}.'
        )
      }

      const initialValue = initialStyle[key]
      let value = animateStyle[key] || variantStyle[key]

      if (initialValue != null) {
        // if we haven't mounted, or if there's no other value to use besides the initial one, use it.
        if (isMounted.value === false || !value) {
          final[key] = initialValue
          return
        }
      }
      const callback: (canceled: boolean) => void = () => {
        // no-op for now
      }

      // first, let's get the config & delay for this animation
      let animationType: Required<TransitionConfig>['type'] = 'spring'
      // say that we're looking at `width`
      // first, check if we have transition.width.type
      if ((transition as any)?.[key as keyof Animate]?.type) {
        animationType = (transition as any)[key]?.type
      } else if (transition?.type) {
        // otherwise, fallback to transition.type
        animationType = transition.type
      }

      let delayMs: TransitionConfig['delay'] = defaultDelay

      if ((transition as any)?.[key as keyof Animate]?.delay != null) {
        delayMs = (transition as any)?.[key as keyof Animate]?.delay
      } else if (transition?.delay != null) {
        delayMs = transition.delay
      }

      let config = {}
      let animation: Function = withSpring

      if (animationType === 'timing') {
        const duration =
          ((transition as any)?.[
            key as keyof Animate
          ] as Animated.WithTimingConfig)?.duration ??
          (transition as Animated.WithTimingConfig)?.duration ??
          animationDefaults['timing'].duration

        const easing =
          ((transition as any)?.[
            key as keyof Animate
          ] as Animated.WithTimingConfig)?.easing ??
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
        // TODO this doesn't work for now
        // if (__DEV__) {
        //   console.error(
        //     `[${PackageName}]: You passed transition type: decay, but this isn't working for now. Honestly, not sure why yet. Try passing other transition fields, like clamp, velocity, and deceleration. If that solves it, please open an issue at let me know.`
        //   )
        // }
        animation = withDecay
        config = {
          velocity: 2,
        }
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
            `[${PackageName}]: You passed ${key}: ${JSON.stringify(
              value
            )}, but color values aren't supported yet due to a bug in Reanimated 2. ☹️ 
                
Please go to https://github.com/software-mansion/react-native-reanimated/issues/845 and comment so that this bug can get fixed!`
          )
        }
        value = processColor(value)
      }

      if (Array.isArray(value)) {
        // we have a sequence

        if (typeof value[0] === 'object') {
          // TODO ALLOW for objects here with custom config, such as delay, etc
        }

        if (isTransform(key)) {
          // we have a sequence of transforms
          final['transform'] = final['transform'] || []
          if (transition?.[key]?.delay != null) {
            delayMs = transition?.[key]?.delay
          }

          const sequence = value.map((sequenceStep) => {
            // allow us to define a delay per step!
            let stepDelay = delayMs
            if (
              typeof sequenceStep === 'object' &&
              sequenceStep?.delay != null
            ) {
              stepDelay = sequenceStep?.delay
            }
            const sequenceTransformValue = animation(
              sequenceStep,
              config,
              callback
            )
            if (stepDelay != null) {
              return withDelay(stepDelay, sequenceTransformValue)
            } else {
              return sequenceTransformValue
            }
          })

          const transform = {}

          transform[key] = withSequence(sequence[0], ...sequence.slice(1))

          final['transform'].push(transform)
        } else {
          // we have a normal sequence of items
          // shadows not supported
          const sequence = value.map((sequenceStep) => {
            const step = animation(sequenceStep, config, callback)

            if (delayMs != null && typeof delayMs === 'number') {
              return withDelay(delayMs, step)
            } else {
              return step
            }
          })
          final[key] = withSequence(sequence[0], ...sequence.slice(1))
        }
      } else if (isTransform(key)) {
        final['transform'] = final['transform'] || []
        // const transformKey = Object.keys(transformProp)[0]
        // const transformValue = transformProp[transformKey]

        if (transition?.[key]?.delay != null) {
          delayMs = transition?.[key]?.delay
        }

        const transform = {}
        const finalValue = animation(value, config, callback)
        if (delayMs != null) {
          transform[key] = withDelay(delayMs, finalValue)
        } else {
          transform[key] = finalValue
        }

        final['transform'].push(transform)
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
