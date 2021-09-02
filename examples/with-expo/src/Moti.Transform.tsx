import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { MotiView } from 'moti'

function Shape() {
  return (
    <MotiView
      from={{
        opacity: 0,
        transform: [
          {
            scale: 0,
          },
          {
            rotateZ: '45deg',
          },
        ],
      }}
      animate={{
        opacity: 1,
        transform: [
          {
            scale: [1, 0.5, { value: 1.5, delay: 1000 }],
          },
          {
            rotateZ: ['0deg', '360deg'],
          },
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
