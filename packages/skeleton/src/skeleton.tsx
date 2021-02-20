import React, { useState } from 'react'
import { View as MotiView } from '@motify/components'
import { View, StyleSheet } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'

type Props = {
  boxHeight?: number | string
  height?: number | string
  children?: React.ReactNode
  show?: boolean
  width?: string | number
  radius?: number | 'square' | 'round'
  // emptyHeight?: number | string
}

const DEFAULT_SIZE = 32

let colors = [
  'rgb(17, 17, 17)',
  'rgb(51, 51, 51)',
  'rgb(51, 51, 51)',
  'rgb(17, 17, 17)',
]

for (let i = 0; i++; i < 3) {
  colors = [...colors, ...colors]
}

export default function Skelton(props: Props) {
  const {
    radius = 8,
    children,
    show = !children,
    width,
    height = children ? undefined : DEFAULT_SIZE,
    boxHeight,
    // emptyHeight = 32,
  } = props

  const [measuredWidth, setMeasuredWidth] = useState(0)

  const getBorderRadius = () => {
    if (radius === 'square') {
      return 0
    }
    if (radius === 'round') {
      return 99999
    }
    return radius
  }

  const borderRadius = getBorderRadius()

  const getOuterHeight = () => {
    if (boxHeight != null) return boxHeight
    if (show && !children) {
      return height
    }
    return undefined
  }

  console.log({ measuredWidth })

  const outerHeight = getOuterHeight()

  return (
    <View
      style={{
        height: outerHeight,
        minHeight: height,
        minWidth: width ?? (children ? undefined : DEFAULT_SIZE),
      }}
    >
      {children}
      {show && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius,
            width: width ?? (children ? '100%' : DEFAULT_SIZE),
            height: height ?? '100%',
            backgroundColor: 'rgb(51, 51, 51, 50)',
            overflow: 'hidden',
          }}
          onLayout={({ nativeEvent }) => {
            console.log('[measured]', nativeEvent.layout)
            if (measuredWidth) return

            setMeasuredWidth(nativeEvent.layout.width)
          }}
          pointerEvents="none"
        >
          <AnimatedGradient measuredWidth={measuredWidth} key={measuredWidth} />
        </View>
      )}
    </View>
  )
}

const AnimatedGradient = React.memo(function AnimatedGradient({
  measuredWidth,
}: {
  measuredWidth: number
}) {
  const backgroundSize = 6
  if (!measuredWidth) return null
  return (
    <MotiView
      style={{
        ...StyleSheet.absoluteFillObject,
        width: measuredWidth * backgroundSize,
      }}
      from={{
        translateX: 0,
      }}
      animate={{
        // -1 so that it stays in view
        translateX: -measuredWidth * (backgroundSize - 1),
        // translateX: -500,
      }}
      transition={{
        // repeat: 30,
        type: 'timing',
        duration: 3000,
        loop: true,
      }}
      delay={200}
    >
      <LinearGradient
        colors={colors}
        start={[0.1, 1]}
        end={[1, 1]}
        style={[StyleSheet.absoluteFillObject]}
      />
    </MotiView>
  )
})
