import { useEffect, useRef } from 'react'
import { useSharedValue } from 'react-native-reanimated'
import { PackageName } from '../constants'
import type {
  InternalControllerState,
  UseAnimationState,
  UseAnimationStateConfig,
  Variants,
} from '../types'

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
 * const { current, transitionTo } = useAnimationState(...)
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
export default function useAnimationState<V extends Variants<V>>(
  _variants: V,
  {
    from = 'from' as keyof V,
    to = 'to' as keyof V,
  }: UseAnimationStateConfig<V> = {}
) {
  const controller = useRef<UseAnimationState<V>>()
  const __state = useSharedValue<InternalControllerState<V>>(
    from ? _variants[from] : 0
  )

  const selectedVariant = useRef(from)
  const variants = useRef(_variants)

  useEffect(
    function updateVariantsRef() {
      // honestly, I'm not sure if this should happen
      // do we want these to rebuild?
      // probably not, because it gives the illusion that you can change them on the fly
      // that said, as long as you know you can only change them with transitionTo,
      // I think it's fine.
      variants.current = _variants
    },
    [_variants]
  )

  if (controller.current == null) {
    controller.current = {
      __state,
      transitionTo(nextStateOrFunction) {
        const runTransition = (nextStateKey: keyof V) => {
          selectedVariant.current = nextStateKey

          const value = variants.current[nextStateKey]

          if (value) __state.value = value as any
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

  useEffect(
    function maybeTransitionOnMount() {
      if (variants.current[to]) {
        if (variants.current[from]) {
          controller.current?.transitionTo(to)
        } else {
          console.error(
            `🐼 [${PackageName}]: Called useAnimationState with a "to" variant, but you are missing a "from" variant. A "from" variant is required if you are using "to". Instead, you passed these variants: "${Object.keys(
              variants.current
            ).join(
              ', '
            )}". If you want to just use the "to" value without "from", you shouldn't use this hook. Instead, just pass your values to a ${PackageName} component's "animate" prop.`
          )
        }
      }
    },
    [from, to]
  )

  return controller.current as UseAnimationState<V>
}
