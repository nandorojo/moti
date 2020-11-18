import React, { useReducer } from 'react'
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Button } from 'react-native'

export default function Colorz() {
  const [backgroundColor, toggle] = useReducer(
    (bg) => (bg === 'red' ? 'green' : 'red'),
    'red'
  )
  const style = useAnimatedStyle(() => ({
    backgroundColor: withSpring(backgroundColor),
  }))
  return (
    <Animated.View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Button title="Toggle Color" onPress={toggle} color="white" />
    </Animated.View>
  )
}
