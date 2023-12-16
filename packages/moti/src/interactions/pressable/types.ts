import type { ComponentProps } from 'react'
import type { ViewStyle, Insets, PressableProps } from 'react-native'
import type Animated from 'react-native-reanimated'
import { DerivedValue } from 'react-native-reanimated'

import type { MotiView } from '../../components'
import type { MotiAnimationProp, MotiTransition } from '../../core'

export type MotiPressableInteractionState = {
  hovered: boolean
  pressed: boolean
}

export type AnimateProp = MotiAnimationProp<ViewStyle>

type Interactable<T> = (
  interaction: MotiPressableInteractionState
) => NonNullable<T>

type InteractableProp<T> = Interactable<T> | T

export type MotiPressableInteractionProp = Interactable<AnimateProp>

export type MotiPressableTransitionProp = InteractableProp<MotiTransition>

export type MotiPressableProp = InteractableProp<AnimateProp>

export type MotiPressableProps = {
  onFocus?: () => void
  onBlur?: () => void
  /*
   * Worklet that returns the `transition` prop. Or, just a normal `transition` prop, similar to `MotiView`.
   *
   * It's recomended that you memoize this prop with `useMemo`.
   *
   * ```tsx
   * <MotiPressable
   *   transition={useMemo(() => ({ hovered, pressed }) => {
   *    'worklet'
   *     return {
   *      delay: hovered || pressed ? 0 : 200
   *    }
   *   }, [])}
   * />
   * ```
   *
   * @worklet
   */
  transition?: MotiPressableTransitionProp
  /*
   * Worklet that returns the `animated` prop. Or, just a normal `animate` prop, similar to `MotiView`.
   *
   * It's recomended that you memoize this prop with `useMemo`.
   *
   * ```tsx
   * <MotiPressable
   *   animate={useMemo(() => ({ hovered, pressed }) => {
   *    'worklet'
   *     return {
   *      opacity: hovered ? 0.8 : 1
   *    }
   *   }, [])}
   * />
   * ```
   *
   * @worklet
   */
  animate?: MotiPressableProp
  /*
   * @deprecated
   *
   * The `state` prop is not available with this component.
   */
  state?: never
  onPress?: () => void
  onPressIn?: () => void
  onPressOut?: () => void
  onHoverIn?: () => void
  onHoverOut?: () => void
  onKeyDown?: (e: KeyboardEvent) => void
  onKeyUp?: (e: KeyboardEvent) => void
  onLongPress?: () => void
  hitSlop?: Insets
  /*
   * (Optional) Unique ID to identify this interaction.
   *
   * If set, then other children of this component can access the interaction state
   */
  id?: string
  disabled?: boolean
  containerStyle?: ViewStyle
  dangerouslySilenceDuplicateIdsWarning?: boolean
  /*
   * (Optional) a custom shared value to track the `pressed` state.
   * This lets you get access to the pressed state from outside of the component in a controlled fashion.
   */
  pressedValue?: Animated.SharedValue<boolean>
  /*
   * (Optional) a custom shared value to track the `pressed` state.
   * This lets you get access to the pressed state from outside of the component in a controlled fashion.
   */
  hoveredValue?: Animated.SharedValue<boolean>
  /**
   * `onLayout` for the container component.
   */
  onContainerLayout?: PressableProps['onLayout']
  href?: string
  testID?: PressableProps['testID']
  children?:
    | React.ReactNode
    | ((
        interaction: DerivedValue<MotiPressableInteractionState>
      ) => React.ReactNode)
} & Pick<
  ComponentProps<typeof MotiView>,
  'exit' | 'from' | 'exitTransition' | 'style' | 'onLayout'
> &
  Pick<
    PressableProps,
    | 'accessibilityActions'
    | 'accessibilityElementsHidden'
    | 'accessibilityHint'
    | 'accessibilityIgnoresInvertColors'
    | 'accessibilityLabel'
    | 'accessibilityLiveRegion'
    | 'accessibilityRole'
    | 'accessibilityState'
    | 'accessibilityValue'
    | 'accessibilityViewIsModal'
    | 'accessible'
    | 'onAccessibilityTap'
    | 'onAccessibilityAction'
    | 'onAccessibilityEscape'
    | 'importantForAccessibility'
  >
