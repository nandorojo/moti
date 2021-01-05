import { View, Button, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  processColor,
  useDerivedValue,
  Easing,
} from 'react-native-reanimated'

const colors = ['#41b87a', '#533592']

export default function ColorBug() {
  const color = useSharedValue(colors[0])

  const [state, setState] = useState(colors[0])

  const toggleColor = () => {
    if (color.value === colors[0]) {
      color.value = colors[1]
      setState(colors[1])
    } else {
      color.value = colors[0]
      setState(colors[0])
    }
  }

  const bg = useDerivedValue(() => {
    return JSON.stringify({ backgroundColor: state })
  })

  const style = useAnimatedStyle(() => {
    const final = {}
    const style = JSON.parse(bg.value)
    Object.keys(style).forEach((key) => {
      const value = style[key]
      final[key] = withTiming(value, {}, console.log)
    })
    return final
  })

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
