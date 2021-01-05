import React from 'react'
import { View } from 'react-native'
import {
  TapGestureHandler,
  TapGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'
import * as Drip from './src'

export default function Repeat() {
  const sv = useSharedValue(false)
  const width = useSharedValue(100)

  const onGestureEvent = useAnimatedGestureHandler<
    TapGestureHandlerGestureEvent
  >({
    onActive: () => {
      sv.value = !sv.value
      // width.value = withRepeat(
      //   withTiming(
      //     300,
      //     {
      //       duration: 3000,
      //     },
      //     (finished) => {
      //       console.log({ finished })
      //       if (finished) {
      //       } else {
      //         console.log('inner animation cancelled')
      //       }
      //     }
      //   ),
      //   Infinity,
      //   true
      // )
    },
  })

  const style = useAnimatedStyle(() => ({
    width: withDelay(
      1000,
      withRepeat(
        withTiming(
          sv.value ? 300 : 100,
          {
            duration: 1000,
          },
          (finished, value) => {
            console.log({ finished, width: true, value })
          }
        ),
        Infinity,
        true
      )
    ),
  }))

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
      }}
    >
      <TapGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[{ backgroundColor: 'blue', height: 100 }, style]}
        ></Animated.View>
      </TapGestureHandler>
    </View>
  )
}
