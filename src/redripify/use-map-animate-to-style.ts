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

function animationDelay<Animate>(
  key: string,
  transition: DripifyProps<Animate>['transition'],
  defaultDelay?: number
) {
  'worklet'
  let delayMs: TransitionConfig['delay'] = defaultDelay

  if ((transition as any)?.[key as keyof Animate]?.delay != null) {
    delayMs = (transition as any)?.[key as keyof Animate]?.delay
  } else if (transition?.delay != null) {
    delayMs = transition.delay
  }

  return {
    delayMs,
  }
}

function animationConfig<Animate>(
  styleProp: string,
  transition: DripifyProps<Animate>['transition']
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
      'worklet'
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
      deceleration: 2,
    }
    const configKeys: (keyof Animated.WithDecayConfig)[] = [
      'clamp',
      'velocity',
      'deceleration',
    ]
    configKeys.forEach((configKey) => {
      'worklet'
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
  const isMounted = useSharedValue(false, false)

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
    const final = {
      // initializing here fixes reanimated object.__defineProperty bug(?)
      transform: [],
    }
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

      // if (key === 'transform' && __DEV__) {
      //   console.error(
      //     'Used `transform` array prop for animating styles. This is not supported. Instead of transform: [{ scale: 1 }] please use the values directly, such as {scale: 1}.'
      //   )
      // }

      const initialValue = initialStyle[key]
      let value = animateStyle[key] || variantStyle[key]

      if (initialValue != null) {
        // if we haven't mounted, or if there's no other value to use besides the initial one, use it.
        if (isMounted.value === false || !value) {
          if (isTransform(key) && final.transform) {
            // this syntax avoids reanimated .__defineObject error
            const transform = {}
            transform[key] = initialValue

            // final.transform.push({ [key]: initialValue }) does not work!
            // @ts-ignore
            final.transform.push(transform)
            // console.log({ final })
          } else {
            final[key] = initialValue
          }
          return
        }
      }
      const callback: (canceled: boolean) => void = () => {
        'worklet'
        // no-op for now
      }

      const { animation, config } = animationConfig(key, transition)
      let { delayMs } = animationDelay(key, transition, defaultDelay)

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

      if (value == null || value == false) {
        // skip missing values
        // this is useful if you want to do {opacity: loading && 1}
        // without this, those values will break I think
        return
      }
      if (Array.isArray(value)) {
        // we have a sequence

        /**
         * There is some code duplication in this section and in the ones below.
         *
         * However, I prefer this for open source. It makes it easier for collaborators to identify issues without a million wrappers.
         *
         * If there's something *obvious* that would benefit from abstraction, we can. But let's keep it simple.
         */

        // remove null, false values to allow for conditional styles
        const sequence = value
          .filter((step) => {
            if (typeof step === 'object') {
              return step?.value != null && step?.value != false
            }
            return step != null && step != false
          })
          .map((step) => {
            let stepDelay = delayMs
            let stepValue = step
            let stepConfig = { ...config }
            let stepAnimation = animation
            if (typeof step === 'object') {
              // TODO this should spread from step, but reanimated won't allow this on JS thread?
              // const { delay, value, ...transition } = step
              const transition = step
              const { delay, value } = step

              const { config: customConfig, animation } = animationConfig(
                key,
                transition
              )

              stepConfig = { ...stepConfig }
              stepAnimation = animation
              if (delay != null) {
                stepDelay = delay
              }
              stepValue = value
            }

            const sequenceValue = stepAnimation(stepValue, stepConfig, callback)
            if (stepDelay != null) {
              return withDelay(stepDelay, sequenceValue)
            }
            return sequenceValue
          })
          .filter(Boolean)

        if (isTransform(key)) {
          // we have a sequence of transforms
          final['transform'] = final['transform'] || []

          const transform = {}

          if (sequence.length) {
            transform[key] = withSequence(sequence[0], ...sequence.slice(1))
          }

          final['transform'].push(transform)
        } else {
          // we have a normal sequence of items
          // shadows not supported
          if (sequence.length) {
            final[key] = withSequence(sequence[0], ...sequence.slice(1))
          }
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
