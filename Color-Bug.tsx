import { View, Button, StyleSheet } from 'react-native'
import React from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  processColor,
} from 'react-native-reanimated'

const colors = ['rgb(5,200,3)', 'rgb(10,5,100)']

export default function ColorBug() {
  const color = useSharedValue(colors[0])

  const toggleColor = () => {
    if (color.value === colors[0]) {
      color.value = colors[1]
    } else {
      color.value = colors[0]
    }
  }

  const style = useAnimatedStyle(() => ({
    backgroundColor: withTiming(processColor(color.value)),
  }))

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]}></Animated.View>
      <Button title="toggle" onPress={toggleColor} />
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    backgroundColor: 'blue',
    height: 100,
    width: 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
})
