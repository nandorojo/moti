import React, {
  Component,
  ComponentClass,
  forwardRef,
  PropsWithChildren,
} from 'react'
import type { ImageStyle, StyleProp, ViewStyle } from 'react-native'
import type { MotiProps } from './types'
import useMapAnimateToStyle from './use-map-animate-to-style'
import Animated from 'react-native-reanimated'

// https://www.framer.com/blog/posts/magic-motion/
export default function motify<
  Props extends {
    style?: Record<string, any> | StyleProp<ViewStyle | ImageStyle>
  },
  Ref = Component<Props>,
  Style = Props['style'] extends StyleProp<infer S> ? S : Record<string, any>
>(ComponentWithoutAnimation: ComponentClass<Props>) {
  const AnimatedComponent = Animated.createAnimatedComponent(
    ComponentWithoutAnimation
  )

  const withAnimations = () =>
    //  we might use these later
    // outerProps?: ExtraProps
    {
      const Motified = forwardRef<
        Ref,
        PropsWithChildren<Props> & MotiProps<Style>
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
          <AnimatedComponent
            {...(props as any)}
            style={[style, animated.style]}
            ref={ref}
          />
        )
      })

      return Motified
    }

  return withAnimations
}
