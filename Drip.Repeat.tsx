import React from 'react'
import { StyleSheet } from 'react-native'
import * as Redrip from './src/components'

function AnimatedCircle() {
  return (
    <Redrip.View
      style={styles.circle}
      transition={{
        type: 'timing',
        loop: true,
      }}
      from={{
        scale: 0.9,
        // opacity: 1,
      }}
      animate={{
        scale: 1,
        // opacity: 1,
        // translateY: [0, 10, 50],
      }}
      onDidAnimate={(key, finished) => {
        console.log('[animation complete]', key, finished)
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
    <Redrip.View style={styles.container}>
      {/* <Circle /> */}
      <AnimatedCircle />
      {/* <Circle /> */}
    </Redrip.View>
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
