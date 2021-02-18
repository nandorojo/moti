import React, { ComponentProps } from 'react'
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import { motify } from '@motify/core'
import { View } from 'react-native'
import type Animated from 'react-native-reanimated'
import {
  useSharedValue,
  useAnimatedGestureHandler,
  runOnJS,
} from 'react-native-reanimated'

const MotiView = motify(View)()

type InteractionState = {
  hovered: Animated.SharedValue<boolean>
  pressed: Animated.SharedValue<boolean>
}

type ViewStyleProps =
  | ViewProps['from']
  | ViewProps['animate']
  | ViewProps['exit']

type StyleOrFunc<Style extends ViewStyleProps> =
  | Style
  | ((interaction: InteractionState) => Style)

type ViewProps = ComponentProps<typeof MotiView>

type AnimatedProps = Omit<
  ViewProps,
  'from' | 'animate' | 'exit' | 'children'
> & {
  from?: StyleOrFunc<ViewProps['from']>
  animate?: StyleOrFunc<ViewProps['animate']>
  exit?: StyleOrFunc<ViewProps['exit']>
  children?:
    | React.ReactNode
    | ((interactionState: InteractionState) => React.ReactNode)
  onPress?: () => void
}

type GestureContext = {
  cancelled: boolean
  failed: boolean
}

export default function AnimatedPressable({
  from,
  animate,
  exit,
  children,
  onPress: _onPress,
  ...props
}: AnimatedProps) {
  const hovered = useSharedValue(false)
  const pressed = useSharedValue(false)

  const onPress = () => {
    _onPress?.()
  }

  const onGestureEvent = useAnimatedGestureHandler<
    TapGestureHandlerGestureEvent,
    GestureContext
  >({
    onActive: () => {
      pressed.value = true
    },
    onEnd: () => {
      pressed.value = false
    },
    onFinish: (_, _2, isCanceledOrFailed) => {
      if (!isCanceledOrFailed) {
        runOnJS(onPress)()
      }
    },
  })

  const interactionState = {
    hovered,
    pressed,
  }

  const styleOrFunction = <Style extends ViewStyleProps>(
    style: StyleOrFunc<Style>
  ) => {
    if (typeof style === 'function') {
      return style(interactionState)
    } else {
      return style
    }
  }

  let child = children

  if (typeof children === 'function') {
    child = children(interactionState)
  }

  return (
    <TapGestureHandler onGestureEvent={onGestureEvent}>
      <MotiView
        {...props}
        animate={styleOrFunction(animate)}
        exit={styleOrFunction(exit)}
        from={styleOrFunction(from)}
      >
        {child}
      </MotiView>
    </TapGestureHandler>
  )
}
