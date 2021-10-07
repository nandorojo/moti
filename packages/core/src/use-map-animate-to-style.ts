import { PresenceContext, usePresence } from 'framer-motion'
import { useCallback, useContext, useEffect } from 'react'
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
import type {
  MotiProps,
  MotiTransition,
  SequenceItem,
  Transforms,
  TransitionConfig,
} from './types'

const debug = (...args: any[]) => {
  'worklet'
  if (args) {
    // hi
  }
  // console.log('[moti]', ...args)
}

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
  transition: MotiTransition<Animate> | undefined,
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
  transition: MotiTransition<Animate> | undefined
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

  const loop =
    (transition as any)?.[key as keyof Animate]?.loop ?? transition?.loop

  if (loop != null) {
    repeatCount = loop ? -1 : 0
  }

  if ((transition as any)?.[key as keyof Animate]?.repeat != null) {
    repeatCount = (transition as any)?.[key as keyof Animate]?.repeat
  } else if (transition?.repeat != null) {
    repeatCount = transition.repeat
  }

  if ((transition as any)?.[key as keyof Animate]?.repeatReverse != null) {
    repeatReverse = (transition as any)?.[key as keyof Animate]?.repeatReverse
  } else if (transition?.repeatReverse != null) {
    repeatReverse = transition.repeatReverse
  }

  debug({ loop, key, repeatCount, animationType })

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
      // velocity: 2,
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
    console.error(
      `[${PackageName}]: You passed transition type: decay, but this isn't working for now. Honestly, not sure why yet. Try passing other transition fields, like clamp, velocity, and deceleration. If that solves it, please open an issue and let me know.`
    )
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

export default function useMapAnimateToStyle<Animate>({
  animate: animateProp,
  from: fromProp = false,
  transition: transitionProp,
  exitTransition: exitTransitionProp,
  delay: defaultDelay,
  state,
  stylePriority = 'animate',
  onDidAnimate,
  exit: exitProp,
  animateInitialState = false,
}: MotiProps<Animate>) {
  const isMounted = useSharedValue(false)
  const [isPresent, safeToUnmount] = usePresence()
  const presence = useContext(PresenceContext)

  const disableInitialAnimation =
    presence?.initial === false && !animateInitialState
  const custom = useCallback(() => {
    'worklet'
    return presence?.custom
  }, [presence])

  const reanimatedSafeToUnmount = useCallback(() => {
    safeToUnmount?.()
  }, [safeToUnmount])

  const reanimatedOnDidAnimated = useCallback<NonNullable<typeof onDidAnimate>>(
    (...args) => {
      onDidAnimate?.(...args)
    },
    [onDidAnimate]
  )

  const hasExitStyle = !!(
    typeof exitProp === 'function' ||
    (typeof exitProp === 'object' &&
      exitProp &&
      Object.keys(exitProp).length > 0)
  )

  const style = useAnimatedStyle(() => {
    const final = {
      // initializing here fixes reanimated object.__defineProperty bug(?)
      transform: [] as TransformsStyle['transform'],
    }
    const variantStyle: Animate = state?.__state?.value || {}

    let animateStyle: Animate

    if (animateProp && 'value' in animateProp) {
      animateStyle = (animateProp.value || {}) as Animate
    } else {
      animateStyle = (animateProp || {}) as Animate
    }

    const initialStyle = fromProp || {}
    let exitStyle = exitProp || {}
    if (typeof exitStyle === 'function') {
      exitStyle = exitStyle(custom())
    }

    const isExiting = !isPresent && hasExitStyle

    let mergedStyles: Animate = {} as Animate
    if (stylePriority === 'state') {
      mergedStyles = Object.assign({}, animateStyle, variantStyle)
    } else {
      mergedStyles = Object.assign({}, variantStyle, animateStyle)
    }

    if (
      !isMounted.value &&
      !disableInitialAnimation &&
      Object.keys(initialStyle).length
    ) {
      mergedStyles = initialStyle as Animate
    } else {
      mergedStyles = Object.assign({}, initialStyle, mergedStyles)
    }

    if (isExiting && exitStyle) {
      mergedStyles = Object.assign({}, exitStyle) as any
    }

    debug('here')

    // reduce doesn't work with spreads/reanimated Objects!
    // const exitingStyleProps: Record<string, boolean> = Object.keys(
    //   mergedStyles || {}
    // ).reduce((obj, styleKey) => ({ ...obj, [styleKey]: true }), {})

    // use forEach instead!
    const exitingStyleProps: Record<string, boolean> = {}
    Object.keys(exitStyle || {}).forEach((key) => {
      exitingStyleProps[key] = true
    })

    // allow shared values as transitions
    let transition: MotiTransition<Animate> | undefined
    if (transitionProp && 'value' in transitionProp) {
      transition = transitionProp.value
    } else {
      transition = transitionProp
    }
    if (isExiting && exitTransitionProp) {
      let exitTransition: MotiTransition<Animate> | undefined
      if (exitTransitionProp && 'value' in exitTransitionProp) {
        exitTransition = exitTransitionProp.value
      } else {
        exitTransition = exitTransitionProp
      }

      transition = Object.assign({}, transition, exitTransition)
    }

    const transformKeys = Object.keys(mergedStyles).filter((key) =>
      isTransform(key)
    )

    if (transformKeys.length > 1) {
      console.error(
        `[${PackageName}] Multiple inline transforms found. This won't animate properly. Instead, pass these to a transform array: ${transformKeys.join(
          ', '
        )}`
      )
    }

    Object.keys(mergedStyles).forEach((key) => {
      // const initialValue = initialStyle[key]
      const value = mergedStyles[key]

      const {
        animation,
        config,
        shouldRepeat,
        repeatCount,
        repeatReverse,
      } = animationConfig(key, transition)

      const callback: (completed: boolean, value?: any) => void = (
        completed,
        recentValue
      ) => {
        if (onDidAnimate) {
          runOnJS(reanimatedOnDidAnimated)(key as any, completed, recentValue, {
            attemptedValue: value,
          })
        }
        if (isExiting) {
          exitingStyleProps[key] = false
          const areStylesExiting = Object.values(exitingStyleProps).some(
            Boolean
          )
          // if this is true, then we've finished our exit animations
          if (!areStylesExiting) {
            runOnJS(reanimatedSafeToUnmount)()
          }
        }
      }

      let { delayMs } = animationDelay(key, transition, defaultDelay)

      if (value == null || value === false) {
        // skip missing values
        // this is useful if you want to do {opacity: loading && 1}
        // without this, those values will break I think
        return
      }

      const getSequenceArray = (
        sequenceKey: string,
        sequenceArray: SequenceItem<any>[]
      ) => {
        'worklet'
        const sequence = sequenceArray
          .filter((step) => {
            // remove null, false values to allow for conditional styles
            if (step && typeof step === 'object') {
              return step?.value != null && step?.value !== false
            }
            return step != null && step !== false
          })
          .map((step) => {
            let stepDelay = delayMs
            let stepValue = step
            let stepConfig = Object.assign({}, config)
            let stepAnimation = animation
            if (typeof step === 'object') {
              // not allowed in Reanimated: { delay, value, ...transition } = step
              const stepTransition = Object.assign({}, step)

              delete stepTransition.delay
              delete stepTransition.value

              const { config: inlineStepConfig, animation } = animationConfig(
                sequenceKey,
                stepTransition
              )

              stepConfig = Object.assign({}, stepConfig, inlineStepConfig)
              stepAnimation = animation

              if (step.delay != null) {
                stepDelay = step.delay
              }
              stepValue = step.value
            }

            const sequenceValue = stepAnimation(stepValue, stepConfig, callback)
            if (stepDelay != null) {
              return withDelay(stepDelay, sequenceValue)
            }
            return sequenceValue
          })
          .filter(Boolean)

        return sequence
      }

      if (key === 'transform') {
        if (!Array.isArray(value)) {
          console.error(
            `[${PackageName}]: Invalid transform value. Needs to be an array.`
          )
        } else {
          value.forEach((transformObject) => {
            final['transform'] = final['transform'] || []
            const transformKey = Object.keys(transformObject)[0]
            const transformValue = transformObject[transformKey]
            const transform = {} as any

            if (Array.isArray(transformValue)) {
              // we have a sequence in this transform...
              const sequence = getSequenceArray(transformKey, transformValue)

              if (sequence.length) {
                let finalValue = withSequence(sequence[0], ...sequence.slice(1))
                if (shouldRepeat) {
                  finalValue = withRepeat(
                    finalValue,
                    repeatCount,
                    repeatReverse
                  )
                }
                transform[transformKey] = finalValue
              }
            } else {
              if (transition?.[transformKey]?.delay != null) {
                delayMs = transition?.[transformKey]?.delay
              }

              let finalValue = animation(transformValue, config, callback)
              if (shouldRepeat) {
                finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
              }
              if (delayMs != null) {
                transform[transformKey] = withDelay(delayMs, finalValue)
              } else {
                transform[transformKey] = finalValue
              }
            }

            if (Object.keys(transform).length) {
              final['transform'].push(transform)
            }
          })
        }
      } else if (Array.isArray(value)) {
        // we have a sequence

        const sequence = getSequenceArray(key, value)
        let finalValue = withSequence(sequence[0], ...sequence.slice(1))
        if (shouldRepeat) {
          finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
        }

        if (isTransform(key)) {
          // we have a sequence of transforms
          final['transform'] = final['transform'] || []

          if (sequence.length) {
            const transform = {}

            transform[key] = finalValue

            // @ts-expect-error transform had the wrong type
            final['transform'].push(transform)
          }
        } else {
          // we have a normal sequence of items
          // shadows not supported
          if (sequence.length) {
            final[key] = finalValue
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

        // @ts-expect-error transform had the wrong type
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

    // TODO
    // if (!final.transform?.length) {
    //   delete final.transform
    // }

    return final
  })

  useEffect(() => {
    isMounted.value = true
  }, [isMounted])

  useEffect(
    function allowUnMountIfMissingExit() {
      if (!isPresent && !hasExitStyle) {
        reanimatedSafeToUnmount()
      }
    },
    [hasExitStyle, isPresent, reanimatedSafeToUnmount]
  )

  return {
    style,
  }
}
