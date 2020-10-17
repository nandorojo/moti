import { View, Button } from 'react-native'
import React, { useState } from 'react'
import { DripView } from './src/components'

export default function AnimatedStyleUpdateExample() {
  const [width, setWidth] = useState(300)

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <DripView
        style={{ height: 80, margin: 30, backgroundColor: 'blue' }}
        animate={{
          width,
          height: width,
        }}
      />
      <Button
        title="toggle"
        onPress={() => {
          setWidth((w) => (w > 250 ? 50 : w * (1 + Math.random())))
        }}
      />
    </View>
  )
}
