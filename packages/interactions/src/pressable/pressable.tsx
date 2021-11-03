import React, { useMemo, ReactNode, forwardRef } from 'react'
import { Platform, Pressable } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated'
import { MotiView } from '@motify/components'
import type { View } from 'react-native'
import type { MotiPressableInteractionState, MotiPressableProps } from './types'
import {
  MotiPressableContext,
  useMotiPressableContext,
  INTERACTION_CONTAINER_ID,
} from './context'
import Hoverable from './hoverable'

const AnimatedTouchable = Animated.createAnimatedComponent(
  TouchableWithoutFeedback
)

export const MotiPressable = forwardRef<View, MotiPressableProps>(
  function MotiPressable(props, ref) {
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
      hoveredValue,
      pressedValue,
    } = props

    const _hovered = useSharedValue(false)
    const _pressed = useSharedValue(false)

    const hovered = hoveredValue || _hovered
    const pressed = pressedValue || _pressed

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
        <Hoverable
          onHoverIn={updateInteraction('hovered', true, onHoverIn)}
          onHoverOut={updateInteraction('hovered', false, onHoverOut)}
          onPressIn={updateInteraction('pressed', true, onPressIn)}
          onPressOut={updateInteraction('pressed', false, onPressOut)}
        >
          <Pressable
            onLongPress={onLongPress}
            hitSlop={hitSlop}
            disabled={disabled}
            style={containerStyle}
            onPress={onPress}
            ref={ref}
          >
            {child}
          </Pressable>
        </Hoverable>
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
          ref={ref}
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
      console.error(
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
)
