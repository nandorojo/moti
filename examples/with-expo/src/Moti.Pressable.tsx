import React from 'react'
import { StyleSheet, View } from 'react-native'
import { MotiImage } from 'moti'
import { MotiPressable, usePressable } from '@motify/interactions'

function Logo() {
  const state = usePressable(({ pressed }) => {
    'worklet'

    return {
      opacity: pressed ? 0.5 : 1,
      scale: pressed ? 2 : 1,
    }
  })

  return (
    <MotiImage
      source={{
        uri: beatGigLogo,
      }}
      state={state}
      style={styles.logo}
      resizeMode="contain"
    />
  )
}

function App() {
  return (
    <MotiPressable style={styles.shape}>
      <Logo />
    </MotiPressable>
  )
}

export default function HelloWorld() {
  return (
    <View style={styles.container}>
      <App />
    </View>
  )
}

const styles = StyleSheet.create({
  shape: {
    justifyContent: 'center',
    height: 180,
    width: 250,
    borderRadius: 25,
    marginRight: 10,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: 'black',
  },
  logo: {
    alignSelf: 'center',
    height: 50,
    width: 200,
  },
})

const beatGigLogo = `https://beatgig.com/_next/static/images/beatgig-256-a2ce12989084a7604b2cb2994e29fccb.png`
