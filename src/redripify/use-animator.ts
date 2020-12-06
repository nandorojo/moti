import { useRef } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'

type Variants = {
  [variant: string]: Partial<ViewStyle & TextStyle>
}

type UseVariants<V> = V

type InternalControllerState<V> = number | V[keyof V]

type Controller<V> = {
  /**
   * A way to synchonously read the current animator state.
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
   * Do not mutate this value directly. Instead, use `transitionTo`.
   */
  current: null | keyof V
  /**
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
  transitionTo: (key: keyof V) => void
  // __variants: V
}

function useAnimatedController<V>(
  variants: V,
  { initial }: UseAnimatorConfig<V> = {}
) {
  const controller = useRef<Controller<V>>()
  const __state = useSharedValue<InternalControllerState<V>>(
    initial ? variants[initial] : 0
  )

  if (controller.current === null) {
    controller.current = {
      current: initial ?? null,
      __state,
      // __variants: variants,
      transitionTo: (key) => {
        const value = variants[key]

        // this will always be true, but we do it for TS
        if (controller.current) {
          controller.current.current = key
        }

        __state.value = value
      },
    }
  }

  return controller.current as Controller<V>
}

function useVariants<V extends Variants = Variants>(variants: V) {
  const ref = useRef<UseVariants<V>>(null)

  if (ref.current === null) {
    //   @ts-ignore
    ref.current = {}
    const keys = Object.keys(variants)

    keys.forEach((key) => {
      // @ts-ignore
      ref.current[key] = key
    })
  }

  return ref.current as UseVariants<V>
}

type UseAnimatorConfig<V> = {
  initial?: keyof V
}

export type UseAnimator<V> = [UseVariants<V>, Controller<V>] & Controller<V>

/**
 *
 * @param variants specify your style variants.
 * @param config Optionally define your initial variant key.
 *
 * **Example**
 *
 * ```jsx
 * const animator = useAnimator({
 *   initial: {
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
 *     <Drip.View animator={animator} />
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
 * You can also use it with a destructured hook if you want to get access to the `current` state:
 *
 * ```jsx
 * const [state, animator] = useAnimator({
 *   initial: {
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
 *     <Drip.View animator={animator} />
 *     <Button
 *      title="Change!"
 *      onPress={() => {
 *        if (animator.current === state.initial) {
 *          animator.animateTo('open')
 *        } else {
 *          animator.animateTo('initial')
 *        }
 *      }}
 *     />
 *   </>
 * )
 * ```
 *
 * If you provide an `initial` key, this will be your default starting variant. If you don't, however, you should use the second argument to specify the initial state. If you do not, then there will be no animated style to begin with (this is okay, as long as you intended it.)
 *
 * ```jsx
 * const animator = useAnimator({
 *   from: {
 *     opacity: 0
 *   },
 *   open: {
 *     opacity: 1
 *   },
 * }, { initial: 'from' })
 * ```
 *
 * **Note** if you change variants on the fly by updating state, they will not re-render. This is to maintain good performance. Instead, you should pre-define all states in the first render. Then use `animator.transitionTo` to change state, and `animator.current` to read the state.
 *
 * This means the `useAnimator` hook should only be used with static states. If you need dynamic states, please use the `animate` prop directly.
 *
 * **Minor suggestion**
 *
 * As a rule of thumb, don't destructure the `animator`. `animator` has a stable reference, but the values inside of it do not.
 *
 * ```js
 * // ✅ in general, do this
 * const animator = useAnimator(...)
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
 * }, [animator, loading])
 * ```
 *
 * You don't have to follow that suggestion if you don't want to. But I recommend it to prevent unintended consequences of triggering effects when these are used in dependency arrays.
 *
 * If you aren't using the animator in a dependency array anywhere, then you can ignore this suggestion. But I treat it as a rule of thumb to keep things simpler.
 *
 * Technically, it's fine if you do this with `transitionTo`. It's `current` you'll want to watch out for, since its reference will change, without triggering re-renders. This functions similar to `useRef`.
 */
export default function useAnimator<V extends Variants = Variants>(
  variants: V,
  { initial = 'initial' as keyof V }: UseAnimatorConfig<V> = {}
) {
  // const variantz = useVariants(variants)

  const animator = useAnimatedController(variants, { initial })

  // const returnValue = animator as UseAnimator<V>

  // returnValue[0] = variantz
  // returnValue[1] = animator

  return animator
}

const useA = () => {
  const animator = useAnimator({
    hi: {},
  })

  if (animator.current === 'hi') {
  }

  animator.transitionTo('hi')
}
