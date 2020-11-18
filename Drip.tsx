import { View as NativeView, Button, Text, StyleSheet } from 'react-native'
import React, { useReducer, useState } from 'react'
import * as Drip from './src/components'
import { animated, useSpring } from '@react-spring/native'

export default function AnimatedStyleUpdateExample() {
  const [width, setWidth] = useState(300)
  const [on, toggleOn] = useReducer((s) => !s, true)

  const from = {
    width: 100,
    height: 0,
    backgroundColor: 'red',
  }

  const to = {
    width,
    height: width,
  }

  const spring = useSpring({ from, to })

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
            style={{ backgroundColor: 'blue', justifyContent: 'center' }}
            initial={from}
            animate={to}
          >
            <Text style={styles.text}>Reanimated</Text>
          </Drip.View>
          <animated.View
            style={[
              spring,
              { backgroundColor: 'green', justifyContent: 'center' },
            ]}
          >
            <Text style={styles.text}>react-spring</Text>
          </animated.View>
        </>
      )}
      <Button
        title="toggle"
        onPress={() => {
          setWidth((w) => (w > 200 ? 150 : w * (1 + Math.random())))
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
    color: 'white',
  },
})
