import { MotiPressableContext, useMotiPressableContext } from './context'
import type { MotiPressableInteractionProp } from './types'
import { useDerivedValue } from 'react-native-reanimated'
import { useMemo } from 'react'
import { Platform } from 'react-native'

type Factory = (
  containers: MotiPressableContext['containers']
) => ReturnType<MotiPressableInteractionProp>

/**
 * `useMotiPressables` lets you access the interaction state of *all* parent `MotiPressable` components.
 *
 * This offers more complex use-cases over `useMotiPressable`, which only lets you access the interaction state of a single parent `MotiPressable` at a time.
 *
 * Say you have a parent pressable, with a list of items:
 *
 * ```tsx
 * <MotiPressable id="list">
 *   {items.map(({ id }) => (
 *     <MotiPressable id={'item-' + id} key={id}>
 *       <Item id={id}  />
 *     </MotiPressable>
 *   )}
 * </MotiPressable>
 * ```
 *
 * Then, in your component, you can access each unique `MotiPressable`'s interaction state:
 *
 * ```tsx
 * const Item = ({ id }) => {
 *  const state = useMotiPressables((containers) => {
 *    'worklet'
 *
 *    const list = containers.list.value
 *    const item = containers.['item-' + id].value
 *
 *    // when hovering a list,
 *    // fade out all items except the one actually hovered
 *
 *    let opacity = 1
 *    if (item.hovered || item.pressed) {
 *      opacity = 1
 *    } else if (list.hovered) {
 *      opacity = 0.7
 *    }
 *
 *    return {
 *      opacity,
 *    }
 *  })
 *
 *  return <MotiView state={state} />
 * }
 * ```
 *
 * Example shown [here](https://twitter.com/FernandoTheRojo/status/1430717474778066944)
 *
 * <img height={300} width={400} src="https://pbs.twimg.com/media/E9rqA35XIAQmbuk?format=jpg&name=4096x4096" />
 */
export function useMotiPressables(
  /**
   * Function that receives the interaction state from all parent containers and returns a style object/
   * @worklet
   */
  factory: Factory,
  deps: readonly any[] = []
) {
  const context = useMotiPressableContext()

  if (!deps) {
    console.warn(
      '[moti/interactions] useMotiPressables is missing a dependency array as the second argument. https://moti.fyi/interactions/use-pressables. You can use this hook to your ESLint plugin for hooks using the additionalHooks field: https://www.npmjs.com/package/eslint-plugin-react-hooks'
    )
  }

  const __state = useDerivedValue(() => {
    const animatedResult = factory(context.containers)

    return animatedResult
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.containers, Platform.select({ web: factory }), ...deps])

  const state = useMemo(() => ({ __state }), [__state])

  return state
}
