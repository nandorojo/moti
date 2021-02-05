import { AnimatePresence } from 'framer-motion'
import React, { useReducer, useState } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import * as Moti from 'moti'

const { View } = Moti

function Shape() {
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
      style={styles.shape}
    />
  )
}

export default function Presence() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <AnimatePresence>{visible && <Shape />}</AnimatePresence>
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
