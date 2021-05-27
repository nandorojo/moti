import React, {
  Component,
  ComponentType,
  forwardRef,
  PropsWithChildren,
} from 'react'
import type { StyleProp } from 'react-native'
import type { MotiProps } from './types'
import useMapAnimateToStyle from './use-map-animate-to-style'
import Animated from 'react-native-reanimated'

// https://www.framer.com/blog/posts/magic-motion/
export default function motify<
  Props extends { style?: object | StyleProp<any> },
  Ref = Component<Props>,
  Style = Props['style'] extends StyleProp<infer S> ? S : Record<string, any>
>(ComponentWithoutAnimation: ComponentType<Props>) {
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
            {...(props as Props)}
            style={[style, animated.style]}
            ref={ref}
          />
        )
      })

      return Motified
    }

  return withAnimations
}
