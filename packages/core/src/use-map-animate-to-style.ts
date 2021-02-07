import { usePresence } from 'framer-motion'
import { useCallback, useEffect } from 'react'
import type { TransformsStyle } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withSpring,
  withTiming,
  withDelay,
  withRepeat,
  withSequence,
  runOnJS,
} from 'react-native-reanimated'
import { PackageName } from './constants/package-name'
import type { MotiProps, Transforms, TransitionConfig } from './types'

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

function animationDelay<Animate>(
  key: string,
  transition: MotiProps<Animate>['transition'],
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
  transition: MotiProps<Animate>['transition']
) {
  'worklet'

  const key = styleProp
  let repeatCount = 0
  let repeatReverse = true

  let animationType: Required<TransitionConfig>['type'] = 'spring'
  if (isColor(key) || key === 'opacity') animationType = 'timing'

  // say that we're looking at `width`
  // first, check if we have transition.width.type
  if ((transition as any)?.[key as keyof Animate]?.type) {
    animationType = (transition as any)[key]?.type
  } else if (transition?.type) {
    // otherwise, fallback to transition.type
    animationType = transition.type
  }

  if ((transition as any)?.[key as keyof Animate]?.loop) {
    repeatCount = Infinity
  } else if (transition?.loop) {
    repeatCount = Infinity
  }

  if ((transition as any)?.[key as keyof Animate]?.repeat != null) {
    repeatCount = (transition as any)?.[key as keyof Animate]?.repeat
  } else if (transition?.repeat) {
    repeatCount = transition.repeat
  }

  if ((transition as any)?.[key as keyof Animate]?.repeatReverse != null) {
    repeatReverse = (transition as any)?.[key as keyof Animate]?.repeatReverse
  } else if (transition?.repeatReverse) {
    repeatReverse = transition.repeatReverse
  }

  let config = {}
  // so sad, but fix it later :(
  let animation = (...props: any): any => props

  if (animationType === 'timing') {
    const duration =
      ((transition as any)?.[key as keyof Animate] as Animated.WithTimingConfig)
        ?.duration ?? (transition as Animated.WithTimingConfig)?.duration

    const easing =
      ((transition as any)?.[key as keyof Animate] as Animated.WithTimingConfig)
        ?.easing ?? (transition as Animated.WithTimingConfig)?.easing

    if (easing) {
      config['easing'] = easing
    }
    if (duration != null) {
      config['duration'] = duration
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

      if (styleSpecificConfig != null) {
        config[configKey] = styleSpecificConfig
      } else if (transitionConfigForKey != null) {
        config[configKey] = transitionConfigForKey
      }
    })
  } else if (animationType === 'decay') {
    // TODO decay doesn't work for now
    // neither does __DEV__
    // if (__DEV__) {
    console.error(
      `[${PackageName}]: You passed transition type: decay, but this isn't working for now. Honestly, not sure why yet. Try passing other transition fields, like clamp, velocity, and deceleration. If that solves it, please open an issue and let me know.`
    )
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
      // is this necessary ^ don't think so...?
      const styleSpecificConfig = transition?.[key]?.[configKey]
      const transitionConfigForKey = transition?.[configKey]

      if (styleSpecificConfig != null) {
        config[configKey] = styleSpecificConfig
      } else if (transitionConfigForKey != null) {
        config[configKey] = transitionConfigForKey
      }
    })
  }

  return {
    animation,
    config,
    repeatReverse,
    repeatCount,
    shouldRepeat: !!repeatCount,
  }
}

const empty = {
  object: {},
}

const debug = (...args: any[]) => {
  'worklet'
  args
  // console.log('[moti-bug]', ...args)
}

export default function useMapAnimateToStyle<Animate>({
  animate,
  from = false,
  transition,
  delay: defaultDelay,
  state,
  stylePriority = 'state',
  onDidAnimate,
  exit,
}: MotiProps<Animate>) {
  const isMounted = useSharedValue(false, false)
  const [isPresent, safeToUnmount] = usePresence()

  const reanimatedSafeToUnmount = useCallback(() => {
    safeToUnmount?.()
  }, [safeToUnmount])

  const reanimatedOnDidAnimated = useCallback<NonNullable<typeof onDidAnimate>>(
    (...args) => {
      onDidAnimate?.(...args)
    },
    [onDidAnimate]
  )

  // is any of this necessary?
  const initialSV = useSharedValue(from || empty.object)
  const animateSV = useSharedValue(animate || empty.object)
  const exitSV = useSharedValue(exit || empty.object)
  const hasExitStyle =
    typeof exit === 'object' && !!Object.keys(exit ?? empty.object).length

  debug('before animated style')
  const style = useAnimatedStyle(() => {
    debug('inside animated style')

    const final = {
      // initializing here fixes reanimated object.__defineProperty bug(?)
      transform: [] as TransformsStyle['transform'],
    }
    const variantStyle: Animate = state?.__state?.value || {}

    const animateStyle = animateSV.value || {}
    const initialStyle = initialSV.value || {}
    const exitStyle = exitSV.value || {}

    const isExiting = !isPresent && hasExitStyle

    let mergedStyles: Animate = {} as Animate
    if (stylePriority === 'state') {
      mergedStyles = { ...animateStyle, ...variantStyle }
    } else {
      mergedStyles = { ...variantStyle, ...animateStyle }
    }

    if (isExiting && exitStyle) {
      mergedStyles = exitStyle as any
    }

    debug('here')

    Object.keys(mergedStyles).forEach((key, index) => {
      const initialValue = initialStyle[key]
      const value = mergedStyles[key]

      const {
        animation,
        config,
        shouldRepeat,
        repeatCount,
        repeatReverse,
      } = animationConfig(key, transition)

      const callback: (canceled: boolean, value?: any) => void = (
        canceled,
        recentValue
      ) => {
        if (onDidAnimate) {
          runOnJS(reanimatedOnDidAnimated)(key as any, canceled, recentValue)
        }
        if (isExiting) {
          //   // if this is true, then we've finished our exit animations
          const isLastStyleKeyToAnimate =
            index + 1 === Object.keys(mergedStyles || {}).length
          if (isLastStyleKeyToAnimate) {
            runOnJS(reanimatedSafeToUnmount)()
          }
        }
      }

      if (initialValue != null) {
        // if we haven't mounted, or if there's no other value to use besides the initial one, use it.
        if (isMounted.value === false || value == null) {
          if (isTransform(key) && final.transform) {
            // this syntax avoids reanimated .__defineObject error
            const transform = {}
            transform[key] = animation(initialValue, config)

            // final.transform.push({ [key]: initialValue }) does not work!
            // @ts-ignore
            final.transform.push(transform)
            // console.log({ final })
          } else {
            final[key] = animation(initialValue, config)
          }
          return
        }
      }

      let { delayMs } = animationDelay(key, transition, defaultDelay)

      if (isColor(key)) {
        // TODO: FIX THIS
        // if (__DEV__) {
        if (
          typeof value === 'string' &&
          !value.startsWith('rgb') &&
          !value.startsWith('#')
        ) {
          console.error(
            `[${PackageName}]: You passed ${key}: ${value}, but not all color values are supported yet in Reanimated 2. ☹️

      Please use an rgb or hex formatted color.`
          )
        }
        // }
      }

      if (value == null || value === false) {
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
              return step?.value != null && step?.value !== false
            }
            return step != null && step !== false
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

              const {
                // TODO merge stepConfig = {...stepConfig, customConfig} when reanimated lets us...
                // as of now, it says multiple threads are interacting, IDK
                // config: customConfig,
                animation,
              } = animationConfig(key, transition)

              stepConfig = {
                ...stepConfig,
                //  ...customConfig
              }
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

          if (sequence.length) {
            const transform = {}

            transform[key] = withSequence(sequence[0], ...sequence.slice(1))

            // @ts-ignore
            final['transform'].push(transform)
          }
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
        let finalValue = animation(value, config, callback)
        if (shouldRepeat) {
          finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
        }
        if (delayMs != null) {
          transform[key] = withDelay(delayMs, finalValue)
        } else {
          transform[key] = finalValue
        }

        // @ts-ignore
        final['transform'].push(transform)
      } else if (typeof value === 'object') {
        // shadows
        final[key] = {}
        Object.keys(value || {}).forEach((innerStyleKey) => {
          let finalValue = animation(value, config, callback)

          if (shouldRepeat) {
            finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
          }

          if (delayMs != null) {
            final[key][innerStyleKey] = withDelay(delayMs, finalValue)
          } else {
            final[key][innerStyleKey] = finalValue
          }
        })
      } else {
        let finalValue = animation(value, config, callback)
        if (shouldRepeat) {
          finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
        }

        if (delayMs != null && typeof delayMs === 'number') {
          final[key] = withDelay(delayMs, finalValue)
        } else {
          final[key] = finalValue
        }
      }
    })

    debug('end of UAS', { final })

    return final
  })

  useEffect(() => {
    isMounted.value = true
  }, [isMounted])

  useEffect(
    function allowUnMountIfMissingExit() {
      if (!isPresent && !hasExitStyle) {
        safeToUnmount?.()
      }
    },
    [hasExitStyle, isPresent, safeToUnmount]
  )

  return {
    style,
  }
}
