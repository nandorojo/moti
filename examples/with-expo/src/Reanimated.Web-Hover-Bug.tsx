import React, { useState } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

export default function HelloWorld() {
  const hovered = useSharedValue(false)

  const [error, setError] = useState(false)

  const toggleError = () => {
    setError(!error)
  }

  const animatedStyle = useAnimatedStyle(() => {
    hovered.value
    return {}
  })

  return (
    <Pressable onPress={toggleError} style={styles.container}>
      <Animated.View
        onMouseEnter={() => (hovered.value = true)}
        onMouseLeave={() => (hovered.value = false)}
        style={[
          styles.shape,
          {
            backgroundColor: error ? 'red' : 'black',
          },
          animatedStyle,
        ]}
      />
    </Pressable>
  )
}

// write this here,
// so that the animated style updates whenever hovered.value does
// this is what will trigger the bug on Web
const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#9c1aff',
  },
})
