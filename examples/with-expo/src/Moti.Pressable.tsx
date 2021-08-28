import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { MotiPressable } from '@motify/interactions'

function Shape() {
  return (
    <MotiPressable
      from={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={({ pressed }) => {
        'worklet'

        return {
          opacity: pressed ? 0.2 : 1,
          scale: pressed ? 2 : 1,
        }
      }}
      style={styles.shape}
    >
      <Image
        source={{
          uri: beatGigLogo,
        }}
        width={100}
        height={50}
        style={styles.logo}
        resizeMode="contain"
      />
    </MotiPressable>
  )
}

export default function HelloWorld() {
  return (
    <View style={styles.container}>
      <Shape />
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
    width: '80%',
    alignSelf: 'center',
    height: 0,
    paddingBottom: '30%',
  },
})

const beatGigLogo = `https://beatgig.com/_next/static/images/beatgig-256-a2ce12989084a7604b2cb2994e29fccb.png`
