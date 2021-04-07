import React, { ComponentType, forwardRef, PropsWithChildren } from 'react'
import type { ImageProps, StyleProp, TextProps, ViewProps } from 'react-native'
import type { MotiProps } from './types'
import useMapAnimateToStyle from './use-map-animate-to-style'
import Animated from 'react-native-reanimated'

// https://www.framer.com/blog/posts/magic-motion/
export default function motify<
  Props extends ViewProps | TextProps | ImageProps,
  Style = Props['style'] extends StyleProp<infer S> ? S : Record<string, any>
>(ComponentWithoutAnimation: ComponentType<Props>) {
  const Component = Animated.createAnimatedComponent(ComponentWithoutAnimation)

  const withAnimations = () =>
    //  we might use these later
    // outerProps?: ExtraProps
    {
      const withStyles = forwardRef<
        ComponentType<Props>,
        PropsWithChildren<Props> & MotiProps<Style>
      >(function Wrapped(
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
          animateInitialState,
        })

        return (
          <Component
            {...(props as Props)}
            style={[style, animated.style]}
            ref={ref}
          />
        )
      })

      return withStyles
    }

  return withAnimations
}
