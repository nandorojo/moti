import { useMemo, ReactNode, forwardRef } from 'react'
import { Pressable } from 'react-native'
import type { View } from 'react-native'
import {
  useSharedValue,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated'

import { View as MotiView } from '../../components/view'
import {
  MotiPressableContext,
  useMotiPressableContext,
  INTERACTION_CONTAINER_ID,
} from './context'
import { Hoverable } from './hoverable'
import type { MotiPressableInteractionState, MotiPressableProps } from './types'

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
      onKeyDown,
      onKeyUp,
      onPress,
      onLongPress,
      hitSlop,
      disabled,
      containerStyle,
      dangerouslySilenceDuplicateIdsWarning = false,
      id,
      hoveredValue,
      pressedValue,
      onLayout,
      onContainerLayout,
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
      href,
      testID,
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

    const updateInteraction =
      (
        event: keyof MotiPressableInteractionState,
        enabled: boolean,
        callback?: () => void
      ) =>
      () => {
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
        // TODO change API to this
        // animate={useMemo(() => {
        //   'worklet'

        //   if (typeof animate === 'function') {
        //     return animate(interaction.value)
        //   }

        //   return animate
        // }, [])}
        style={style}
        onLayout={onLayout}
      >
        {/* @ts-ignore */}
        {typeof children == 'function' ? children(interaction) : children}
      </MotiView>
    )

    let node: ReactNode
    // if (Platform.OS === 'web' || Platform.OS === 'android') {
    node = (
      <Hoverable
        onHoverIn={updateInteraction('hovered', true, onHoverIn)}
        onHoverOut={updateInteraction('hovered', false, onHoverOut)}
        childRef={ref}
      >
        <Pressable
          onLongPress={onLongPress}
          hitSlop={hitSlop}
          disabled={disabled}
          style={containerStyle}
          onPress={onPress}
          onPressIn={updateInteraction('pressed', true, onPressIn)}
          onPressOut={updateInteraction('pressed', false, onPressOut)}
          ref={ref}
          testID={testID}
          onLayout={onContainerLayout}
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
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
          href={href}
        >
          {child}
        </Pressable>
      </Hoverable>
    )
    // }
    // else  {
    //   node = (
    //     <TouchableWithoutFeedback
    //       onPressIn={updateInteraction('pressed', true, onPressIn)}
    //       onPressOut={updateInteraction('pressed', false, onPressOut)}
    //       onLongPress={onLongPress}
    //       hitSlop={hitSlop}
    //       disabled={disabled}
    //       onPress={onPress}
    //       // @ts-expect-error incorrect ref types, lol
    //       ref={ref}
    //       onLayout={onContainerLayout}
    //       containerStyle={containerStyle}
    //       // Accessibility props
    //       accessibilityActions={accessibilityActions}
    //       accessibilityElementsHidden={accessibilityElementsHidden}
    //       accessibilityHint={accessibilityHint}
    //       accessibilityIgnoresInvertColors={accessibilityIgnoresInvertColors}
    //       accessibilityLabel={accessibilityLabel}
    //       accessibilityLiveRegion={accessibilityLiveRegion}
    //       accessibilityRole={accessibilityRole}
    //       accessibilityState={accessibilityState}
    //       accessibilityValue={accessibilityValue}
    //       accessibilityViewIsModal={accessibilityViewIsModal}
    //       accessible={accessible}
    //       onAccessibilityTap={onAccessibilityTap}
    //       onAccessibilityAction={onAccessibilityAction}
    //       onAccessibilityEscape={onAccessibilityEscape}
    //       importantForAccessibility={importantForAccessibility}
    //       onFocus={onFocus}
    //       onBlur={onBlur}
    //     >
    //       {child}
    //     </TouchableWithoutFeedback>
    //   )
    // }

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
