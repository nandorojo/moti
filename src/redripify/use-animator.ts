import { useRef } from 'react'
import { TextStyle, ViewStyle } from 'react-native'
import Animated, { useSharedValue } from 'react-native-reanimated'

type Variants = {
  [variant: string]: Partial<ViewStyle & TextStyle>
}

type UseVariants<V> = V

type InternalControllerState<V> = number | V[keyof V]

type Controller<V> = {
  current: null | keyof V
  __state: Animated.SharedValue<any>
  transitionTo: (key: keyof V) => void
  __variants: V
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
      __variants: variants,
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
 * const [state, animator] = useAnimator({
 *   from: {
 *     opacity: 0
 *   },
 *   open: {
 *     opacity: 1
 *   },
 * }, { initial: 'from' })
 * ```
 *
 * **Note** if you change variants on the fly by updating state, they will not re-render. This is to maintain good performance.
 *
 * This means the `useAnimator` hook should only be used with static states. If you need dynamic states, please use the `animate` prop directly.
 */
export default function useAnimator<V extends Variants = Variants>(
  variants: V,
  { initial = 'initial' as keyof V }: UseAnimatorConfig<V> = {}
): UseAnimator<V> {
  const variantz = useVariants(variants)

  const animator = useAnimatedController(variants, { initial })

  const returnValue = animator as UseAnimator<V>

  returnValue[0] = variantz
  returnValue[1] = animator

  return returnValue
}

const useA = () => {
  const animator = useAnimator({
    hi: {},
  })
}
