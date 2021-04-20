import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View } from 'moti'
import Animated, {
  useAnimatedStyle,
  withSequence,
  withSpring,
} from 'react-native-reanimated'

function ShapeBug() {
  const style = useAnimatedStyle(() => {
    const makeSequence = (...values: number[]) => {
      const sequence = values.map((value) => withSpring(value))
      return withSequence(sequence[0], ...sequence.slice(1))
    }

    return {
      transform: [
        {
          translateX: makeSequence(-100, 0, 100, 0),
        },
        {
          translateY: makeSequence(0, -100, -100, 0),
        },
      ],
    }
  }, [])

  return <Animated.View style={[styles.shape, style]} />
}

function Shape() {
  return (
    <View
      // from={{
      //   opacity: 0,
      //   scale: 0.5,
      // }}
      animate={{
        translateY: [0, -100, -100, 0],
        translateX: [-100, 0, 100, 0],
      }}
      // transition={{
      //   type: 'timing',
      // }}
      delay={300}
      style={styles.shape}
    />
  )
}

export default function HelloWorld() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      {visible && <ShapeBug />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#9c1aff',
  },
})
