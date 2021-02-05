import type { UseAnimator } from './use-animator'
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

export type TransitionConfig = (
  | ({ type?: 'spring' } & Animated.WithSpringConfig)
  | ({ type: 'timing' } & Animated.WithTimingConfig)
  | ({ type: 'decay' } & Animated.DecayConfig)
) & {
  delay?: number
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

type SmartOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * Allow { scale: 1 }
 *
 * If it's a sequence:
 * { scale: [0, 1] }
 *
 * Or { scale: [{ value: 0, delay: 300, type: 'spring' }, 1]}
 * to allow more granular specification of sequence values
 */
type StyleValueWithArrays<T> = {
  [key in keyof T]:
    | T[keyof T] // either the value
    // or an array of values for a sequence
    | (
        | // raw style values
        T[keyof T]
        // or dictionaries with transition configs
        | ({
            value: T[keyof T]
            // withSequence does not support withRepeat!
            // let people pass any config, minus repetitions
          } & SmartOmit<TransitionConfig, 'repeat' | 'repeatReverse' | 'loop'>)
      )[]
}

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
  value?: Animate[Key]
) => void

type StyleValueWithReplacedTransforms<StyleProp> = Omit<
  StyleProp,
  'transform'
> &
  Partial<Transforms>

export type MotiAnimationProp<Animate> = MotiProps<Animate>['animate']
export type MotiFromProp<Animate> = MotiProps<Animate>['from']
export type MotiExitProp<Animate> = MotiProps<Animate>['exit']

export interface MotiProps<
  // Style props of the component
  // defaults to any styles, so that generics aren't Required
  // in component usage, it will extract these from the style prop ideally
  AnimateType = ImageStyle & TextStyle & ViewStyle,
  // edit the style props to remove transform array, flattening it
  // AnimateWithTransitions = Omit<AnimateType, 'transform'> & Partial<Transforms>,
  AnimateWithTransitions = StyleValueWithReplacedTransforms<AnimateType>,
  // allow the style values to be arrays for sequences, where values are primitives or objects with configs
  Animate = StyleValueWithArrays<AnimateWithTransitions>
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
  animate?: Animate
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
  exit?: AnimateWithTransitions | boolean
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
  transition?: TransitionConfig &
    Partial<Record<keyof Animate, TransitionConfig>>
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
  state?: UseAnimator<unknown>
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
}
