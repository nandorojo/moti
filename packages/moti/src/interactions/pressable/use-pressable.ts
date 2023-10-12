import { MotiPressableInteractionIds, useMotiPressableContext } from './context'
import type { MotiPressableInteractionProp } from './types'
import { useDerivedValue } from 'react-native-reanimated'
import type { MotiProps } from '../../core'
import { useMemo } from 'react'
import { useFactory } from './use-validate-factory-or-id'

type Id = MotiPressableInteractionIds['id']
type Deps = unknown[] | null | undefined
/**
 * `useMotiPressable` lets you access the interaction state of a parent `MotiPressable` component.
 *
 * (If you need to access the interaction state of multiple `MotiPressable` parents, use `useMotiPressables` instead.)
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
 * const state = useMotiPressable(({ pressed }) => {
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
 * Then, in the `Item` component, add `list` as the first argument of `useMotiPressable`:
 *
 * ```tsx
 * const state = useMotiPressable('list', ({ pressed }) => {
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
 * const state = useMotiPressable('list', ({ pressed, hovered }) => {
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
  maybeDeps?: Deps
): MotiProps['state']
function useMotiPressable(
  /**
   * Optional: the unique `id` prop of the parent `MotiPressable` component. Useful if you want to access a unique component's interaction state without.
   */
  id: Id,
  /**
   * Function that receives the interaction state from the parent whose `id` prop matches the first argument of `useMotiPressable`. Returns a style object.
   * @worklet
   */
  factory: MotiPressableInteractionProp,
  maybeDeps?: Deps
): MotiProps['state']
function useMotiPressable(
  factoryOrId: MotiPressableInteractionProp | Id,
  maybeFactoryOrDeps?: MotiPressableInteractionProp | Deps,
  maybeDeps?: Deps
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
  }, [context, id, context.containers[id], ...(deps || [])])

  return useMemo(
    () => ({
      __state,
    }),
    [__state]
  )
}

export { useMotiPressable }
