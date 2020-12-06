import React, { ComponentType, forwardRef } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { DripifyProps } from './types'
import useMapAnimateToStyle from './use-map-animate-to-style'
import Animated from 'react-native-reanimated'

// https://www.framer.com/blog/posts/magic-motion/

export default function redripify<
  Style extends any | any[],
  Props extends { style: Style },
  Ref,
  ExtraProps,
  // Variants,
  Animate = ViewStyle & TextStyle
>(ComponentWithoutAnimation: ComponentType<Props>) {
  const Component = Animated.createAnimatedComponent(ComponentWithoutAnimation)
  const withAnimations = (outerProps?: ExtraProps) => {
    const withStyles = forwardRef<
      Ref,
      Props &
        DripifyProps<Animate> & {
          children?: React.ReactNode
        }
    >(function Wrapped(
      {
        animate,
        style,
        initial = false as false,
        transition,
        delay,
        animator,
        ...props
      },
      ref
    ) {
      const dripsified = useMapAnimateToStyle({
        animate,
        initial,
        transition,
        delay,
        animator,
      })

      // const flatStyle = Array.isArray(style) ? style : [style]

      return (
        <Component
          {...(props as Props)}
          style={[style, dripsified.style]}
          ref={ref}
        />
      )
    })

    return withStyles
  }

  return withAnimations
}
