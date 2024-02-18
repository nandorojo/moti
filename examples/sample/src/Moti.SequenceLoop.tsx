import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { MotiView } from 'moti'
import {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useAnimatedStyle,
  interpolate,
} from 'react-native-reanimated'

const dots = 3

const Dot = React.memo(function Dot({ index }: { index: number }) {
  const timing = useSharedValue(0)

  useEffect(() => {
    timing.value = withRepeat(
      withTiming(dots + 1, {
        duration: 2500,
        easing: Easing.inOut(Easing.linear),
      }),
      -1,
      false
    )
  }, [timing])

  const style = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        timing.value,
        [index, index + 1, index + 2],
        [0, 1, 0]
      ),
    }
  }, [])

  return <MotiView style={[styles.shape, style]} />
})

export default function HelloWorld() {
  return (
    <View style={styles.container}>
      {new Array(dots).fill('').map((_, i) => {
        return <Dot key={i} index={i} />
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'cyan',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#111',
  },
})

// const delay = 3000

// const duration = delay / dots
// function Shape({ index }: { index: number }) {
//   return (
//     <MotiView
//       animate={{
//         opacity: [{ value: 0, delay: 0 }, 1, { value: 0, delay: 0 }],
//       }}
//       transition={{
//         type: 'timing',
//         loop: true,
//         duration: duration,
//         // repeatReverse: false,
//         delay: (index + 1) * (duration / 2),
//       }}
//       style={styles.shape}
//     />
//   )
// }
