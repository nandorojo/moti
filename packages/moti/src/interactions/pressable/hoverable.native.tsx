import React from 'react'
import { useSharedValue } from 'react-native-reanimated'
import { HoveredContext } from './hoverable-context'

export function Hoverable({ children }) {
  return (
    <HoveredContext.Provider value={useSharedValue(false)}>
      {React.Children.only(children)}
    </HoveredContext.Provider>
  )
}
