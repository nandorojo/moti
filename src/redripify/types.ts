import { UseAnimator } from './use-animator'
import Animated from 'react-native-reanimated'

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
   * Note: this value cannot be set on the fly. If you would like animations to repeat based on the `from` value, it must be `true` when the component initializes. You can set it to `false` to stop it, but you won't be able to start it again. You might be better off using the sequence array API if you need to update its repetitiveness on the fly.
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
  [key in keyof T]:  // either the value
    | T[keyof T]
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

type OnDidAnimate<Animate, Key extends keyof Animate = keyof Animate> = (
  /**
   * Key of the style that just finished animating
   */
  styleProp: Key,
  /**
   * `boolean` inidcating whether or not the animation finished.
   */
  finished: boolean,
  value?: Animate[Key]
) => void

export interface DripsifyProps<
  AnimateType,
  AnimateWithTransitions = Omit<AnimateType, 'transform'> & Partial<Transforms>,
  Animate = StyleValueWithArrays<AnimateWithTransitions>
> {
  // we want the "value" returned to not include the style arrays
  /**
   * Callback function called after finishing an animation.
   *
   * @param styleProp the key of the style that just finished animating
   * @param finished `boolean` inidcating whether or not the animation finished.
   * @param value This value is `undefined`, **unless** you are doing a repeating or looping animation. In that case, it gives you the value that it just animated to.
   */
  onDidAnimate?: OnDidAnimate<AnimateWithTransitions>
  animate?: Animate
  /**
   * (Optional) specify styles which the component should animate from.
   *
   * If `false`, initial styles will correspond to the `animate` prop. Any subsequent changes to `animate` will be animated.
   */
  from?: Animate | false
  transition?: TransitionConfig &
    Partial<Record<keyof Animate, TransitionConfig>>
  delay?: number
  state?: UseAnimator<any>
  /**
   * If set to `animator`, then styles passed from the `animator` prop will take precedent.
   *
   * Otherwise, if set to `animate`, then that prop will take precedent for matching styles.
   *
   * Default: `animator`.
   */
  stylePriority?: 'state' | 'animate'
  /**
   * @deprecated
   *
   * This is only here for testing, but I'm not sure if it'll ever be usable.
   *
   * I added it with hopes of creating something like `framer-motion`'s exit prop.
   */
  // exit?: Animate
  // visible?: boolean
}
