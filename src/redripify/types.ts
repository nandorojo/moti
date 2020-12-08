import { UseAnimator } from './use-animator'
import Animated from 'react-native-reanimated'

export type TransitionConfig = (
  | ({ type?: 'spring' } & Animated.WithSpringConfig)
  | ({ type: 'timing' } & Animated.WithTimingConfig)
  | ({ type: 'decay' } & Animated.DecayConfig)
) & { delay?: number }

export interface DripifyProps<Animate> {
  animate?: Animate
  /**
   * (Optional) specify styles which the component should animate from.
   *
   * If `false`, initial styles will correspond to the `animate` prop. Any subsequent changes to `animate` will be animated.
   */
  initial?: Animate | false
  transition?: TransitionConfig &
    Partial<Record<keyof Animate, TransitionConfig>>
  delay?: number
  animator?: UseAnimator<any>
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
