import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View, useAnimationState } from 'moti'

const useFadeInDown = () => {
  return useAnimationState({
    from: {
      opacity: 0,
      translateY: -15,
    },
    to: {
      opacity: 1,
      translateY: 0,
    },
  })
}

function Shape() {
  const fadeInDown = useFadeInDown()

  return (
    <Pressable>
      <View
        delay={300}
        state={fadeInDown}
        style={styles.shape}
        transition={{
          type: 'timing',
        }}
      />
    </Pressable>
  )
}

export default function Variants() {
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
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'cyan',
  },
})
