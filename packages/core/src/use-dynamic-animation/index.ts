import type { DynamicStyleProp, UseDynamicAnimationState } from './../types'
import { useSharedValue } from 'react-native-reanimated'
import { useRef } from 'react'

type InitialState = () => DynamicStyleProp

const fallback = () => ({})

/**
 * A hook that acts like `useAnimationState`, except that it allows for dynamic values rather than static variants.
 *
 * This is useful when you want to update styles on the fly the way you do with `useState`.
 *
 * You can change the state by calling `state.animateTo()`, and access the current state by calling `state.current`.
 *
 * This hook has high performance, triggers no state changes, and runs fully on the native thread!
 *
 * ```js
 * const dynamicAnimation = useDynamicAnimation({ opacity: 0 })
 *
 * const onPress = () => {
 *   dynamicAnimation.animateTo({ opacity: 1 })
 * }
 *
 * const onMergeStyle = () => {
 *   // or, merge your styles
 *   // this uses the previous state, like useState from react
 *   dynamicAnimation.animateTo((current) => ({ ...current, scale: 1 }))
 *
 *   // you can also synchronously read the current value
 *   // these two options are the same!
 *   dynamicAnimation.animateTo({ ...dynamicAnimation.current, scale: 1 })
 * }
 * ```
 *
 * @param initialState A function that returns your initial style. Similar to `useState`'s initial style.
 */
export default function useDynamicAnimation(
  initialState: InitialState = fallback
) {
  const activeStyle = useRef<{ value: DynamicStyleProp }>({
    value: null as any,
  })
  if (activeStyle.current.value === null) {
    // use a .value to be certain it's never been set
    activeStyle.current.value = initialState()
  }

  const __state = useSharedValue(activeStyle.current.value)

  const controller = useRef<UseDynamicAnimationState>()

  if (controller.current == null) {
    controller.current = {
      __state,
      get current(): DynamicStyleProp {
        return __state.value
      },
      animateTo(nextStateOrFunction) {
        'worklet'

        const nextStyle =
          typeof nextStateOrFunction === 'function'
            ? nextStateOrFunction(__state.value)
            : nextStateOrFunction

        __state.value = nextStyle
      },
    }
  }

  return controller.current as UseDynamicAnimationState
}
