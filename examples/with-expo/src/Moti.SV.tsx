import React, { useEffect, useState } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View, MotiAnimationProp } from 'moti'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'

const props = {
  from: {
    opacity: 0,
    scale: 0.9,
  },
  // exit: {
  //   opacity: 0,
  //   scale: 0.9,
  // },
}

const Shape = function Shape({
  pressed,
  pressedState,
}: {
  pressed: Animated.SharedValue<boolean>
  pressedState: boolean
}) {
  const dv = useDerivedValue(() => {
    console.log('[in-dv]', pressed.value)
    return { opacity: pressed.value ? 1 : 0 }
  }, [pressed])

  const style = useAnimatedStyle(() => {
    return {
      opacity: dv.value.opacity,
    }
  }, [dv])

  return <Animated.View style={[styles.shape, style]} />

  // return (
  //   <View
  //     from={{
  //       opacity: 0,
  //       scale: 0.9,
  //     }}
  //     animate={dv}
  //     style={styles.shape}
  //   />
  // )
}

export default function SV() {
  const pressed = useSharedValue(false)
  const [pressedState, setPressedState] = useState(false)

  const onPressIn = () => {
    console.log('in')
    pressed.value = true
    setPressedState(true)
  }
  const onPressOut = () => {
    console.log('out')
    pressed.value = false
    setPressedState(false)
  }

  return (
    <Pressable
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={styles.container}
    >
      <Shape pressed={pressed} pressedState />
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
