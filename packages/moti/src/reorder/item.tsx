// @ts-nocheck
// forked from https://github.com/framer/motion/blob/main/src/components/Reorder/Item.tsx
import type { MotiView } from '@motify/components'
import { motify, useReactiveSharedValue } from '@motify/core'
import { Box } from 'framer-motion/types/projection/geometry/types'
import React, {
  useContext,
  useEffect,
  useRef,
  forwardRef,
  useMemo,
} from 'react'
import { View, ViewStyle, ViewProps } from 'react-native'
import {
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import {
  Transition,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useAnimatedGestureHandler,
} from 'react-native-reanimated'

import { ReorderContext } from './context'
import { useConstant } from './use-constant'

type Props<V> = {
  /**
   * A HTML element to render this component as. Defaults to `"li"`.
   *
   * @public
   */
  as?: Parameters<typeof motify>[0]

  /**
   * The value in the list that this component represents.
   *
   * @public
   */
  value: V
  x?: number
  y?: number
  style?: ViewStyle
  /**
   * @worklet
   */
  onDrag?: (event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => void
  drag?: boolean
} & React.ComponentProps<typeof MotiView>

export function ReorderItem<V>(
  {
    children,
    style,
    value,
    as = View,
    onDrag,
    x,
    y,
    drag,
    ...props
  }: Props<V> & React.PropsWithChildren<object>,
  externalRef?: React.Ref<any>
) {
  const Component = useConstant(() =>
    motify(as as React.ComponentType<ViewProps>)()
  )

  const context = useContext(ReorderContext)

  const layout = useRef<Box | null>(null)

  if (!context) {
    console.error('Reorder.Item must be a child of Reorder.Group')
  }

  const { axis, registerItem, updateOrder } = context!

  useEffect(() => {
    registerItem(value, layout.current!)
  }, [context])

  const pointX = useSharedValue(x || 0)
  const pointY = useSharedValue(y || 0)

  const point = useDerivedValue(() => ({
    x: pointX.value,
    y: pointY.value,
  }))

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: pointX.value }, { translateY: pointY.value }],
      zIndex: point.value[axis] ? 1 : undefined,
    }),
    [point]
  )

  const prevPoint = useSharedValue({
    x: 0,
    y: 0,
  })

  // const gesture = Gesture.Pan()
  //   .onStart(({ translationX, translationY }) => {
  //     prevPoint.value = {
  //       x: translationX,
  //       y: translationY,
  //     }
  //   })
  //   .onUpdate((event) => {
  //     const { velocityX, velocityY, translationY, translationX } = event
  //     const velocity = axis === 'x' ? velocityX : velocityY
  //     if (axis === 'x' || drag) {
  //       pointX.value = translationX + prevPoint.value.x
  //     }
  //     if (axis === 'y' || drag) {
  //       pointY.value = translationY + prevPoint.value.y
  //     }
  //     if (velocity) {
  //       updateOrder(value, axis === 'x' ? pointX.value : pointY.value, velocity)
  //     }
  //     onDrag?.(event)
  //   })
  //   .onEnd(() => {
  //     prevPoint.value = point.value
  //   })

  const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      // onStart(event) {
      //   const { translationX, translationY } = event
      //   prevPoint.value = {
      //     x: translationX,
      //     y: translationY,
      //   }
      // },
      onActive(event) {
        const { velocityX, velocityY, translationY, translationX } = event
        const velocity = axis === 'x' ? velocityX : velocityY
        if (axis === 'x' || drag) {
          pointX.value = translationX + prevPoint.value.x
        }
        if (axis === 'y' || drag) {
          pointY.value = translationY + prevPoint.value.y
        }
        if (velocity) {
          updateOrder(
            value,
            axis === 'x' ? pointX.value : pointY.value,
            velocity
          )
        }
        onDrag?.(event)
      },
      onEnd() {
        prevPoint.value = point.value
      },
    }
  )

  return (
    <PanGestureHandler onGestureEvent={panGestureHandler}>
      <Component
        {...props}
        style={useMemo(() => [style, animatedStyle], [style, animatedStyle])}
        // @ts-expect-error they haven't updated types...
        layout={Transition}
        onLayout={useMemo(
          () => ({ nativeEvent }) => {
            const { x, y, width, height } = nativeEvent.layout

            layout.current = {
              x: {
                min: x,
                max: x + width,
              },
              y: {
                min: y,
                max: y + height,
              },
            }
          },
          []
        )}
      >
        {children}
      </Component>
    </PanGestureHandler>
  )
}

export const Item = forwardRef(ReorderItem)
