import React, { forwardRef, ComponentType, FunctionComponent } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import Animated, {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  LayoutAnimationFunction,
} from 'react-native-reanimated'

import type { MotiProps } from './types'
import { useMotify } from './use-motify'

const { createAnimatedComponent } = Animated

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

export default function motify<
  Style,
  Props extends { style?: Style },
  Ref,
  ExtraProps,
  Animate = ViewStyle | ImageStyle | TextStyle
>(ComponentWithoutAnimation: ComponentType<Props>) {
  const Component = createAnimatedComponent(
    ComponentWithoutAnimation as FunctionComponent<Props>
  )

  const withAnimations = () => {
    const Motified = forwardRef<
      Ref,
      Props &
        AnimatedProps<Props> &
        MotiProps<Animate> &
        ExtraProps & {
          children?: React.ReactNode
        }
    >(function Moti(
      {
        animate,
        style,
        from,
        transition,
        delay,
        state,
        stylePriority,
        onDidAnimate,
        exit,
        animateInitialState,
        exitTransition,
        ...props
      },
      ref
    ) {
      const animated = useMotify({
        animate,
        from,
        transition,
        delay,
        state,
        stylePriority,
        onDidAnimate,
        exit,
        exitTransition,
        animateInitialState,
      })

      return (
        <Component
          {...(props as any)} // TODO
          style={style ? [style, animated.style] : animated.style}
          ref={ref as any} // TODO
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
