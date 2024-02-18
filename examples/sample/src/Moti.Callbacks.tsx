import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { MotiView } from 'moti'

export default function HelloWorld() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <MotiView
        animate={{
          opacity: {
            value: visible ? 1 : 0,
            onDidAnimate(finished, maybeValue, { attemptedValue }) {
              console.log('[onDidAnimate] finished:', finished)
              console.log('[onDidAnimate] maybeValue:', maybeValue)
              console.log('[onDidAnimate] attemptedValue:', attemptedValue)
            },
          },
        }}
        exit={{
          alignContent: 'center',
          opacity: 1,
        }}
        style={styles.shape}
      />
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
