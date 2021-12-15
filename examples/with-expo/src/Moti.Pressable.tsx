import React from 'react'
import { StyleSheet, View } from 'react-native'
import { MotiImage, MotiView } from 'moti'
import { MotiPressable, useMotiPressable } from 'moti/interactions'

function Logo() {
  const state = useMotiPressable(
    'logo',
    ({ pressed, hovered }) => {
      'worklet'

      return {
        // opacity: pressed ? 0.25 : hovered ? 0.8 : 1,
        scale: pressed ? 0.97 : hovered ? 1.05 : 1,
        backgroundColor: pressed ? '#ffffff' : '#000000',
      }
    },
    []
  )

  return (
    <MotiView
      state={state}
      style={styles.logo}
      transition={{ type: 'timing', duration: 200 }}
    />
  )
}

function App() {
  return (
    <MotiPressable id="logo" style={styles.shape}>
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
