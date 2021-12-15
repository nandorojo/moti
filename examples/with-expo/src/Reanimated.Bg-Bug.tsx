import React from 'react'
import { Pressable, StyleSheet } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export default function HelloWorld() {
  const pressed = useSharedValue(false)
  const style = useAnimatedStyle(() => {
    return {
      backgroundColor: pressed.value ? '#ffffff' : '#000000',
    }
  })
  return (
    <Pressable
      onPressIn={() => (pressed.value = true)}
      style={styles.container}
      onPressOut={() => (pressed.value = false)}
    >
      <Animated.View style={[styles.shape, style]} />
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
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#9c1aff',
  },
})
