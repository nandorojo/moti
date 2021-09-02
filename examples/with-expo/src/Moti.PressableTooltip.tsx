import React from 'react'
import { StyleSheet, View } from 'react-native'
import { MotiImage } from 'moti'
import {
  mergeAnimateProp,
  MotiPressable,
  useMotiPressable,
  useMotiPressableTransition,
} from '@motify/interactions'

function Logo() {
  const state = useMotiPressable(
    'logo',
    ({ pressed, hovered }) => {
      'worklet'

      return {
        opacity: pressed || hovered ? 0.5 : 1,
      }
    },
    []
  )

  const transition = useMotiPressableTransition(({ pressed }) => {
    'worklet'

    return {
      delay: pressed ? 0 : 100,
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
      // transition={useDerivedValue(() => ({ type: 'timing' }), [])}
      transition={transition}
    />
  )
}

function App() {
  return (
    <MotiPressable
      animate={(state) => {
        'worklet'

        return mergeAnimateProp(state, {
          scale: state.pressed ? 0.9 : 1,
        })
      }}
      id="logo"
      style={styles.shape}
    >
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
