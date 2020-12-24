import { UseAnimator } from './use-animator'
import Animated from 'react-native-reanimated'
import { TransformsStyle } from 'react-native'

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
) & { delay?: number }

/**
 * Allow { scale: 1 }, or { scale: [1] } if it's a sequence
 */
type StyleValueWithArrays<T> = {
  [key in keyof T]:
    | T[keyof T]
    | (T[keyof T] & {
        delay?: number
      })[]
}

export interface DripifyProps<
  AnimateType,
  AnimateWithTransitions = Omit<AnimateType, 'transform'> & Partial<Transforms>,
  Animate = StyleValueWithArrays<AnimateWithTransitions>
> {
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
  stylePriority?: 'animator' | 'animate'
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
