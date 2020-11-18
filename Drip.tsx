import { View as NativeView, Button } from 'react-native'
import React, { useReducer, useState } from 'react'
import * as Drip from './src/components'

export default function AnimatedStyleUpdateExample() {
  const [width, setWidth] = useState(300)

  const [on, toggleOn] = useReducer((s) => !s, true)

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
        <Drip.View
          // style={{ height: 80, margin: 30, backgroundColor: 'blue' }}
          style={{ backgroundColor: 'blue' }}
          initial={{
            width: 100,
            height: 0,
            backgroundColor: 'red',
          }}
          // transition={{
          //   type: 'timing',
          // }}
          animate={{
            width,
            height: width,
          }}
        />
      )}
      <Button
        title="toggle"
        onPress={() => {
          setWidth((w) => (w > 250 ? 50 : w * (1 + Math.random())))
        }}
      />
      <Button title={on ? 'hide' : 'show'} onPress={toggleOn} />
    </NativeView>
  )
}
