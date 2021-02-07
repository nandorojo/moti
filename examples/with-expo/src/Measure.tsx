import React, { ComponentProps, useReducer, useState } from 'react'
import { View as MotiView } from 'moti'
import { Button, View } from 'react-native'

function useLayout() {
  const [layout, setLayout] = useState({
    height: 0,
  })
  const onLayout: ComponentProps<typeof View>['onLayout'] = ({
    nativeEvent,
  }) => {
    setLayout(nativeEvent.layout)
  }

  return [layout, onLayout] as const
}

function Measure() {
  const [{ height }, onLayout] = useLayout()

  const [open, toggle] = useReducer((s) => !s, false)

  return (
    <>
      <MotiView animate={{ height }} style={{ overflow: 'hidden' }}>
        <View
          onLayout={onLayout}
          style={{ height: open ? 100 : 300, backgroundColor: 'green' }}
        />
      </MotiView>
      <Button title="toggle" onPress={toggle} />
    </>
  )
}

export default function App() {
  return (
    <View style={{ justifyContent: 'center', flex: 1 }}>
      <Measure />
    </View>
  )
}
