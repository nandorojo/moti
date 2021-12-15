import React, { forwardRef, ComponentType, FunctionComponent } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import type { MotiProps } from './types'
import useMapAnimateToStyle from './use-map-animate-to-style'
import Animated, {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  LayoutAnimationFunction,
} from 'react-native-reanimated'

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
  const Component = Animated.createAnimatedComponent(
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
        from = false as const,
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
      const animated = useMapAnimateToStyle({
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
          style={[style, animated.style]}
          ref={ref as any} // TODO
        />
      )
    })

    Motified.displayName = `Moti.${
      Component.displayName || Component.name || 'NoName'
    }`

    return Motified
  }

  return withAnimations
}
