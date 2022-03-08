import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { MotiView } from 'moti'

function Shape() {
  return (
    <MotiView
      from={{
        opacity: 0,
        translateX: -100,
        translateY: -100,
      }}
      animate={{
        opacity: 1,
        translateX: [0, 100, 0],
        translateY: [0, 100, 0],
      }}
      style={styles.shape}
    />
  )
}

function ShapeRotator() {
  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.5,
        rotateZ: '0deg',
        borderRadius: 25,
      }}
      animate={{
        opacity: [1, { value: 0, delay: 1700 }],
        scale: [1, { value: 0.5, delay: 1500 }],
        rotateZ: '170deg',
        borderRadius: 125,
      }}
      onDidAnimate={(key, finished, value, { attemptedValue }) => {
        finished && console.log('[moti]', key, value, attemptedValue)
      }}
      transition={{
        rotateZ: {
          delay: 900,
        },
        borderRadius: {
          delay: 950,
          type: 'timing',
          duration: 300,
        },
      }}
      style={styles.shape}
    />
  )
}

export default function HelloWorld() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      {visible && <ShapeRotator />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
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
