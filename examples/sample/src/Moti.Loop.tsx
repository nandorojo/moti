import React, { useReducer } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'moti'

function Shape() {
  return (
    <View
      from={{
        translateY: -100,
      }}
      animate={{
        translateY: 0,
      }}
      transition={{
        loop: true,
        type: 'timing',
        duration: 1500,
        delay: 100,
      }}
      style={styles.shape}
    />
  )
}

export default function ExitBeforeEnter() {
  return (
    <View style={styles.container}>
      <Shape />
    </View>
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
