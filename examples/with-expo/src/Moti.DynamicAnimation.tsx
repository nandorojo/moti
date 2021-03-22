import React from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View, useDynamicAnimation } from 'moti'

function Shape() {
  const animation = useDynamicAnimation(() => ({
    backgroundColor: 'blue',
  }))

  return (
    <Pressable
      onPressIn={() => {
        animation.animateTo({
          backgroundColor: 'green',
        })
      }}
      onPressOut={() => {
        animation.animateTo({
          ...animation.current,
          backgroundColor: 'blue',
        })
      }}
    >
      <View
        transition={{
          type: 'spring',
        }}
        delay={300}
        state={animation}
        style={[styles.shape, styles.shape2]}
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
  shape2: {
    backgroundColor: 'hotpink',
    marginTop: 16,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'cyan',
  },
})
