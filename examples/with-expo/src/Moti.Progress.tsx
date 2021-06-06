import React, { useReducer } from 'react'
import { StyleSheet, Pressable, View } from 'react-native'
import { MotiProgressBar } from 'moti'

function Bar() {
  const [progress, increment] = useReducer((progress) => {
    if (progress + 0.1 > 1) {
      return 0
    }
    return progress + 0.1
  }, 0.1)

  return (
    <Pressable onPress={increment} style={styles.bar}>
      <MotiProgressBar color="#fff" containerColor="#666" progress={progress} />
    </Pressable>
  )
}

export default function HelloWorld() {
  return (
    <View style={styles.container}>
      <Bar />
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    padding: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    // flexDirection: 'row',
    backgroundColor: '#000',
    padding: 16,
  },
})
