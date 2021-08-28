import { createContext } from 'react'

export interface MotiPressableInteractions {
  __container: Interaction
}

export type MotiPressableContext = {
  containers:
}

const MotiPressableContext = createContext<MotiPressableContext>({})
