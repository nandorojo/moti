import { View as NativeView, Button, Text, StyleSheet } from 'react-native'
import React, { useReducer, useState } from 'react'
import * as Drip from './src/components'
import useAnimator from './src/redripify/use-animator'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

export default function AnimatedStyleUpdateExample() {
  const [width, setWidth] = useState(300)
  const [on, toggleOn] = useReducer((s) => !s, true)

  const from = {
    width: 0,
    height: 0,
    // backgroundColor: 'red',
  }

  const box = useAnimator({
    initial: from,
    big: {
      width: 150,
      height: 150,
      // backgroundColor: 'yellow',
    },
  })

  const size = useSharedValue(width, true)

  const driven = useAnimatedStyle(
    () => ({
      width: withSpring(size.value),
      height: withSpring(size.value),
    }),
    [width]
  )

  const to = {
    width,
    height: width,
  }

  return (
    <NativeView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      {on && (
        <>
          <Drip.View
            initial={{
              // width: 0,
              opacity: 0,
              // height: 0,
            }}
            animate={{
              // height: 150,
              // width: 150,
              opacity: 1,
            }}
            style={styles.box}
            animator={box}
          >
            <Text style={styles.text}>Reanimated</Text>
          </Drip.View>
          {/* <Animated.View style={[styles.box, driven]}></Animated.View> */}
          {/* <Spring from={from} to={to}>
            {(spring) => (
              <animated.View
                style={[
                  spring,
                  { backgroundColor: 'green', justifyContent: 'center' },
                ]}
              >
                <Text style={styles.text}>react-spring</Text>
              </animated.View>
            )}
          </Spring> */}
        </>
      )}
      <Button
        title="toggle"
        onPress={() => {
          const state = box.current
          if (state === 'big') {
            box.transitionTo('initial')
          } else {
            box.transitionTo('big')
          }
          // setWidth((w) => (w > 200 ? 150 : w * (1 + Math.random())))
        }}
      />
      <Button title={on ? 'hide' : 'show'} onPress={toggleOn} />
    </NativeView>
  )
}

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    alignSelf: 'center',
    color: 'hotpink',
  },
  box: { justifyContent: 'center', backgroundColor: 'blue' },
})
