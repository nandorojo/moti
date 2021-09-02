import type { MotiPressableInteractionState } from './types'
import { useAnimatedProps } from 'react-native-reanimated'
import { MotiPressableInteractionIds, useMotiPressableContext } from './context'
import { useFactory } from './use-validate-factory-or-id'

type Factory<Props> = (interaction: MotiPressableInteractionState) => Props

/**
 * Replacement for `useAnimatedProps`, which receives the interaction state as the first argument.
 * @param factory function that receives the interaction state and returns the props
 */
export function useMotiPressableAnimatedProps<Props>(
  id: MotiPressableInteractionIds['id'],
  factory: Factory<Props>,
  deps?: readonly any[]
): Partial<Props>
export function useMotiPressableAnimatedProps<Props>(
  factory: Factory<Props>,
  deps?: readonly any[]
): Partial<Props>
export function useMotiPressableAnimatedProps<Props>(
  factoryOrId: Factory<Props> | MotiPressableInteractionIds['id'],
  maybeFactoryOrDeps?: Factory<Props> | readonly any[],
  maybeDeps?: readonly any[]
) {
  const context = useMotiPressableContext()

  const { factory, id, deps } = useFactory<Factory<Props>>(
    'useMotiPressableAnimatedProps',
    factoryOrId,
    maybeFactoryOrDeps,
    maybeDeps
  )

  return useAnimatedProps<Props>(() => {
    return context ? factory(context.containers[id].value) : {}
  }, deps)
}
