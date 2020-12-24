import React from 'react'
import { View } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'
import * as Drip from './src'

export default function Repeat() {
  const value = useSharedValue(0)

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Drip.View
        style={{ backgroundColor: 'blue', height: 100, width: 100 }}
      ></Drip.View>
    </View>
  )
}
