import { createContext, useContext } from 'react'
import type Animated from 'react-native-reanimated'

const HoveredContext = createContext<Animated.SharedValue<boolean>>({
  value: false,
})

const useIsHovered = () => {
  return useContext(HoveredContext)
}

export { HoveredContext, useIsHovered }
