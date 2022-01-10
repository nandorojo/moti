import React, { useMemo, ReactNode, forwardRef } from 'react'
import { Platform, Pressable } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import {
  useSharedValue,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated'
import type { View } from 'react-native'
import type { MotiPressableInteractionState, MotiPressableProps } from './types'
import {
  MotiPressableContext,
  useMotiPressableContext,
  INTERACTION_CONTAINER_ID,
} from './context'
import { Hoverable } from './hoverable'
import { motify } from 'packages/core/lib/typescript/src'

const MotiTouchable = motify(TouchableWithoutFeedback)()
const MotiRNPressable = motify(Pressable)()

export const MotiPressable = forwardRef<View, MotiPressableProps>(
  function MotiPressable(props, ref) {
    const {
      animate,
      from,
      exit,
      children,
      exitTransition,
      transition: transitionProp,
      style,
      onPressOut,
      onPressIn,
      onHoverIn,
      onHoverOut,
      onPress,
      onLongPress,
      hitSlop,
      disabled,
      dangerouslySilenceDuplicateIdsWarning = false,
      id,
      hoveredValue,
      pressedValue,
      onLayout,
      // Accessibility props
      accessibilityActions,
      accessibilityElementsHidden,
      accessibilityHint,
      accessibilityIgnoresInvertColors,
      accessibilityLabel,
      accessibilityLiveRegion,
      accessibilityRole,
      accessibilityState,
      accessibilityValue,
      accessibilityViewIsModal,
      accessible,
      onAccessibilityTap,
      onAccessibilityAction,
      onAccessibilityEscape,
      importantForAccessibility,
      onFocus,
      onBlur,
    } = props

    const _hovered = useSharedValue(false)
    const _pressed = useSharedValue(false)

    const hovered = hoveredValue || _hovered
    const pressed = pressedValue || _pressed

    const interaction = useDerivedValue<MotiPressableInteractionState>(
      () => ({
        hovered: hovered.value,
        pressed: pressed.value,
      }),
      [hovered, pressed]
    )

    const transition = useDerivedValue(() => {
      if (typeof transitionProp === 'function') {
        return transitionProp(interaction.value)
      }

      return transitionProp || {}
    }, [transitionProp, interaction])

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

    let node: ReactNode
    if (Platform.OS === 'web') {
      node = (
        <Hoverable
          onHoverIn={updateInteraction('hovered', true, onHoverIn)}
          onHoverOut={updateInteraction('hovered', false, onHoverOut)}
          childRef={ref}
        >
          <MotiRNPressable
            onLongPress={onLongPress}
            hitSlop={hitSlop}
            disabled={disabled}
            onPress={onPress}
            onPressIn={updateInteraction('pressed', true, onPressIn)}
            onPressOut={updateInteraction('pressed', false, onPressOut)}
            ref={ref}
            onLayout={onLayout}
            // Accessibility props
            accessibilityActions={accessibilityActions}
            accessibilityElementsHidden={accessibilityElementsHidden}
            accessibilityHint={accessibilityHint}
            accessibilityIgnoresInvertColors={accessibilityIgnoresInvertColors}
            accessibilityLabel={accessibilityLabel}
            accessibilityLiveRegion={accessibilityLiveRegion}
            accessibilityRole={accessibilityRole}
            accessibilityState={accessibilityState}
            accessibilityValue={accessibilityValue}
            accessibilityViewIsModal={accessibilityViewIsModal}
            accessible={accessible}
            onAccessibilityTap={onAccessibilityTap}
            onAccessibilityAction={onAccessibilityAction}
            onAccessibilityEscape={onAccessibilityEscape}
            importantForAccessibility={importantForAccessibility}
            // @ts-expect-error RNW types
            onFocus={onFocus}
            onBlur={onBlur}
            from={from}
            exit={exit}
            transition={transition}
            exitTransition={exitTransition}
            state={state}
            style={style}
          >
            {children}
          </MotiRNPressable>
        </Hoverable>
      )
    } else {
      node = (
        <MotiTouchable
          onPressIn={updateInteraction('pressed', true, onPressIn)}
          onPressOut={updateInteraction('pressed', false, onPressOut)}
          onLongPress={onLongPress}
          hitSlop={hitSlop}
          disabled={disabled}
          onPress={onPress}
          ref={ref}
          onLayout={onLayout}
          // Accessibility props
          accessibilityActions={accessibilityActions}
          accessibilityElementsHidden={accessibilityElementsHidden}
          accessibilityHint={accessibilityHint}
          accessibilityIgnoresInvertColors={accessibilityIgnoresInvertColors}
          accessibilityLabel={accessibilityLabel}
          accessibilityLiveRegion={accessibilityLiveRegion}
          accessibilityRole={accessibilityRole}
          accessibilityState={accessibilityState}
          accessibilityValue={accessibilityValue}
          accessibilityViewIsModal={accessibilityViewIsModal}
          accessible={accessible}
          onAccessibilityTap={onAccessibilityTap}
          onAccessibilityAction={onAccessibilityAction}
          onAccessibilityEscape={onAccessibilityEscape}
          importantForAccessibility={importantForAccessibility}
          onFocus={onFocus}
          onBlur={onBlur}
          from={from}
          exit={exit}
          transition={transition}
          exitTransition={exitTransition}
          state={state}
          style={style}
        >
          {children}
        </MotiTouchable>
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
