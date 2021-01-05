import React from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated'

export default function SequenceBug() {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      //   {
      //     scale: withSequence(withSpring(0), withSpring(1), withSpring(2)),
      //   },
      {
        translateY: withSequence(withSpring(0), withSpring(10), withSpring(50)),
      },
    ],
  }))
  return <Animated.View style={[style.item, animatedStyle]} />
}

const style = StyleSheet.create({
  item: {
    margin: 100,
    width: 300,
    height: 300,
    backgroundColor: 'blue',
    alignSelf: 'center',
    borderRadius: 999,
  },
})
