import React from 'react'
import { StyleSheet } from 'react-native'
import * as Moti from 'moti'

const { View } = Moti

function AnimatedCircle() {
  return (
    // run a normal spring animation
    <View
      from={{
        scale: 0.9,
      }}
      animate={{
        scale: 1,
      }}
      onDidAnimate={(key, finished) => {
        console.log('[complete]', key, finished) // [complete] scale, true
      }}
      style={styles.circle}
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
    <Moti.View style={styles.container}>
      {/* <Circle /> */}
      <AnimatedCircle />
      {/* <Circle /> */}
    </Moti.View>
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
