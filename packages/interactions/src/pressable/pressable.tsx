import React, { useRef, useCallback } from 'react'
import { Platform, Pressable } from 'react-native'
import {
  TouchableWithoutFeedback,
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  runOnJS,
  useDerivedValue,
  useAnimatedGestureHandler,
} from 'react-native-reanimated'
import { MotiView } from '@motify/components'
import type { MotiPressableInteractionState, MotiPressableProps } from './types'

const AnimatedTouchable = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
)

export function MotiPressable(props: MotiPressableProps) {
  const {
    animate,
    from,
    exit,
    children,
    exitTransition,
    transition,
    style,
    onPressOut,
    onPressIn,
    onHoverIn,
    onHoverOut,
    onPress,
    onLongPress,
    hitSlop,
    disabled,
  } = props

  // const makeStyle = useCallback(
  //   (interaction: MotiPressableInteractionState) => {
  //     'worklet'

  //     if (typeof animate === 'function') {
  //       return animate(interaction)
  //     }

  //     return animate
  //   },
  //   [animate]
  // )

  const hovered = useSharedValue(false)
  const pressed = useSharedValue(false)

  const interaction = useDerivedValue<MotiPressableInteractionState>(() => ({
    hovered: hovered.value,
    pressed: pressed.value,
  }))

  // const whenPress = () => onPress?.()

  // const tapHandler = useAnimatedGestureHandler<
  //   TapGestureHandlerGestureEvent,
  //   {
  //     shouldTriggerPress: boolean
  //   }
  // >({
  //   onStart(_, context) {
  //     console.log('[start]')
  //     context.shouldTriggerPress = true
  //     pressed.value = true
  //   },
  //   onEnd(_, context) {
  //     console.log('[end]')
  //     pressed.value = false
  //     if (context.shouldTriggerPress) {
  //       if (onPress && !disabled) {
  //         runOnJS(whenPress)()
  //       }
  //       context.shouldTriggerPress = false
  //     }
  //   },
  //   onCancel(_, context) {
  //     console.log('[cancel]')
  //     context.shouldTriggerPress = false
  //     pressed.value = false
  //   },
  //   onFail(_, context) {
  //     console.log('[fail]')
  //     context.shouldTriggerPress = false
  //     pressed.value = false
  //   },
  //   onFinish(_, context) {
  //     console.log('[finish]')
  //     context.shouldTriggerPress = false
  //     pressed.value = false
  //   },
  // })

  const __state = useDerivedValue(() => {
    if (typeof animate === 'function') {
      return animate(interaction.value)
    }

    return animate
  }, [animate, interaction])

  const state = useRef({ __state }).current

  const updateInteraction = (
    event: keyof MotiPressableInteractionState,
    enabled: boolean,
    callback?: () => void
  ) => () => {
    'worklet'

    if (event === 'hovered') {
      hovered.value = enabled
    } else if (event === 'pressed') {
      pressed.value = enabled
    }
    if (callback) {
      runOnJS(callback)()
    }
  }

  const child = (
    <MotiView
      from={from}
      exit={exit}
      transition={transition}
      exitTransition={exitTransition}
      state={state}
      style={style}
    >
      {children}
    </MotiView>
  )

  if (Platform.OS === 'web') {
    return (
      <Pressable
        // @ts-expect-error react-native-web doesn't have types 😢
        onHoverIn={updateInteraction('hovered', true, onHoverIn)}
        onHoverOut={updateInteraction('hovered', false, onHoverOut)}
        onPressIn={updateInteraction('pressed', true, onPressIn)}
        onPressOut={updateInteraction('pressed', false, onPressOut)}
        onLongPress={onLongPress}
        hitSlop={hitSlop}
        disabled={disabled}
      >
        {children}
      </Pressable>
    )
  }

  return (
    <AnimatedTouchable
      onPressIn={updateInteraction('pressed', true, onPressIn)}
      onPressOut={updateInteraction('pressed', false, onPressOut)}
      onLongPress={onLongPress}
      hitSlop={hitSlop}
      disabled={disabled}
      onPress={onPress}
    >
      {child}
    </AnimatedTouchable>
  )
}
