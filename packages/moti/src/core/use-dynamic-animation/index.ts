import type {
  DynamicStyleProp,
  ExcludeFunctionKeys,
  UseDynamicAnimationState,
} from '../types'
import { useSharedValue } from 'react-native-reanimated'
import { useRef } from 'react'
import { ViewStyle, TextStyle, ImageStyle } from 'react-native'

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
 * const dynamicAnimation = useDynamicAnimation(() => ({ opacity: 0 }))
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
export default function useDynamicAnimation<
  _Animate = ViewStyle | TextStyle | ImageStyle,
  Animate = ExcludeFunctionKeys<_Animate>
>(initialState: () => DynamicStyleProp<Animate> = fallback) {
  const initializer = useRef<{ value: DynamicStyleProp<Animate> }>(null as any)
  if (initializer.current === null) {
    // use a .value to be certain it's never been set
    initializer.current = { value: initialState() }
  }

  const __state = useSharedValue(initializer.current.value)

  const controller = useRef<UseDynamicAnimationState<Animate>>()

  if (controller.current == null) {
    controller.current = {
      __state,
      // @ts-ignore
      get current(): DynamicStyleProp<Animate> {
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

  return controller.current as UseDynamicAnimationState<Animate>
}
