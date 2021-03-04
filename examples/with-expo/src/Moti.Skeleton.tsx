import React, { useReducer } from 'react'
import { StyleSheet, Pressable } from 'react-native'
import { View } from 'moti'
import { Skeleton } from '@motify/skeleton'

const Spacer = ({ height = 16 }) => <View style={{ height }} />

const transition = {
  opacity: {
    duration: 300,
  },
}

export default function HelloWorld() {
  const [dark, toggle] = useReducer((s) => !s, true)

  const colorMode = dark ? 'dark' : 'light'

  return (
    <Pressable onPress={toggle} style={styles.container}>
      <View
        transition={{
          type: 'timing',
        }}
        style={[styles.container, styles.padded]}
        animate={{ backgroundColor: dark ? '#000000' : '#ffffff' }}
      >
        <Skeleton
          transition={transition}
          colorMode={colorMode}
          radius="round"
          height={75}
          width={75}
        />
        <Spacer />
        <Skeleton transition={transition} colorMode={colorMode} width={250} />
        <Spacer height={8} />
        <Skeleton
          transition={transition}
          colorMode={colorMode}
          width={'100%'}
        />
        <Spacer height={8} />
        <Skeleton
          transition={transition}
          colorMode={colorMode}
          width={'100%'}
        />
      </View>
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
  },
  padded: {
    padding: 16,
  },
})
