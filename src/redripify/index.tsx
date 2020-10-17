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
      function Wrapped({ animate, style, ...props }, ref) {
        const dripsified = useMapAnimateToStyle({ animate })

        const flatStyle = Array.isArray(style) ? style : [style]

        return (
          <Component
            style={[...flatStyle, dripsified.style]}
            {...props}
            ref={ref}
          />
        )
      }
    )

    return withStyles
  }

  return withAnimations
}
