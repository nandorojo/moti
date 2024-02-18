import React, { useReducer, useState } from 'react'
import { Button, StyleSheet } from 'react-native'
import { View } from 'moti'

function AnimatedCircle() {
  const colors = ['#41b87a', '#533592']

  const [state, setState] = useState<0 | 1>(0)
  const toggle = () => setState((state) => (state ? 0 : 1))
  const backgroundColor = colors[state]
  return (
    <View>
      <View
        style={styles.circle}
        from={{
          backgroundColor: '#533592',
          opacity: 0,
        }}
        animate={{
          backgroundColor,
          opacity: 1,
        }}
      />
      <Button title="Change BG" color="white" onPress={toggle} />
    </View>
  )
}

export default function DripRepeat() {
  const [shown, toggle] = useReducer((s) => !s, true)
  return (
    <View style={styles.container}>
      {shown && <AnimatedCircle />}
      <Button title="Toggle" onPress={toggle} />
    </View>
  )
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    height: 100,
    width: 100,
    borderRadius: 50,
    marginRight: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
  },
})
