// import type { UseAnimationState } from './use-animator/types'
import type Animated from 'react-native-reanimated'

import type {
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  TranslateXTransform,
  TranslateYTransform,
  SkewXTransform,
  SkewYTransform,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from 'react-native'

export type Transforms = PerpectiveTransform &
  RotateTransform &
  RotateXTransform &
  RotateYTransform &
  RotateZTransform &
  ScaleTransform &
  ScaleXTransform &
  ScaleYTransform &
  TranslateXTransform &
  TranslateYTransform &
  SkewXTransform &
  SkewYTransform

export type MotiTranformProps = Partial<Transforms> &
  Pick<ViewStyle, 'transform'>

export type TransitionConfigWithoutRepeats = (
  | ({ type?: 'spring' } & Animated.WithSpringConfig)
  | ({ type: 'timing' } & Animated.WithTimingConfig)
  | ({ type: 'decay' } & Animated.DecayConfig)
) & {
  delay?: number
}

export type TransitionConfig = TransitionConfigWithoutRepeats & {
  /**
   * Number of times this animation should repeat. To make it infinite, use the `loop` boolean.
   *
   * Default: `0`
   *
   * It's worth noting that this value isn't *exactly* a `repeat`. Instead, it uses Reanimated's `withRepeat` function under the hood, which repeats back to the **previous value**. If you want a repeated animation, I recommend setting it to `true` from the start, and make sure you have a `from` value.
   *
   * As a result, this value cannot be reliably changed on the fly. If you would like animations to repeat based on the `from` value, `repeat` must be a number when the component initializes. You can set it to `0` to stop it, but you won't be able to start it again. You might be better off using the sequence array API if you need to update its repetitiveness on the fly.
   */
  repeat?: number
  /**
   * Setting this to `true` is the same as `repeat: Infinity`
   *
   * Default: `false`
   *
   * Note: this value cannot be set on the fly. If you would like animations to repeat based on the `from` value, it must be `true` when the component initializes. You can set it to `false` to stop it, but you won't be able to start it again. You might be better off using the sequence array API if you need to update its repetitiveness on the fly.
   */
  loop?: boolean
  /**
   * Whether or not the animation repetition should alternate in direction.
   *
   * By default, this is `true`.
   *
   * If `false`, any animations with `loop` or `repeat` will not go back and forth. Instead, they will go from 0 -> 1, and again from 0 -> 1.
   *
   * If `true`, then animations will go 0 -> 1 -> 0.
   *
   * Setting this to `true` is like setting `animationDirection: alternate` in CSS.
   */
  repeatReverse?: boolean
}

export type SequenceItem<Value> =
  | // raw style values
  Value
  // or dictionaries with transition configs
  | ({
      value: Value
      // withSequence does not support withRepeat!
      // let people pass any config, minus repetitions
    } & TransitionConfigWithoutRepeats)

/**
 * Allow { scale: 1 }
 *
 * If it's a sequence:
 * { scale: [0, 1] }
 *
 * Or { scale: [{ value: 0, delay: 300, type: 'spring' }, 1]}
 * to allow more granular specification of sequence values
 */
export type StyleValueWithSequenceArraysWithoutTransform<
  T,
  Key extends keyof T = keyof T,
  // since transform is an array, it can't be here
  KeyWithoutTransform extends Exclude<Key, 'transform'> = Exclude<
    Key,
    'transform'
  >
> = {
  [key in KeyWithoutTransform]:
    | T[KeyWithoutTransform] // either the value
    // or an array of values for a sequence
    | SequenceItem<T[KeyWithoutTransform]>[]
}

export type StyleValueWithSequenceArraysWithTransform = {
  transform: StyleValueWithSequenceArrays<Transforms>[]
}

export type StyleValueWithSequenceArrays<T> = Partial<
  StyleValueWithSequenceArraysWithoutTransform<T> &
    StyleValueWithSequenceArraysWithTransform
>

export type OnDidAnimate<
  Animate = ImageStyle & TextStyle & ViewStyle,
  Key extends keyof Animate = keyof Animate
> = (
  /**
   * Key of the style that just finished animating
   */
  styleProp: Key,
  /**
   * `boolean` inidcating whether or not the animation finished.
   */
  finished: boolean,
  /**
   * This value is `undefined`, **unless** you are doing a repeating or looping animation. In that case, it gives you the value that it just animated to.
   */
  value: Animate[Key] | undefined,
  /**
   * An object containing metadata about this animation.
   */
  event: {
    /**
     * The value that this animation attempted to animate to.
     *
     * The reason it's marked as "attempted", is that if the animation didn't finish, then it didn't actually animate to this value.
     *
     * Usage:
     *
     * ```jsx
     * <MotiView
     *   onDidAnimate={(key, finished, value, { attemptedValue }) => {
     *     if (key === 'opacity' && finished && attemptedValue === 1) {
     *       console.log('animated to 1!')
     *     }
     *   }}
     * />
     * ```
     */
    attemptedValue: Animate[Key]
  }
) => void

export type StyleValueWithReplacedTransforms<StyleProp> = Omit<
  StyleProp,
  keyof Transforms
> &
  MotiTranformProps

export type MotiAnimationProp<Animate> = MotiProps<Animate>['animate']
export type MotiFromProp<Animate> = MotiProps<Animate>['from']
export type MotiExitProp<Animate> = MotiProps<Animate>['exit']

type OrSharedValue<T> = T | Animated.SharedValue<T>

type FallbackAnimateProp = StyleValueWithReplacedTransforms<
  ImageStyle & TextStyle & ViewStyle
>

export type MotiTransition<Animate = FallbackAnimateProp> = TransitionConfig &
  Partial<Record<keyof Animate, TransitionConfig>>

export type MotiTransitionProp<Animate = FallbackAnimateProp> = OrSharedValue<
  MotiTransition<Animate>
>

export interface MotiProps<
  // Style props of the component
  // defaults to any styles, so that generics aren't Required
  // in component usage, it will extract these from the style prop ideally
  AnimateType = ImageStyle & TextStyle & ViewStyle,
  // edit the style props to remove transform array, flattening it
  // AnimateWithTransitions = Omit<AnimateType, 'transform'> & Partial<Transforms>,
  AnimateWithTransitions = StyleValueWithReplacedTransforms<AnimateType>,
  // allow the style values to be arrays for sequences, where values are primitives or objects with configs
  Animate = StyleValueWithSequenceArrays<AnimateWithTransitions>
> {
  // we want the "value" returned to not include the style arrays here, so we use AnimateWithTransitions
  /**
   * Callback function called after finishing an animation.
   *
   * @param styleProp the key of the style that just finished animating
   * @param finished `boolean` inidcating whether or not the animation finished.
   * @param value This value is `undefined`, **unless** you are doing a repeating or looping animation. In that case, it gives you the value that it just animated to.
   */
  onDidAnimate?: OnDidAnimate<AnimateWithTransitions>
  /**
   * Animated style. Any styles passed here will automatically animate when they change.
   *
   * If you want to use transforms, such as `translateY` or `scale`, pass the keys directly to this prop, rather than using a `transform` array.
   *
   * To set an initial value, see the `from` prop.
   */
  animate?: OrSharedValue<Animate>
  /**
   * (Optional) specify styles which the component should animate from.
   *
   * If `false`, initial styles will correspond to the `animate` prop. Any subsequent changes to `animate` will be animated.
   */
  from?: Animate | boolean
  /**
   * (Optional) specify styles for when the component unmounts.
   *
   * **Important: you must wrap this component with the `AnimatePresence` component for exit animations to work.**
   *
   * It follows the same API as the `exit` prop from `framer-motion`. Feel free to reference their docs: https://www.framer.com/api/motion/animate-presence/
   * */
  exit?:
    | AnimateWithTransitions
    | boolean
    | ((custom?: unknown) => AnimateWithTransitions)
  /**
   * Define animation configurations.
   *
   * Options passed to `transition` directly will be used as the main configuration.
   *
   * ```jsx
   * <View transition={{ type: 'timing' }} />
   * ```
   *
   * If you want to pass different transition configurations based on the style type, you can do it per-style too:
   *
   * ```jsx
   * // timing animation for all styles
   * // spring animation for scale
   * <View
   *  transition={{ type: 'timing', scale: { type: 'spring' }}}
   *  from={{ opacity: 0, scale: .1 }}
   *  animate={{ opacity: 1, scale: 1 }}
   * />
   * ```
   */
  transition?: MotiTransitionProp<AnimateWithTransitions>
  /**
   * Define animation configurations for exiting components.
   *
   * Options passed to `exitTransition` will only apply to the `exit` prop, when a component is exiting.
   *
   * By default,
   *
   * ```jsx
   * <MotiView
   *   // the animate prop uses the transition
   *   transition={{ type: 'spring' }}
   *   animate={{ opacity: 1, scale: 1 }}
   *
   *   // when exiting, it will use a timing transition
   *   exitTransition={{ type: 'timing' }}
   *   exit={{ opacity: 0, scale: .1 }}
   * />
   * ```
   *
   * By default, `exit` uses `transition` to configure its animations, so this prop is not required. However, if you pass `exitTransition`, it will override `transition` for exit animations.
   *
   * To see how to use this prop, see the `transition` prop docs. It is identical to that prop, except that it overrides it when exiting.
   *
   */
  exitTransition?: MotiTransitionProp<AnimateWithTransitions>
  /**
   * Optionally delay the `animate` field.
   *
   * To get more granular delay controls, use the `transition` prop.
   */
  delay?: number
  /**
   * Pass a static set of animation variants, returned by the `useAnimationState` hook.
   *
   * This allows for more performant animations that don't cross the bridge.
   *
   * If you know your styles in advance, and will be changing them throughout a component's lifecycle, then this is the preferred method to animate with.
   */
  state?: Pick<UseAnimationState<any>, '__state'>
  /**
   * This is not a prop you will likely find yourself using.
   *
   * If set to `animate`, then styles passed from the `animate` prop will take precedent.
   *
   * Otherwise, if set to `state`, then the `state` prop will take precedent for matching styles.
   *
   * Default: `animate`.
   *
   */
  stylePriority?: 'state' | 'animate'
  /**
   * If `true`, the `from` prop will be set to animate. This will be noticeable for some spring animations, and might make them jumpy on mount.
   *
   * Default: `false`
   */
  animateInitialState?: boolean
}

export type InternalControllerState<V> = number | V[keyof V]

export type Variants<
  V,
  // these generics are copied from 'MotifyProps'
  // Style props of the component
  // defaults to any styles, so that generics aren't Required
  // in component usage, it will extract these from the style prop ideally
  AnimateType = ImageStyle & TextStyle & ViewStyle,
  // edit the style props to remove transform array, flattening it
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
  __state: Animated.SharedValue<any> | Animated.DerivedValue<any>
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

/**
 * Used for `useDynamicAnimation`
 */
export type DynamicStyleProp<
  // Style props of the component
  // defaults to any styles, so that generics aren't Required
  // in component usage, it will extract these from the style prop ideally
  AnimateType = ImageStyle & ViewStyle & TextStyle,
  // edit the style props to remove transform array, flattening it
  // AnimateWithTransitions = Omit<AnimateType, 'transform'> & Partial<Transforms>,
  AnimateWithTransitions = StyleValueWithReplacedTransforms<AnimateType>
  // allow the style values to be arrays for sequences, where values are primitives or objects with configs
> = NonNullable<StyleValueWithSequenceArrays<AnimateWithTransitions>>

export type UseDynamicAnimationState = {
  /**
   * @private
   * Internal state used to drive animations. You shouldn't use this. Use `.current` instead to read the current state. Use `animateTo` to edit it.
   */
  __state: Animated.SharedValue<any>
  /**
   * Read the current "state" (i.e. style object)
   */
  current: null | DynamicStyleProp
  /**
   * Set a new animation state using dynamic values.
   *
   * ```js
   * const dynamicAnimation = useDynamicAnimation({ opacity: 0 })
   *
   * const onPress = () => {
   *   dynamicAnimation.animateTo({ opacity: 1 })
   * }
   *
   * const onMergeStyle = () => {
   *   // or, merge your styles
   *   // this uses the previous state, like useState from react
   *   dynamicAnimation.animateTo((current) => ({ ...current, scale: 1 }))
   *
   *   // you can also synchronously read the current value
   *   // these two options are the same!
   *   dynamicAnimation.animateTo({ ...dynamicAnimation.current, scale: 1 })
   * }
   * ```
   * @worklet
   */
  animateTo: (
    key:
      | DynamicStyleProp
      | ((currentState: DynamicStyleProp) => DynamicStyleProp)
  ) => void
}
