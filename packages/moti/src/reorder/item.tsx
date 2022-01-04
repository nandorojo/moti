// @ts-nocheck
// forked from https://github.com/framer/motion/blob/main/src/components/Reorder/Item.tsx
import type { MotiView } from '@motify/components'
import { motify } from '@motify/core'
import { motion } from 'framer-motion'
import { Box } from 'framer-motion/types/projection/geometry/types'
import React, {
  useContext,
  useEffect,
  useRef,
  forwardRef,
  useMemo,
} from 'react'
import { View, ViewStyle, ViewProps, Platform } from 'react-native'
import {
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import Animated, {
  Transition,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  useAnimatedGestureHandler,
  withTiming,
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

  const placeholderDimensions = useSharedValue({
    width: 0,
    height: 0,
  })

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

  const isDragging = useSharedValue(false)

  const shouldShift = useSharedValue(true)

  const shift = useSharedValue({
    x: 0,
    y: 0,
  })
  useEffect(() => {
    shift.value = {
      x: 0,
      y: 0,
    }
  })

  useEffect(() => {
    // a hack to make sure that re-rendering the order doesn't make us "double count" our drag position.
    // if we go from index 2 to 1, then it re-renders, it immediately jumps from 0 to 1, since our
    // pointY is still -60px (for example), which is enough to go back again.
    // we could reset the pointY to 0, but then it like snaps into place weirdly
    // maybe we need to maintain 2 different memories: one for the actual translateY, and one for the offset
    if (isDragging.value) {
      shouldShift.value = false
      setTimeout(() => {
        shouldShift.value = true
      }, 300)
    }
  })

  const panGestureHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>(
    {
      onStart() {
        isDragging.value = true
      },
      onActive(event) {
        const { velocityX, velocityY, translationY, translationX } = event
        const velocity = axis === 'x' ? velocityX : velocityY
        if (axis === 'x') {
          pointX.value = translationX
        }
        if (axis === 'y') {
          pointY.value = translationY
        }
        shift.value[axis] = axis === 'x' ? translationX : translationY
        if (velocity && shouldShift.value) {
          updateOrder(value, shift.value[axis], velocity)
        }
        onDrag?.(event)
      },
      onEnd() {
        isDragging.value = false
        pointY.value = withTiming(0)
        pointX.value = withTiming(0)
        shift.value = {
          x: 0,
          y: 0,
        }
      },
    }
  )

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateX: pointX.value }, { translateY: pointY.value }],
      zIndex: point.value[axis] ? 1 : undefined,
      // position: isDragging.value ? 'absolute' : 'relative',
    }),
    [point]
  )

  const Layout = Platform.select({
    web: motion.div,
    default: View,
  })

  return (
    <Layout layout>
      <Animated.View>
        <PanGestureHandler onGestureEvent={panGestureHandler}>
          <Component
            layout={Transition}
            {...props}
            style={useMemo(() => [style, animatedStyle], [
              style,
              animatedStyle,
            ])}
            onLayout={useMemo(
              () => ({ nativeEvent }) => {
                const { x, y, width, height } = nativeEvent.layout

                placeholderDimensions.value = {
                  width,
                  height,
                }

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
                registerItem(value, layout.current!)
              },
              []
            )}
          >
            {children}
          </Component>
        </PanGestureHandler>
      </Animated.View>
    </Layout>
  )
}

export const Item = forwardRef(ReorderItem)
