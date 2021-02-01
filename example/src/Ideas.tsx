/**
 * @author Terry Sahaidak
 *
 * Based on gist: https://gist.github.com/terrysahaidak/b0cd58a531521899ffe36dad83a642d4
 * Conversation context: https://twitter.com/terrysahaidak/status/1329779304817942530
 *
 * Terry shared this with me on Twitter, and I've adapted it to test out some ideas for a good API. I have edited it and made it typed.
 */

import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  Easing,
  withSpring,
  processColor,
  withDecay,
  delay as RDelay,
} from 'react-native-reanimated'
// import processColor from 'react-native-reanimated/src/reanimated2/Colors'
import { View, Button } from 'react-native'
import React, { useRef, useContext } from 'react'
import { colorKeys } from 'moti'

type Animation = typeof withSpring | typeof withDecay | typeof withTiming

function animateStyles(styles, animation: Animation, config) {
  'worklet'

  return Object.keys(styles).reduce((acc, key) => {
    const style = styles[key]

    if (colorKeys.includes(key)) {
      acc[key] = animation(processColor(style), config)
    } else if (Array.isArray(style)) {
      // transforms
      acc[key] = []

      style.forEach((value) => {
        const transformKey = Object.keys(value)[0]
        const transformValue = value[transformKey]
        const transform = {}
        transform[transformKey] = animation(transformValue, config)

        acc[key].push(transform)
      })
    } else if (typeof style === 'object') {
      // shadows and etc
      acc[key] = {}

      Object.keys(style).forEach((styleInnerKey) => {
        acc[key][styleInnerKey] = animation(style, config)
      })
    } else {
      acc[key] = animation(style, config)
    }

    return acc
  }, {})
}

function withSpringEnhanced(style, config) {
  'worklet'

  if (typeof style === 'object') {
    return animateStyles(style, withSpring, config)
  }

  return withSpring(style, config)
}

const defaultConfig = {
  duration: 500,
  easing: Easing.bezier(0.5, 0.01, 0, 1),
}

// function TransitionView({
//   style,
//   animation = withTiming,
//   config = defaultConfig,
//   ...props
// }) {
//   const sv = useSharedValue(style);

//   useEffect(() => {
//     sv.value = style;
//   }, [style]);

//   const animStyle = useAnimatedStyle(() => {
//     return animateStyles(sv.value, animation, config);
//   });

//   return <Animated.View style={animStyle} {...props} />;
// }

const TransitionContext = React.createContext(null)

function TransitionView({
  style,
  variants,
  initial,
  controller,
  animation = withTiming,
  config = defaultConfig,
  delay,
  ...props
}) {
  const maybeContext = useContext(TransitionContext)
  const controllerToUse = controller ?? maybeContext?.controller

  const variantsSv = useSharedValue(variants.__variants)
  const state = controllerToUse._state

  if (!initial) {
    initial = maybeContext?.initial
  } else if (typeof initial === 'string') {
    initial = variantsSv?.value[initial]
  }

  const animStyle = useAnimatedStyle(() => {
    return animateStyles(
      variantsSv.value[state.value || initial],
      (styles, config) => {
        const a = animation(styles, config)

        if (delay) {
          return RDelay(delay, a)
        }

        return a
      },
      config
    )
  })

  return (
    <TransitionContext.Provider value={{ variantsSv, controller, initial }}>
      <Animated.View style={[style, animStyle]} {...props} />
    </TransitionContext.Provider>
  )
}

function useAnimatedController() {
  const ref = useRef()
  const _state = useSharedValue(0)

  if (typeof ref.current === 'undefined') {
    ref.current = {
      current: null,
      _state,
      transitionTo: (value) => {
        ref.current.current = value
        _state.value = value
      },
    }
  }

  return ref.current
}

type Variants<Key extends string, Value> = Record<Key, Value>

function useVariants<T>(variants: T) {
  const ref = useRef<{ __variants: T } & T>(null as any)

  if (ref.current === null) {
    ref.current = {} as any
    const keys = Object.keys(variants)

    keys.forEach((key) => {
      ref.current[key] = key
    })

    ref.current.__variants = variants
    // ref.current = {
    //   __variants,
    // }
  }

  return ref.current
}

export default function TransitionViewExample() {
  const list = useVariants({
    initial: {
      opacity: 0,
    },
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  })

  const item = useVariants({
    initial: {
      top: 50,
      opacity: 0,
    },
    visible: {
      top: 0,
      opacity: 1,
    },
    hidden: {
      top: 0,
      opacity: 0,
    },
  })

  const controller = useAnimatedController()

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <TransitionView
        controller={controller}
        variants={list}
        initial={list.initial}
        style={{
          margin: 30,
        }}
      >
        <TransitionView
          variants={item}
          delay={100}
          style={{
            backgroundColor: 'black',
            height: 80,
            marginBottom: 8,
          }}
        />
        <TransitionView
          variants={item}
          delay={200}
          style={{
            backgroundColor: 'black',
            height: 80,
            marginBottom: 8,
          }}
        />
        <TransitionView
          variants={item}
          delay={300}
          style={{
            backgroundColor: 'black',
            height: 80,
            marginBottom: 8,
          }}
        />
      </TransitionView>
      <Button
        title="toggle"
        onPress={() => {
          if (controller.current === list.visible) {
            controller.transitionTo(list.hidden)
          } else if (controller.current === list.hidden) {
            controller.transitionTo(list.initial)
          } else {
            controller.transitionTo(list.visible)
          }
        }}
      />
    </View>
  )
}

function AnimatedStyleUpdateExample(props) {
  const expanded = useSharedValue(false)

  const config = {
    duration: 500,
    easing: Easing.bezier(0.5, 0.01, 0, 1),
  }

  const style = useAnimatedStyle(() => {
    if (expanded.value) {
      return {
        backgroundColor: 'red',
        width: withTiming(100, config),
        height: withTiming(100, config),
        borderRadius: withTiming(100, config),
      }
    }

    return {
      backgroundColor: 'red',
      width: withTiming(30, config),
      height: withTiming(30, config),
      borderRadius: withTiming(4, config),
    }
  })

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
      }}
    >
      <Animated.View
        style={[
          { width: 100, height: 80, backgroundColor: 'black', margin: 30 },

          style,
        ]}
      />
      <Button
        title="toggle"
        onPress={() => {
          expanded.value = !expanded.value
        }}
      />
    </View>
  )
}
