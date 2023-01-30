import React, { forwardRef, ComponentType, FunctionComponent } from 'react'
import type { ImageStyle, TextStyle, ViewStyle } from 'react-native'
import Animated, {
  BaseAnimationBuilder,
  EntryExitAnimationFunction,
  LayoutAnimationFunction,
} from 'react-native-reanimated'

import type { MotiProps } from './types'
import { useMotify } from './use-motify'

const { createAnimatedComponent } = Animated

type ExcludeFunctionKeys<T> = {
  [K in keyof T as T[K] extends (...a: any[]) => any ? never : K]?: T[K]
}

export default function motify<
  Props extends object,
  Ref,
  ExtraProps,
  C,
  Animate = ViewStyle | ImageStyle | TextStyle
>(ComponentWithoutAnimation: ComponentType<Props> | FunctionComponent<Props>) {
  const Component = createAnimatedComponent(
    ComponentWithoutAnimation as FunctionComponent<Props>
  )

  const withAnimations = <
    IsSvg extends boolean = false,
    PoweredBy extends 'style' | 'props' = IsSvg extends true ? 'props' : 'style'
  >({
    poweredBy = 'style' as PoweredBy,
    isSvg = (poweredBy === 'style') as IsSvg,
  }: {
    isSvg?: IsSvg
    poweredBy?: PoweredBy
  } = {}) => {
    const Motified = forwardRef<
      Ref,
      Props &
        AnimatedProps<Props, IsSvg> &
        MotiProps<
          IsSvg extends true
            ? ExcludeFunctionKeys<Props>
            : PoweredBy extends 'props'
            ? Props
            : Animate
        > &
        ExtraProps & {
          children?: React.ReactNode
        }
    >(function Moti(props, ref) {
      const animated = useMotify(props)

      // @ts-expect-error
      const style = props.style ? [props.style, animated.style] : animated.style

      if (__DEV__ && isSvg && props.animatedProps) {
        console.warn(
          `Moti: You passed animatedProps to a Moti SVG component. This will do nothing. You should use the animate prop directly. This will have no effect.`
        )
      }

      return (
        <Component
          {...(props as any)}
          {...(isSvg
            ? {
                animatedProps: animated.style,
                // @ts-expect-error
                style: props.style,
              }
            : {
                style,
                animatedProps: props.animatedProps,
              })}
          ref={ref as any}
        />
      )
    })

    Motified.displayName = `Moti.${
      ComponentWithoutAnimation.displayName ||
      ComponentWithoutAnimation.name ||
      'NoName'
    }`

    return Motified
  }

  return withAnimations
}

// copied from reanimated
// if we use Animated.AnimateProps
// then we get this TypeScript error:
// Exported variable 'View' has or is using name 'AnimatedNode' from external module "react-native-reanimated" but cannot be named.
type AnimatedProps<Props, IsSvg extends boolean = false> = {
  animatedProps?: IsSvg extends true ? never : Partial<Props>
  layout?:
    | BaseAnimationBuilder
    | LayoutAnimationFunction
    | typeof BaseAnimationBuilder
  entering?:
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe
  exiting?:
    | BaseAnimationBuilder
    | typeof BaseAnimationBuilder
    | EntryExitAnimationFunction
    | Keyframe
}
