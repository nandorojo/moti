import React, { forwardRef } from 'react'
import Animated from 'react-native-reanimated'

import { MotiProps } from './types'
import { useMotify } from './use-motify'

type ExcludeFunctionKeys<T> = {
  [K in keyof T as T[K] extends (...a: any[]) => any ? never : K]?: T[K]
}

type AdditionalProps = {
  children?: React.ReactNode
  /**
   * Animated props are not allowed with a Moti SVG component, since they will be overridden.
   *
   * Please use the `animate` prop instead. You can pass a derived value if needed:
   *
   * ```tsx
   * const MotiRect = motifySvg(Rect)()
   *
   * export const Example = () => {
   *    const animate = useDerivedValue(() => {
   *       return {
   *        width: 100,
   *        height: 100,
   *      }
   *    })
   *   return <MotiRect animate={animate} />
   * }
   * ```
   */
  animatedProps?: never
}

export function motifySvg<
  Props,
  C extends React.ComponentClass<any> = React.ComponentClass<Props>,
  Animate = ExcludeFunctionKeys<
    Omit<React.ComponentPropsWithoutRef<C>, 'children'>
  >
>(ComponentWithoutAnimation: C) {
  const withAnimations = () => {
    const AnimatedComponent = Animated.createAnimatedComponent(
      ComponentWithoutAnimation
    )
    const Motified = forwardRef<
      React.RefAttributes<React.ElementRef<C>>,
      Props & MotiProps<Animate> & AdditionalProps
    >(function Moti(props, ref) {
      const animated = useMotify<Animate>(props)

      if (props.animatedProps) {
        console.warn(
          `Moti: You passed animatedProps to a Moti SVG component. This will do nothing. You should use the animate prop directly. This will have no effect.`
        )
      }

      return (
        <AnimatedComponent
          {...props}
          animatedProps={animated.style}
          ref={ref}
        />
      )
    })

    Motified.displayName = `MotiSvg.${
      ComponentWithoutAnimation.displayName ||
      ComponentWithoutAnimation.name ||
      'NoName'
    }`

    return Motified
  }

  return withAnimations
}
