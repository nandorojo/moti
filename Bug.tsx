import { View, Button, StyleSheet } from 'react-native'
import React from 'react'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  processColor,
} from 'react-native-reanimated'

export default function AnimatedStyleUpdateExample() {
  const size = useSharedValue(200)

  const style = useAnimatedStyle(
    () => ({
      width: withTiming(size.value),
      height: withTiming(size.value),
      backgroundColor: withTiming(
        size.value > 150 ? processColor('#333333') : processColor('#e8e')
      ),
    }),
    [size]
  )

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.box, style]}></Animated.View>
      <Button
        title="toggle"
        onPress={() => {
          const randomSize = size.value * (1 + Math.random())

          if (size.value > 200) {
            size.value = 150
          } else {
            size.value = randomSize
          }
        }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    alignSelf: 'center',
    color: 'hotpink',
  },
  box: { justifyContent: 'center', backgroundColor: 'blue' },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
})
