import React from 'react'
import { StyleSheet } from 'react-native'
import { View } from './src/components'

function AnimatedCircle() {
  return (
    <View
      style={styles.circle}
      transition={{
        type: 'timing',
      }}
      animate={{
        scale: [0, 1, 2],
        translateY: [0, 10, 50],
      }}
    />
  )
  // return (
  //   <Clandestine.View
  //     style={styles.circle}
  //     from={{
  //       translateY: 0,
  //     }}
  //     animate={{
  //       translateY: 300,
  //     }}
  //     transition={{
  //       loop: true,
  //     }}
  //   />
  // )
}

/**
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
export default function DripRepeat() {
  return (
    <View style={styles.container}>
      {/* <Circle /> */}
      <AnimatedCircle />
      {/* <Circle /> */}
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    backgroundColor: '#FF0080',
    height: 100,
    width: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
  },
})
