---
id: pressable
title: <MotiPressable />
---

A near-replacement for React Native's `Pressable` component, with animations run on the native thread.

```tsx
import { MotiPressable } from '@motify/interactions'
import { useCallback } from 'react'

export const Pressable = () => {
  const onPress = () => Linking.openURL('beatgig.com')

  return (
    <MotiPressable
      onPress={onPress}
      animate={useCallback(({ hovered, pressed }) => {
        'worklet'

        return {
          opacity: hovered || pressed ? 0.5 : 1,
        }
      }, [])}
    />
  )
}
```

For more info, see the [interactions overview](/interactions/overview).

# Props

````tsx
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
>
````
