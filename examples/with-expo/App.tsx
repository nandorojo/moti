import React from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Index from './_App'

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Index />
    </GestureHandlerRootView>
  )
}
