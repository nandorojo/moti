import type { ComponentProps } from 'react'
import type { MotiView } from '@motify/components'
import type { ViewStyle, Insets } from 'react-native'
import type { MotiAnimationProp } from '@motify/core'

export type MotiPressableInteractionState = {
  hovered: boolean
  pressed: boolean
}

type AnimateProp = MotiAnimationProp<ViewStyle>

export type MotiPressableProp = AnimateProp | MotiPressableInteractionProp

export type MotiPressableInteractionProp = (
  interaction: MotiPressableInteractionState
) => NonNullable<AnimateProp>

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
   * The `state` prop is not available with this component.
   * @disabled
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
} & Pick<
  ComponentProps<typeof MotiView>,
  'children' | 'exit' | 'from' | 'transition' | 'exitTransition' | 'style'
>
