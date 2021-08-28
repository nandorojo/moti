import React, { ComponentProps, useRef, useCallback } from 'react'
import { Platform, Pressable, Insets } from 'react-native'
import type { ViewStyle } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import {
  useSharedValue,
  runOnJS,
  useDerivedValue,
} from 'react-native-reanimated'
import type { MotiAnimationProp } from '@motify/core'
import { MotiView } from '@motify/components'

type Interaction = {
  hovered: boolean
  pressed: boolean
}

type AnimateProp = MotiAnimationProp<ViewStyle>

type InteractionStyle = (interaction: Interaction) => NonNullable<AnimateProp>

export type MotiPressableProps = {
  /*
   * Worklet that returns the `animated` prop. Or, just a normal `animate` prop, similar to `MotiView`.
   *
   * It's recomended that you memoize this prop with `useCallback`.
   *
   * ```tsx
   * <MotiPressable
   *   animate={useCallback(({ hovered }) => ({
   *     opacity: hovered ? 0.8 : 1
   *   }), [])}
   * />
   * ```
   *
   * @worklet
   */
  animate?: AnimateProp | InteractionStyle
  /*
   * The `state` prop is not available with this component.
   * @disabled
   */
  state?: never
  onPress?: () => void
  onPressIn?: () => void
  onPressOut?: () => void
  onHoverIn?: () => void
  onHoverOut?: () => void
  onLongPress?: () => void
  hitSlop?: Insets
  /*
   * (Optional) Unique ID to identify this interaction.
   *
   * If set, then other children of this component can access the interaction state
   */
  id?: string
} & Pick<
  ComponentProps<typeof MotiView>,
  'children' | 'exit' | 'from' | 'transition' | 'exitTransition' | 'style'
>

export function MotiPressable(props: MotiPressableProps) {
  const {
    animate,
    from,
    exit,
    children,
    exitTransition,
    transition,
    style,
    onPressOut,
    onPressIn,
    onHoverIn,
    onHoverOut,
    onPress,
    onLongPress,
    hitSlop,
  } = props

  const makeStyle = useCallback(
    (interaction: Interaction) => {
      'worklet'

      if (typeof animate === 'function') {
        return animate(interaction)
      }

      return animate
    },
    [animate]
  )

  // const motiState = useDynamicAnimation(() => {
  //   return makeStyle({ hovered: false, pressed: false }) || {}
  // })

  const interaction = useSharedValue<Interaction>({
    hovered: false,
    pressed: false,
  })

  const __state = useDerivedValue(() => {
    return makeStyle(interaction.value)
  }, [makeStyle, interaction])

  const state = useRef({ __state }).current

  const updateInteraction = (
    event: keyof Interaction,
    enabled: boolean,
    callback?: () => void
  ) => () => {
    'worklet'

    interaction.value[event] = enabled
    // const nextStyle = makeStyle(interaction.value)
    // if (nextStyle) {
    //   motiState.animateTo(nextStyle)
    // }
    if (callback) {
      runOnJS(callback)()
    }
  }

  // const hasMounted = useRef(false)

  // useEffect(
  //   function updateAnimationStateWhenPropChanges() {
  //     if (hasMounted.current) {
  //       const nextStyle = makeStyle(interaction.value)
  //       if (nextStyle) {
  //         motiState.animateTo(nextStyle)
  //       }
  //     } else {
  //       hasMounted.current = true
  //     }
  //   },
  //   [interaction, makeStyle, motiState]
  // )

  const child = (
    <MotiView
      from={from}
      exit={exit}
      transition={transition}
      exitTransition={exitTransition}
      state={state}
      style={style}
    >
      {children}
    </MotiView>
  )

  if (Platform.OS === 'web') {
    return (
      <Pressable
        // @ts-expect-error react-native-web doesn't have types 😢
        onHoverIn={updateInteraction('hovered', true, onHoverIn)}
        onHoverOut={updateInteraction('hovered', true, onHoverOut)}
        onPressIn={updateInteraction('pressed', true, onPressIn)}
        onPressOut={updateInteraction('pressed', true, onPressOut)}
        onLongPress={onLongPress}
        hitSlop={hitSlop}
      >
        {children}
      </Pressable>
    )
  }

  return (
    <TouchableWithoutFeedback
      onPressIn={updateInteraction('pressed', true, onPressIn)}
      onPressOut={updateInteraction('pressed', true, onPressOut)}
      onLongPress={onLongPress}
      onPress={onPress}
      hitSlop={hitSlop}
    >
      {child}
    </TouchableWithoutFeedback>
  )
}
