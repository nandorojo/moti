import { createContext, useContext } from 'react'
import type { MotiPressableInteractionState } from './types'
import type Animated from 'react-native-reanimated'

export const INTERACTION_CONTAINER_ID = '__INTERACTION_CONTAINER_ID' as const

export interface MotiPressableInteractionIds {
  id: string
}

export type MotiPressableContext = {
  containers: Record<
    MotiPressableInteractionIds['id'] | typeof INTERACTION_CONTAINER_ID,
    Animated.SharedValue<MotiPressableInteractionState>
  >
}

export const MotiPressableContext = createContext<MotiPressableContext>({
  containers: {},
})

export const useMotiPressableContext = () => useContext(MotiPressableContext)
