import React, { useMemo, ReactNode } from 'react'
import { Platform, Pressable } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated'
import { MotiView } from '@motify/components'
import type { MotiPressableInteractionState, MotiPressableProps } from './types'
import {
  MotiPressableContext,
  useMotiPressableContext,
  INTERACTION_CONTAINER_ID,
} from './context'

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
    containerStyle,
    dangerouslySilenceDuplicateIdsWarning = false,
    id,
  } = props

  const hovered = useSharedValue(false)
  const pressed = useSharedValue(false)

  const interaction = useDerivedValue<MotiPressableInteractionState>(() => ({
    hovered: hovered.value,
    pressed: pressed.value,
  }))

  const __state = useDerivedValue(() => {
    if (typeof animate === 'function') {
      return animate(interaction.value)
    }

    return animate
  }, [animate, interaction])

  const state = useMemo(() => ({ __state }), [__state])

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

  let node: ReactNode
  if (Platform.OS === 'web') {
    node = (
      <Pressable
        // @ts-expect-error react-native-web doesn't have types 😢
        onHoverIn={updateInteraction('hovered', true, onHoverIn)}
        onHoverOut={updateInteraction('hovered', false, onHoverOut)}
        onPressIn={updateInteraction('pressed', true, onPressIn)}
        onPressOut={updateInteraction('pressed', false, onPressOut)}
        onLongPress={onLongPress}
        hitSlop={hitSlop}
        disabled={disabled}
        style={containerStyle}
      >
        {child}
      </Pressable>
    )
  } else {
    node = (
      <AnimatedTouchable
        onPressIn={updateInteraction('pressed', true, onPressIn)}
        onPressOut={updateInteraction('pressed', false, onPressOut)}
        onLongPress={onLongPress}
        hitSlop={hitSlop}
        disabled={disabled}
        onPress={onPress}
        // @ts-expect-error missing containerStyle type
        // TODO there is an added View child here, which Pressable doesn't  have.
        // should we wrap the pressable children too?
        containerStyle={containerStyle}
      >
        {child}
      </AnimatedTouchable>
    )
  }

  const context = useMotiPressableContext()

  if (
    !dangerouslySilenceDuplicateIdsWarning &&
    id &&
    context?.containers &&
    id in context.containers
  ) {
    console.warn(
      `[MotiPressable] Duplicate id ${id} used. This means that you incorrectly placed a <MotiPressable id="${id}" /> component inside another one with the same id.

To silence this warning without solving the actual issue, you can use the dangerouslySilenceDuplicateIdsWarning prop. But you should probably refactor your code instead.`
    )
  }

  return (
    <MotiPressableContext.Provider
      value={useMemo(() => {
        const interactions = {
          containers: {
            ...context?.containers,
            [INTERACTION_CONTAINER_ID]: interaction,
          },
        }
        if (id) {
          interactions.containers[id] = interaction
        }
        return interactions
      }, [context?.containers, id, interaction])}
    >
      {node}
    </MotiPressableContext.Provider>
  )
}
