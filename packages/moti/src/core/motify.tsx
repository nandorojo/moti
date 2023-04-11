import { usePresence, PresenceContext } from 'framer-motion'
import React, {
  forwardRef,
  ComponentType,
  FunctionComponent,
  useContext,
} from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import Animated, {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  LayoutAnimationFunction,
} from 'react-native-reanimated'

import type { MotiProps } from './types'
import { useMotify } from './use-motify'

export default function motify<
  Props extends object,
  Ref,
  Animate = ViewStyle | ImageStyle | TextStyle
>(ComponentWithoutAnimation: ComponentType<Props>) {
  const Component = Animated.createAnimatedComponent(
    ComponentWithoutAnimation as FunctionComponent<Props>
  )

  const withAnimations = () => {
    const Motified = forwardRef<
      Ref,
      Props &
        AnimatedProps<Props> &
        MotiProps<Animate> & {
          children?: React.ReactNode
        }
    >(function Moti(props, ref) {
      const animated = useMotify({
        ...props,
        usePresenceValue: usePresence(),
        presenceContext: useContext(PresenceContext),
      })

      const style = (props as any).style

      return (
        <Component
          {...(props as any)}
          style={style ? [style, animated.style] : animated.style}
          ref={ref as any}
        />
      )
    })

    Motified.displayName = `Moti.${
      ComponentWithoutAnimation.displayName ||
      ComponentWithoutAnimation.name ||
      'NoName'
    }`

    return Motified
  }

  return withAnimations
}

// copied from reanimated
// if we use Animated.AnimateProps
// then we get this TypeScript error:
// Exported variable 'View' has or is using name 'AnimatedNode' from external module "react-native-reanimated" but cannot be named.
type AnimatedProps<Props> = {
  animatedProps?: Partial<Props>
  layout?:
    | BaseAnimationBuilder
    | LayoutAnimationFunction
    | typeof BaseAnimationBuilder
  entering?:
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe
  exiting?:
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe
}
