import React, { ComponentType, forwardRef } from 'react'
import { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import { DripsifyProps } from './types'
import useMapAnimateToStyle from './use-map-animate-to-style'
import Animated from 'react-native-reanimated'

// https://www.framer.com/blog/posts/magic-motion/

export default function redripify<
  Style,
  Props extends { style?: Style },
  Ref,
  ExtraProps,
  // Variants,
  // Animate = ViewStyle & TextStyle
  Animate = ViewStyle | ImageStyle | TextStyle
>(ComponentWithoutAnimation: ComponentType<Props>) {
  const Component = Animated.createAnimatedComponent(ComponentWithoutAnimation)

  const withAnimations = (outerProps?: ExtraProps) => {
    const withStyles = forwardRef<
      Ref,
      Props &
        DripsifyProps<Animate> &
        ExtraProps & {
          children?: React.ReactNode
        }
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
