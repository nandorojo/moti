import React, { ComponentType, forwardRef } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import { DripifyProps } from './types'
import useMapAnimateToStyle from './use-map-animate-to-style'

// https://www.framer.com/blog/posts/magic-motion/

export default function redripify<
  Props,
  Ref,
  ExtraProps,
  Animate = ViewStyle & TextStyle
>(Component: ComponentType<Props>) {
  const withAnimations = (outerProps?: ExtraProps) => {
    const withStyles = forwardRef<Ref, Props & DripifyProps<Animate>>(
      function Wrapped(
        {
          animate,
          style,
          visible = true,
          exit,
          initial = false as false,
          transition,
          delay,
          ...props
        },
        ref
      ) {
        const dripsified = useMapAnimateToStyle({
          animate,
          initial,
          exit,
          visible,
          transition,
          delay,
        })

        // const flatStyle = Array.isArray(style) ? style : [style]

        return (
          <Component style={[style, dripsified.style]} {...props} ref={ref} />
        )
      }
    )

    return withStyles
  }

  return withAnimations
}
