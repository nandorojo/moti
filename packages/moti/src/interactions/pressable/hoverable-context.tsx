import { createContext, useContext } from 'react'
import type { SharedValue } from 'react-native-reanimated'

const HoveredContext = createContext({
  value: false,
} as SharedValue<boolean>)

const useIsHovered = () => {
  return useContext(HoveredContext)
}

export { HoveredContext, useIsHovered }
