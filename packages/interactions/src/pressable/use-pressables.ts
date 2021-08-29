import { MotiPressableContext, useMotiPressableContext } from './context'
import type { MotiPressableInteractionProp } from './types'
import { useDerivedValue } from 'react-native-reanimated'
import { useMemo } from 'react'

type Factory = (
  containers: MotiPressableContext['containers']
) => ReturnType<MotiPressableInteractionProp>

export function usePressables(factory: Factory) {
  const context = useMotiPressableContext()

  const __state = useDerivedValue(() => {
    const animatedResult = factory(context.containers)

    return animatedResult
  })

  const state = useMemo(() => ({ __state }), [__state])

  return state
}
