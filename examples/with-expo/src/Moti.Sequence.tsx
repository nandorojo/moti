import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View } from 'moti'

function Shape() {
  return (
    <View
      from={{
        opacity: 0,
        translateX: -100,
        translateY: -100,
      }}
      animate={{
        opacity: 1,
        translateY: [
          0,
          {
            value: 100,
            type: 'timing',
            delay: 600,
            duration: 2500,
          },
          -100,
          0,
        ],
        translateX: [
          0,
          {
            value: 100,
            type: 'timing',
            delay: 600,
            duration: 2500,
          },
          -100,
          0,
        ],
      }}
      style={styles.shape}
    />
  )
}

export default function HelloWorld() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      {visible && <Shape />}
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
