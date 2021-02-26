import React, { useState } from 'react'
import { View as MotiView } from '@motify/components'
import { View, StyleSheet } from 'react-native'

import { LinearGradient } from 'expo-linear-gradient'
import { AnimatePresence } from 'framer-motion'

type Props = {
  /**
   * Optional height of the container of the skeleton. If set, it will give a fixed height to the container.
   *
   * If not set, the container will stretch to the children.
   */
  boxHeight?: number | string
  /**
   * Optional height of the skeleton. Defauls to a `minHeight` of `32`
   */
  height?: number | string
  children?: React.ReactChild
  /**
   * `boolean` specifying whether the skeleton should be visible. By default, it shows if there are no children. This way, you can conditionally display children, and automatically hide the skeleton when they exist.
   *
   * ```tsx
   * // skeleton will hide when data exists
   * <Skeleton>
   *   {data ? <Data /> : null}
   * </Skeleton>
   * ```
   *
   * // skeleton will always show
   * <Skeleton show>
   *   {data ? <Data /> : null}
   * </Skeleton>
   *
   * // skeleton will always hide
   * <Skeleton show={false}>
   *   {data ? <Data /> : null}
   * </Skeleton>
   */
  show?: boolean
  /**
   * Width of the skeleton. Defaults to `32` as the `minWidth`.
   */
  width?: string | number
  /**
   * Border radius. Can be `square`, `round`, or a number. `round` makes it a circle. Defaults to `8`.
   */
  radius?: number | 'square' | 'round'
  /**
   * Background of the box that contains the skeleton. Should match the main `colors` prop color.
   *
   * Default: `'rgb(51, 51, 51, 50)'`
   */
  backgroundColor?: string
  /**
   * Gradient colors. Defaults to grayish black.
   */
  colors?: string[]
  /**
   * Default: `6`. Similar to `600%` for CSS `background-size`. Determines how much the gradient stretches.
   */
  backgroundSize?: number
  /**
   * `light` or `dark`. Default: `dark`.
   */
  colorMode?: keyof typeof baseColors
}

const DEFAULT_SIZE = 32

const baseColors = {
  dark: { primary: 'rgb(17, 17, 17)', secondary: 'rgb(51, 51, 51)' },
  light: {
    primary: 'rgb(250, 250, 250)',
    secondary: 'rgb(234, 234, 234)',
  },
} as const

const makeColors = (mode: keyof typeof baseColors) => [
  baseColors[mode].primary,
  baseColors[mode].secondary,
  baseColors[mode].secondary,
  baseColors[mode].primary,
  baseColors[mode].secondary,
  baseColors[mode].primary,
]

let defaultDarkColors = makeColors('dark')

let defaultLightColors = makeColors('light')

for (let i = 0; i++; i < 3) {
  defaultDarkColors = [...defaultDarkColors, ...defaultDarkColors]
  defaultLightColors = [...defaultLightColors, ...defaultLightColors]
}

export default function Skelton(props: Props) {
  const {
    radius = 8,
    children,
    show = !children,
    width,
    height = children ? undefined : DEFAULT_SIZE,
    boxHeight,
    colorMode = 'dark',
    colors = colorMode === 'dark' ? defaultDarkColors : defaultLightColors,
    backgroundColor = 'rgb(51, 51, 51, 50)',
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
      <AnimatePresence>
        {show && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius,
              width: width ?? (children ? '100%' : DEFAULT_SIZE),
              height: height ?? '100%',
              backgroundColor,
              overflow: 'hidden',
            }}
            onLayout={({ nativeEvent }) => {
              console.log('[measured]', nativeEvent.layout)
              if (measuredWidth) return

              setMeasuredWidth(nativeEvent.layout.width)
            }}
            pointerEvents="none"
          >
            <AnimatedGradient
              // force a key change to make the loop animation re-mount
              key={`${JSON.stringify(colors)}-${measuredWidth}`}
              colors={colors}
              measuredWidth={measuredWidth}
            />
          </View>
        )}
      </AnimatePresence>
    </View>
  )
}

const AnimatedGradient = React.memo(
  function AnimatedGradient({
    measuredWidth,
    colors,
  }: {
    measuredWidth: number
    colors: string[]
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
          opacity: 1,
        }}
        animate={{
          translateX: -measuredWidth * (backgroundSize - 1),
          opacity: 1,
        }}
        exit={{
          opacity: 0,
        }}
        transition={{
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
  },
  function propsAreEqual(prev, next) {
    return JSON.stringify(prev) === JSON.stringify(next)
  }
)
