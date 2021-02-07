import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useReducer, useState } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import * as Moti from 'moti'
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated'

const { View } = Moti

function MotiShape() {
  return (
    <View
      from={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
      transition={{
        type: 'spring',
      }}
      style={[styles.shape, { backgroundColor: 'cyan' }]}
    />
  )
}

function Shape() {
  const scale = useSharedValue(0)
  const style = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: scale.value,
          opacity: scale.value,
        },
      ],
    }
  })

  useEffect(() => {
    scale.value = withTiming(1)
  }, [scale])

  return <Animated.View style={[styles.shape, style]}></Animated.View>
}

export default function Presence() {
  const [visible, toggle] = useReducer((s) => !s, true)

  // return <Shape />
  return (
    <Pressable onPress={toggle} style={styles.container}>
      <MotiShape />
      {/* {visible && <Shape />}
      {!visible && <MotiShape />} */}
      {/* <AnimatePresence>{visible && <MotiShape />}</AnimatePresence> */}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
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
