import React, {
  useMemo,
  ReactNode,
  forwardRef,
  useReducer,
  useEffect,
  useRef,
} from 'react'
import { Platform, Pressable } from 'react-native'
import type { View } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
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
import type { MotiPressableInteractionState, MotiPressableProps } from './types'
import { getIsSwcHackEnabled } from '../../hack/swc-hack'
import { mergeRefs } from './merge-refs'

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
    } = props

    const _hovered = useSharedValue(false)
    const _pressed = useSharedValue(false)

    const hovered = hoveredValue || _hovered
    const pressed = pressedValue || _pressed

    let interaction = useDerivedValue<MotiPressableInteractionState>(
      () => ({
        hovered: hovered.value,
        pressed: pressed.value,
      }),
      [hovered, pressed]
    )

    const [webInteractionTemporary, setWebInteractionTemporary] = useReducer(
      (
        current: MotiPressableInteractionState,
        next: Partial<MotiPressableInteractionState>
      ) => {
        if (getIsSwcHackEnabled()) {
          return {
            ...current,
            ...next,
          }
        }
        return current
      },
      {
        hovered: false,
        pressed: false,
      }
    )

    let transition = useDerivedValue(() => {
      if (typeof transitionProp === 'function') {
        return transitionProp(interaction.value)
      }

      return transitionProp || {}
    }, [transitionProp, interaction])

    let __state = useDerivedValue(() => {
      if (typeof animate === 'function') {
        return animate(interaction.value)
      }

      return animate
    }, [animate, interaction])

    if (getIsSwcHackEnabled()) {
      // this goes after __state, since that was already working fine for some reason
      // eslint-disable-next-line react-hooks/rules-of-hooks
      interaction = useMemo(() => {
        return {
          value: webInteractionTemporary,
        }
      }, [webInteractionTemporary])

      // the order and existence of these is very important
      if (typeof animate === 'function') {
        __state = { value: animate(interaction.value) }
      }
      if (typeof transitionProp === 'function') {
        transition = { value: transitionProp(interaction.value) }
      }
    }

    const state = useMemo(() => ({ __state }), [__state])

    const updateInteraction = (
      event: keyof MotiPressableInteractionState,
      enabled: boolean,
      callback?: () => void
    ) => () => {
      'worklet'

      if (event === 'hovered') {
        hovered.value = enabled
        setWebInteractionTemporary({ hovered: enabled })
      } else if (event === 'pressed') {
        pressed.value = enabled
        setWebInteractionTemporary({ pressed: enabled })
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
        {typeof children == 'function'
          ? // @ts-expect-error it thinks ReactNode can be a function, but it's fine.
            children(interaction)
          : children}
      </MotiView>
    )

    let node: ReactNode
    if (Platform.OS === 'web' || Platform.OS === 'android') {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const webRef = useRef<HTMLDivElement>(null)
      if (Platform.OS === 'web') {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(
          function disableHoverOnClickOutside() {
            // https://gist.github.com/necolas/1c494e44e23eb7f8c5864a2fac66299a#gistcomment-3629646
            const listener = (event: MouseEvent) => {
              if (
                webRef?.current &&
                event.target instanceof HTMLElement &&
                !webRef.current.contains(event.target)
              ) {
                hovered.value = false
              }
            }
            document.addEventListener('mousedown', listener)

            return () => {
              document.removeEventListener('mousedown', listener)
            }
          },
          [hovered]
        )
      }

      node = (
        <Pressable
          onLongPress={onLongPress}
          hitSlop={hitSlop}
          // @ts-expect-error missing RNW types
          onHoverIn={updateInteraction('hovered', true, onHoverIn)}
          onHoverOut={updateInteraction('hovered', false, onHoverOut)}
          disabled={disabled}
          style={containerStyle}
          onPress={onPress}
          onPressIn={updateInteraction('pressed', true, onPressIn)}
          onPressOut={updateInteraction('pressed', false, onPressOut)}
          ref={mergeRefs([ref, webRef as any])}
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
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onFocus={onFocus}
          onBlur={onBlur}
          href={href}
        >
          {child}
        </Pressable>
      )
    } else {
      node = (
        <TouchableWithoutFeedback
          onPressIn={updateInteraction('pressed', true, onPressIn)}
          onPressOut={updateInteraction('pressed', false, onPressOut)}
          onLongPress={onLongPress}
          hitSlop={hitSlop}
          disabled={disabled}
          onPress={onPress}
          // @ts-expect-error incorrect ref types, lol
          ref={ref}
          onLayout={onContainerLayout}
          containerStyle={containerStyle}
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
        >
          {child}
        </TouchableWithoutFeedback>
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
