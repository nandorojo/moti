import { useRef } from 'react'
import Animated, { useSharedValue } from 'react-native-reanimated'

type InternalControllerState<V> = number | V[keyof V]

type Controller<V> = {
  /**
   * A hook to synchronously read the current animation state.
   *
   * ```js
   * const animator = useAnimator({
   *   hidden: { opacity: 0 },
   *   shown: { opacity: 1 }
   * })
   *
   * const onPress = () => {
   *   if (animator.current === 'hidden') {
   *     animator.transitionTo('shown')
   *   } else {
   *     animator.transitionTo('hidden')
   *   }
   * }
   * ```
   *
   * Do not mutate the `current` value directly; this will break. Instead, use the `transitionTo` function.
   */
  current: null | keyof V
  /**
   * @private
   * Internal state used to drive animations. You shouldn't use this. Use `.current` instead to read the current state. Use `transitionTo` to edit it.
   */
  __state: Animated.SharedValue<any>
  /**
   * Transition to another state, as defined by this hook.
   *
   * ```js
   * const animator = useAnimator({
   *   hidden: { opacity: 0 },
   *   shown: { opacity: 1 }
   * })
   *
   * const onPress = () => {
   *   if (animator.current === 'hidden') {
   *     animator.transitionTo('shown')
   *   } else {
   *     animator.transitionTo('hidden')
   *   }
   * }
   * ```
   */
  transitionTo: (key: keyof V | ((currentState: keyof V) => keyof V)) => void
}

/**
 *
 * `useAnimatedState` lets you control your animation state, based on static presets. It is the most performant way to drive animations.
 *
 * @param variants specify your style variants.
 * @param config Optionally define your from variant key.
 *
 * **Example**
 *
 * ```jsx
 * import { useAnimationState, View } from 'moti'
 *
 * const animator = useAnimationState({
 *   from: {
 *     opacity: 0
 *   },
 *   open: {
 *     opacity: 1
 *   },
 *   pressed: {
 *     opacity: 0.7
 *   }
 * })
 *
 * return (
 *   <>
 *     <View state={animator} style={{ height: 100 }} />
 *     <Button
 *      title="Change!"
 *      onPressIn={() => {
 *        animator.transitionTo('pressed')
 *      }}
 *      onPressOut={() => animator.transitionTo('open')}
 *     />
 *   </>
 * )
 * ```
 *
 * You can also use it with a access the `current` state:
 *
 * ```jsx
 * import React from 'react'
 * import { Button } from 'react-native'
 * import * as Moti from 'moti'
 *
 * const animator = Moti.useAnimationState({
 *   from: {
 *     opacity: 0
 *   },
 *   open: {
 *     opacity: 1
 *   },
 *   pressed: {
 *     opacity: 0.7
 *   }
 * })
 *
 * return (
 *   <>
 *     <Moti.View state={animator} />
 *     <Button
 *      title="Change!"
 *      onPress={() => {
 *        if (animator.current === 'from') {
 *          animator.animateTo('open')
 *        } else {
 *          animator.animateTo('from')
 *        }
 *      }}
 *     />
 *   </>
 * )
 * ```
 *
 * If you provide an `from` key, this will be your default starting variant. If you don't, however, you can use the second argument to specify the from state. If you do not, then there will be no animated style to begin with (this is okay, as long as you intended it.)
 *
 * ```jsx
 * const animator = useAnimationState({
 *   from: {
 *     opacity: 0
 *   },
 *   open: {
 *     opacity: 1
 *   },
 * }, { from: 'from' })
 * ```
 *
 * **Note** if you change variants on the fly by updating state, they will not re-render. This is to maintain good performance. Instead, you should pre-define all states in the first render. Then use `animator.transitionTo` to change state, and `animator.current` to read the state.
 *
 * This means the `useAnimatedState` hook should only be used with static states. If you need dynamic states, please use the `animate` prop directly.
 *
 * **Minor suggestion**
 *
 * As a rule of thumb, don't destructure the `animator`. `animator` has a stable reference, but the values inside of it do not.
 *
 * ```js
 * // ✅ in general, do this
 * const animator = useAnimationState(...)
 *
 * useEffect(() => {
 *  if (loading) animator.transitionTo('some-state')
 *  else animator.transitionTo('some-other-state')
 * }, [animator, loading])
 *
 * // 🚨 not this
 * const { current, transitionTo } = useAnimator(...)
 *
 * useEffect(() => {
 *  if (loading) transitionTo('some-state')
 *  else transitionTo('some-other-state')
 * }, [transitionTo, loading])
 * ```
 *
 * You don't have to follow that suggestion if you don't want to. But I recommend it to prevent unintended consequences of triggering effects when these are used in dependency arrays.
 *
 * If you aren't using the animator in a dependency array anywhere, then you can ignore this suggestion. But I treat it as a rule of thumb to keep things simpler.
 *
 * Technically, it's fine if you do this with `transitionTo`. It's `current` you'll want to watch out for, since its reference will change, without triggering re-renders. This functions similar to `useRef`.
 */
export default function useAnimationState<V>(
  _variants: V,
  { from = 'from' as keyof V }: UseAnimatorConfig<V> = {}
) {
  const controller = useRef<Controller<V>>()
  const __state = useSharedValue<InternalControllerState<V>>(
    from ? _variants[from] : 0,
    false // don't rebuild it
  )

  const selectedVariant = useRef(from)
  const variants = useRef(_variants)

  if (controller.current == null) {
    controller.current = {
      __state,
      transitionTo(nextStateOrFunction) {
        const runTransition = (nextState: keyof V) => {
          const value = variants.current[nextState]

          selectedVariant.current = nextState

          __state.value = value
        }

        if (typeof nextStateOrFunction === 'function') {
          // similar to setState, let people compose a function that takes in the current value and returns the next one
          runTransition(nextStateOrFunction(this.current as keyof V))
        } else {
          runTransition(nextStateOrFunction)
        }
      },
      get current(): keyof V {
        return selectedVariant.current
      },
    }
  }

  return controller.current as Controller<V>
}

type UseAnimatorConfig<V, InitialKey = keyof V> = {
  from?: InitialKey
}

export type UseAnimator<V> = Controller<V>
