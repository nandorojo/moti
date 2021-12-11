import type { ComponentProps } from 'react'
import type { MotiView } from '@motify/components'
import type { ViewStyle, Insets, PressableProps } from 'react-native'
import type { MotiAnimationProp } from '@motify/core'
import type Animated from 'react-native-reanimated'

export type MotiPressableInteractionState = {
  hovered: boolean
  pressed: boolean
}

export type AnimateProp = MotiAnimationProp<ViewStyle>

export type MotiPressableInteractionProp = (
  interaction: MotiPressableInteractionState
) => NonNullable<AnimateProp>

export type MotiPressableProp = AnimateProp | MotiPressableInteractionProp

export type MotiPressableProps = {
  /*
   * Worklet that returns the `animated` prop. Or, just a normal `animate` prop, similar to `MotiView`.
   *
   * It's recomended that you memoize this prop with `useCallback`.
   *
   * ```tsx
   * <MotiPressable
   *   animate={useCallback(({ hovered }) => ({
   *     opacity: hovered ? 0.8 : 1
   *   }), [])}
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
} & Pick<
  ComponentProps<typeof MotiView>,
  'children' | 'exit' | 'from' | 'transition' | 'exitTransition' | 'style'
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
  >;
