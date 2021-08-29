import { MotiPressableInteractionIds, useMotiPressableContext } from './context'
import type { MotiPressableInteractionProp } from './types'
import { useDerivedValue } from 'react-native-reanimated'
import type { MotiProps } from 'packages/core/lib/typescript/src'
import { useMemo } from 'react'
import { useFactory } from './use-validate-factory-or-id'

type Id = MotiPressableInteractionIds['id']

/**
 * `usePressable` lets you access the interaction state of a parent `MotiPressable` component.
 *
 * (If you need to access the interaction state of multiple `MotiPressable` parents, use `useMotiPressables` instead.)
 *
 * This offers more complex use-cases over `usePressable`, which only lets you access the interaction state of one parent `MotiPressable` at a time.
 *
 * ```tsx
 * <MotiPressable>
 *   <Item />
 * </MotiPressable>
 * ```
 *
 * Then, in the `Item` component:
 *
 * ```tsx
 * const state = usePressable(({ pressed }) => {
 *   'worklet'
 *
 *   return {
 *     opactiy: pressed ? 0.5 : 1,
 *   }
 * })
 *
 * return <MotiView state={state} />
 * ```
 *
 * You can also access a pressable via unique ID:
 *
 * ```tsx
 * <MotiPressable id="list">
 *   <Item />
 * </MotiPressable>
 * ```
 *
 * Then, in the `Item` component, add `list` as the first argument of `usePressable`:
 *
 * ```tsx
 * const state = usePressable('list', ({ pressed }) => {
 *   'worklet'
 *
 *   return {
 *     opactiy: pressed ? 0.5 : 1,
 *   }
 * })
 *
 * return <MotiView state={state} />
 * ```
 *
 * Similar to `useMemo`, you can also pass in a dependency array as the last argument:
 *
 * ```tsx
 * const state = usePressable('list', ({ pressed, hovered }) => {
 *   'worklet'
 *
 *   return {
 *     opactiy: pressed && !loading ? 0.5 : 1,
 *   }
 * }, [loading])
 */
function useMotiPressable(
  /**
   * Function that receives the interaction state from the closest parent container and returns a style object.
   * @worklet
   */
  factory: MotiPressableInteractionProp,
  maybeDeps?: readonly any[]
): MotiProps['state']
function useMotiPressable(
  /**
   * Optional: the unique `id` prop of the parent `MotiPressable` component. Useful if you want to access a unique component's interaction state without.
   */
  id: Id,
  /**
   * Function that receives the interaction state from the parent whose `id` prop matches the first argument of `usePressable`. Returns a style object.
   * @worklet
   */
  factory: MotiPressableInteractionProp,
  maybeDeps?: readonly any[]
): MotiProps['state']
function useMotiPressable(
  factoryOrId: MotiPressableInteractionProp | Id,
  maybeFactoryOrDeps?: MotiPressableInteractionProp | readonly any[],
  maybeDeps?: readonly any[]
): MotiProps['state'] {
  const context = useMotiPressableContext()

  const { factory, id, deps } = useFactory<MotiPressableInteractionProp>(
    'useMotiPressable',
    factoryOrId,
    maybeFactoryOrDeps,
    maybeDeps
  )

  const __state = useDerivedValue(() => {
    const interaction = context.containers[id]

    return interaction && factory(interaction.value)
  }, deps)

  return useMemo(
    () => ({
      __state,
    }),
    [__state]
  )
}

export { useMotiPressable }
