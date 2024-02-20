import { useMotify } from 'moti'
import { useEffect, useReducer, useState } from 'react'
import { Button, View, ViewStyle } from 'react-native'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

global.shouldDebugMoti = false

const modes = ['Animated', 'Moti'] as const

let logs: Record<string, number[]> = {}

const list = new Array(1).fill(null).map((_, i) => i)

export default function List() {
  const [mode, setMode] = useState<(typeof modes)[number]>(modes[0])
  const [, render] = useReducer((s) => s + 1, 0)

  let renderStartAt = Date.now()

  useEffect(() => {
    const interval = setInterval(() => {
      render()

      const maxRendersPerMode = 4

      if (logs[mode]?.length === maxRendersPerMode) {
        // remove biggest and smallest values
        clearInterval(interval)
        const nextMode = modes[modes.indexOf(mode) + 1]

        if (nextMode) {
          setMode(nextMode)
        } else {
          console.log(logs)

          let means = {}
          let medians = {}

          for (let key in logs) {
            means[key] = logs[key].reduce((a, b) => a + b, 0) / logs[key].length
          }

          for (let key in logs) {
            const list = logs[key].slice().sort()
            medians[key] = list[list.length / 2] ?? list[(list.length - 1) / 2]
          }

          console.log('Averages: ', JSON.stringify(means, null, 2))

          console.log('Medians: ', JSON.stringify(medians, null, 2))

          logs = {}
        }
      }
    }, 600)

    return () => {
      clearInterval(interval)
    }
  }, [mode])

  useEffect(
    function measurePerf() {
      let renderEndAt = Date.now()

      const duration = renderEndAt - renderStartAt

      logs[mode] = logs[mode] || []
      logs[mode].push(duration)
    },
    [mode, renderStartAt]
  )

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {modes.map((m) => (
        <Button
          key={m}
          title={m}
          onPress={() => {
            setMode(m)
            render()
          }}
        />
      ))}

      <Lists mode={mode} key={Math.random()} />
    </View>
  )
}

const Lists = ({ mode }) => {
  return (
    <>
      <>{mode === 'Animated' && list.map((_, i) => <Reanimated key={i} />)}</>
      <>{mode === 'Moti' && list.map((_, i) => <Moti key={i} />)}</>
    </>
  )
}
const Reanimated = () => {
  return (
    <Animated.View style={useAnimatedStyle(() => ({}), [])}></Animated.View>
  )
}

const Moti = () => {
  const { style } = useMotify<ViewStyle>({})
  return <Animated.View style={style}></Animated.View>
}
