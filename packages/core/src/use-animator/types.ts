import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import type Animated from 'react-native-reanimated'
import type {
  StyleValueWithReplacedTransforms,
  StyleValueWithSequenceArrays,
} from '../types'

export type InternalControllerState<V> = number | V[keyof V]

export type Variants<
  V,
  // these generics are copied from 'MotifyProps'
  // Style props of the component
  // defaults to any styles, so that generics aren't Required
  // in component usage, it will extract these from the style prop ideally
  AnimateType = ImageStyle & TextStyle & ViewStyle,
  // edit the style props to remove transform array, flattening it
  // AnimateWithTransitions = Omit<AnimateType, 'transform'> & Partial<Transforms>,
  AnimateWithTransitions = StyleValueWithReplacedTransforms<AnimateType>,
  // allow the style values to be arrays for sequences, where values are primitives or objects with configs
  Animate = StyleValueWithSequenceArrays<AnimateWithTransitions>
> = {
  [key in keyof V]?: Animate
} & {
  to?: Animate
  from?: AnimateWithTransitions
}

export type UseAnimationState<V> = {
  /**
   * A hook to synchronously read the current animation state.
   *
   * ```js
   * const animator = useAnimationState({
   *   hidden: { opacity: 0 },
   *   shown: { opacity: 1 }
   * })
   *
   * const onPress = () => {
   *   if (animator.current === 'hidden') {
   *     animator.transitionTo('shown')
   *   } else {
   *     animator.transitionTo('hidden')
   *   }
   * }
   * ```
   *
   * Do not mutate the `current` value directly; this will break. Instead, use the `transitionTo` function.
   */
  current: null | keyof V
  /**
   * @private
   * Internal state used to drive animations. You shouldn't use this. Use `.current` instead to read the current state. Use `transitionTo` to edit it.
   */
  __state: Animated.SharedValue<any>
  /**
   * Transition to another state, as defined by this hook.
   *
   * ```js
   * const animator = useAnimationState({
   *   hidden: { opacity: 0 },
   *   shown: { opacity: 1 }
   * })
   *
   * const onPress = () => {
   *   if (animator.current === 'hidden') {
   *     animator.transitionTo('shown')
   *   } else {
   *     animator.transitionTo('hidden')
   *   }
   * }
   * ```
   */
  transitionTo: (key: keyof V | ((currentState: keyof V) => keyof V)) => void
}

export type UseAnimationStateConfig<
  Variants,
  FromKey extends keyof Variants = keyof Variants,
  ToKey extends keyof Variants = keyof Variants
> = {
  /**
   * This prop is not necessary to use. It's only there in case you're doing something special.
   *
   * The `key` for the initial variant. By default, it's `from = 'from'`.
   *
   * If you pass a string here, it must match the key of one of your variants.
   */
  from?: FromKey
  /**
   * This prop is not necessary to use. It's only there in case you're doing something special.
   *
   * The `key` for the `to` value, which runs after the component has mounted. By default, it's `to = 'to'`.
   *
   * Must be paired with a `from` value.
   *
   * If you pass a string here, it must match the key of one of your variants.
   */
  to?: ToKey
}
