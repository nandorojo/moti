import React, { forwardRef, ComponentType, FunctionComponent } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import type { MotiProps } from './types'
import useMapAnimateToStyle from './use-map-animate-to-style'
import Animated from 'react-native-reanimated'

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
      {
        // This sucks, but if we use Animated.AnimateProps<Props> it breaks types
        animatedProps?: any
      } & Props &
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
