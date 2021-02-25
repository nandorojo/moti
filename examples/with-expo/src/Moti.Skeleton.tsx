import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View } from 'moti'
import { Skeleton } from '@motify/skeleton'

const Spacer = ({ height = 16 }) => <View style={{ height }} />

export default function HelloWorld() {
  const [visible, toggle] = useReducer((s) => !s, true)

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <Skeleton radius="round" height={75} width={75} />
      <Spacer />
      <Skeleton width={250} />
      <Spacer height={8} />
      <Skeleton width={'100%'} />
      <Spacer height={8} />
      <Skeleton width={'100%'} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 250,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'center',
    // flexDirection: 'row',
    // backgroundColor: '#50E3C2',
    backgroundColor: 'black',
    padding: 16,
  },
})
