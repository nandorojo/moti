import React, { forwardRef, ComponentType, FunctionComponent } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import type { MotiProps } from './types'
import useMapAnimateToStyle from './use-map-animate-to-style'
import Animated from 'react-native-reanimated'

// https://www.framer.com/blog/posts/magic-motion/
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

  const withAnimations = () =>
    //  we might use these later
    // outerProps?: ExtraProps
    {
      const Motified = forwardRef<
        Ref,
        Props &
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
            {...(props as any)} // TODO
            style={[style, animated.style]}
            ref={ref as any} // TODO
          />
        )
      })

      return Motified
    }

  return withAnimations
}
