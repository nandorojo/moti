import type {
  PresenceContext,
  usePresence as useFramerPresence,
} from 'framer-motion'
import { useEffect, useMemo } from 'react'
import type { TransformsStyle } from 'react-native'
import {
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
import type {
  WithDecayConfig,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated'

import { PackageName } from './constants/package-name'
import type {
  InlineOnDidAnimate,
  MotiProps,
  MotiTransition,
  SequenceItem,
  Transforms,
  TransitionConfig,
  WithTransition,
  SequenceItemObject,
} from './types'

const debug = (...args: any[]) => {
  'worklet'

  // @ts-ignore
  if (!global.shouldDebugMoti) {
    return
  }

  if (args) {
    // hi
  }
  console.log('[moti]', ...args)
}

const isColor = (styleKey: string) => {
  'worklet'
  const keys = {
    backgroundColor: true,
    borderBottomColor: true,
    borderLeftColor: true,
    borderRightColor: true,
    borderTopColor: true,
    color: true,
    shadowColor: true,
    borderColor: true,
    borderEndColor: true,
    borderStartColor: true,
  }

  return Boolean(keys[styleKey])
}

const isTransform = (styleKey: string) => {
  'worklet'

  const transforms: Record<keyof Transforms, true> = {
    perspective: true,
    rotate: true,
    rotateX: true,
    rotateY: true,
    rotateZ: true,
    scale: true,
    scaleX: true,
    scaleY: true,
    translateX: true,
    translateY: true,
    skewX: true,
    skewY: true,
  }

  return Boolean(transforms[styleKey])
}

function animationDelay<Animate>(
  _key: string,
  transition: MotiTransition<Animate> | undefined,
  defaultDelay?: number
) {
  'worklet'
  const key = _key as keyof Animate
  let delayMs: TransitionConfig['delay'] = defaultDelay

  if (transition?.[key]?.delay != null) {
    delayMs = transition?.[key]?.delay
  } else if (transition?.delay != null) {
    delayMs = transition.delay
  }

  return {
    delayMs,
  }
}

const withSpringConfigKeys: (keyof WithSpringConfig)[] = [
  'stiffness',
  'overshootClamping',
  'restDisplacementThreshold',
  'restSpeedThreshold',
  'velocity',
  'reduceMotion',
  'mass',
  'damping',
  'duration',
  'dampingRatio',
]

function animationConfig<Animate>(
  styleProp: string,
  transition: MotiTransition<Animate> | undefined
) {
  'worklet'

  const key = styleProp as Extract<keyof Animate, string>
  let repeatCount = 0
  let repeatReverse = true

  let animationType: Required<TransitionConfig>['type'] = 'spring'
  if (isColor(key) || key === 'opacity') animationType = 'timing'

  const styleSpecificTransition = transition?.[key as any]

  // say that we're looking at `width`
  // first, check if we have transition.width.type

  if (styleSpecificTransition?.type) {
    animationType = styleSpecificTransition.type
  } else if (transition?.type) {
    // otherwise, fallback to transition.type
    animationType = transition.type
  }

  const loop = styleSpecificTransition?.loop ?? transition?.loop

  if (loop != null) {
    repeatCount = loop ? -1 : 0
  }

  if (styleSpecificTransition?.repeat != null) {
    repeatCount = styleSpecificTransition?.repeat
  } else if (transition?.repeat != null) {
    repeatCount = transition.repeat
  }

  if (styleSpecificTransition?.repeatReverse != null) {
    repeatReverse = styleSpecificTransition.repeatReverse
  } else if (transition?.repeatReverse != null) {
    repeatReverse = transition.repeatReverse
  }

  // debug({ loop, key, repeatCount, animationType })

  let config = {}
  // so sad, but fix it later :(
  let animation = (...props: any): any => props

  if (animationType === 'timing') {
    const duration =
      (transition?.[key] as WithTimingConfig | undefined)?.duration ??
      (transition as WithTimingConfig | undefined)?.duration

    const easing =
      (transition?.[key] as WithTimingConfig | undefined)?.easing ??
      (transition as WithTimingConfig | undefined)?.easing

    if (easing) {
      config['easing'] = easing
    }
    if (duration != null) {
      config['duration'] = duration
    }
    animation = withTiming
  } else if (animationType === 'spring') {
    animation = withSpring
    config = {} as WithSpringConfig
    for (const configKey of withSpringConfigKeys) {
      const styleSpecificConfig = transition?.[key]?.[configKey]
      const transitionConfigForKey = transition?.[configKey]

      if (styleSpecificConfig != null) {
        config[configKey] = styleSpecificConfig
      } else if (transitionConfigForKey != null) {
        config[configKey] = transitionConfigForKey
      }
    }
  } else if (animationType === 'decay') {
    animation = withDecay
    config = {}
    const configKeys: (keyof WithDecayConfig)[] = [
      'clamp',
      'velocity',
      'deceleration',
      'velocityFactor',
      'reduceMotion',
      'velocityFactor',
    ]
    for (const configKey of configKeys) {
      const styleSpecificConfig = transition?.[key]?.[configKey]
      const transitionConfigForKey = transition?.[configKey]

      if (styleSpecificConfig != null) {
        config[configKey] = styleSpecificConfig
      } else if (transitionConfigForKey != null) {
        config[configKey] = transitionConfigForKey
      }
    }
  } else if (animationType === 'no-animation') {
    animation = (value) => value
    config = {}
    repeatCount = 0
  }

  return {
    animation,
    config,
    repeatReverse,
    repeatCount,
    shouldRepeat: !!repeatCount,
  }
}

const getSequenceArray = (
  sequenceKey: string,
  sequenceArray: SequenceItem<any>[],
  delayMs: number | undefined,
  config: object,
  animation: (...props: any) => any,
  callback: (
    completed: boolean | undefined,
    value: any | undefined,
    info: {
      attemptedSequenceValue: any
    }
  ) => void
) => {
  'worklet'

  const sequence: any[] = []

  for (const step of sequenceArray) {
    const shouldPush =
      typeof step === 'object'
        ? step && step?.value != null && step?.value !== false
        : step != null && step !== false
    let stepOnDidAnimate: SequenceItemObject<any>['onDidAnimate']
    if (shouldPush) {
      let stepDelay = delayMs
      let stepValue = step
      let stepConfig = Object.assign({}, config)
      let stepAnimation = animation as
        | typeof withTiming
        | typeof withSpring
        | typeof withDecay
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
        stepOnDidAnimate = step.onDidAnimate
      }

      const sequenceValue = stepAnimation(
        stepValue,
        stepConfig as any,
        (completed = false, maybeValue) => {
          'worklet'
          callback(completed, maybeValue, {
            attemptedSequenceValue: stepValue,
          })
          if (stepOnDidAnimate) {
            runOnJS(stepOnDidAnimate)(completed, maybeValue, {
              attemptedSequenceItemValue: stepValue,
              attemptedSequenceArray: maybeValue,
            })
          }
        }
      )
      if (stepDelay != null) {
        sequence.push(withDelay(stepDelay, sequenceValue))
      } else {
        sequence.push(sequenceValue)
      }
    }
  }

  return sequence
}

export function useMotify<Animate>({
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
  usePresenceValue,
  presenceContext,
}: MotiProps<Animate> & {
  presenceContext?: Pick<
    NonNullable<React.ContextType<typeof PresenceContext>>,
    'custom' | 'initial'
  > | null
  usePresenceValue?: ReturnType<typeof useFramerPresence>
}) {
  const isMounted = useSharedValue(false)
  const [isPresent, safeToUnmount] = usePresenceValue ?? []

  const disableInitialAnimation =
    presenceContext?.initial === false && !animateInitialState

  const { custom, reanimatedSafeToUnmount, reanimatedOnDidAnimate } = useMemo(
    () => ({
      custom: () => {
        'worklet'
        return presenceContext?.custom
      },
      reanimatedSafeToUnmount: () => {
        safeToUnmount?.()
      },
      reanimatedOnDidAnimate: (
        ...args: Parameters<NonNullable<typeof onDidAnimate>>
      ) => {
        onDidAnimate?.(...args)
      },
    }),
    [onDidAnimate, presenceContext, safeToUnmount]
  )

  const hasExitStyle = Boolean(
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
    const variantStyle: Animate & WithTransition = state?.__state?.value || {}

    let animateStyle: Animate

    if (animateProp && 'value' in animateProp) {
      animateStyle = (animateProp.value || {}) as Animate
    } else {
      animateStyle = (animateProp || {}) as Animate
    }

    debug('style', animateStyle)

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

    const exitingStyleProps: Record<string, boolean> = {}

    const disabledExitStyles = new Set([
      'position',
      'zIndex',
      'borderTopStyle',
      'borderBottomStyle',
      'borderLeftStyle',
      'borderRightStyle',
      'borderStyle',
      'pointerEvents',
      'outline',
    ])
    Object.keys(exitStyle || {}).forEach((key) => {
      if (!disabledExitStyles.has(key)) {
        exitingStyleProps[key] = true
      }
    })

    // allow shared values as transitions
    let transition: MotiTransition<Animate> | undefined
    if (transitionProp && 'value' in transitionProp) {
      transition = transitionProp.value
    } else {
      transition = transitionProp
    }

    // let the state prop drive transitions too
    if (variantStyle.transition) {
      transition = Object.assign({}, transition, variantStyle.transition)
    }

    if (isExiting && exitTransitionProp) {
      let exitTransition: MotiTransition<Animate> | undefined
      if (exitTransitionProp && 'value' in exitTransitionProp) {
        exitTransition = exitTransitionProp.value
      } else if (typeof exitTransitionProp == 'function') {
        exitTransition = exitTransitionProp(custom())
      } else {
        exitTransition = exitTransitionProp
      }

      transition = Object.assign({}, transition, exitTransition)
    }

    // need to use forEach to work with Hermes...https://github.com/nandorojo/moti/issues/214#issuecomment-1399055535
    Object.keys(mergedStyles as any).forEach((key) => {
      let value = mergedStyles[key]

      let inlineOnDidAnimate: InlineOnDidAnimate<any> | undefined

      if (typeof value === 'object' && value && 'onDidAnimate' in value) {
        inlineOnDidAnimate = value.onDidAnimate
        value = value.value
      }

      const { animation, config, shouldRepeat, repeatCount, repeatReverse } =
        animationConfig(key, transition)

      const callback: (
        completed: boolean | undefined,
        value: any | undefined,
        info?: {
          attemptedSequenceValue?: any
          transformKey?: string
        }
      ) => void = (completed = false, recentValue, info) => {
        if (onDidAnimate) {
          runOnJS(reanimatedOnDidAnimate as any)(
            key as any,
            completed,
            recentValue,
            {
              attemptedValue: value,
              attemptedSequenceItemValue: info?.attemptedSequenceValue,
            }
          )
        }
        if (inlineOnDidAnimate) {
          runOnJS(inlineOnDidAnimate)(completed, recentValue, {
            attemptedValue: value,
          })
        }
        if (isExiting) {
          exitingStyleProps[key] = false
          const areStylesExiting =
            Object.values(exitingStyleProps).some(Boolean)
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
              const sequence = getSequenceArray(
                transformKey,
                transformValue,
                delayMs,
                config,
                animation,
                callback
              )

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

              let configKey = transformKey
              if (
                transition &&
                'transform' in transition &&
                !(configKey in transition)
              ) {
                configKey = 'transform'
              }

              const {
                animation,
                config,
                shouldRepeat,
                repeatCount,
                repeatReverse,
              } = animationConfig(configKey, transition)

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

            if (
              Object.keys(transform).length &&
              Array.isArray(final['transform'])
            ) {
              final['transform'].push(transform)
            }
          })
        }
      } else if (Array.isArray(value)) {
        // we have a sequence

        const sequence = getSequenceArray(
          key,
          value,
          delayMs,
          config,
          animation,
          callback
        )
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
        for (const innerStyleKey in value || {}) {
          let finalValue = animation(value, config, callback)

          if (shouldRepeat) {
            finalValue = withRepeat(finalValue, repeatCount, repeatReverse)
          }

          if (delayMs != null) {
            final[key][innerStyleKey] = withDelay(delayMs, finalValue)
          } else {
            final[key][innerStyleKey] = finalValue
          }
        }
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

    if (!final.transform?.length) {
      delete final.transform
    }

    return final
    // @ts-ignore complex union lol...
  }, [
    animateProp,
    custom,
    defaultDelay,
    disableInitialAnimation,
    exitProp,
    exitTransitionProp,
    fromProp,
    hasExitStyle,
    isMounted,
    isPresent,
    onDidAnimate,
    reanimatedOnDidAnimate,
    reanimatedSafeToUnmount,
    state,
    stylePriority,
    transitionProp,
  ])

  useEffect(
    function allowUnMountIfMissingExit() {
      if (fromProp && isMounted.value === false) {
        // put this here just to avoid having another useEffect
        isMounted.value = true
      }
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
