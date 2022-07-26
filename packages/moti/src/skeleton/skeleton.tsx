import { LinearGradient } from 'expo-linear-gradient'
import React, { useState, createContext, useContext } from 'react'
import { View, StyleSheet } from 'react-native'

import { View as MotiView } from '../components'
import { AnimatePresence, MotiTransitionProp } from '../core'

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
  children?: React.ReactChild | null
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
   *
   * If you have multiple skeletons, you can use the `<Skeleton.Group show={loading} /> as a parent rather than use this prop directly.
   */
  show?: boolean
  /**
   * Width of the skeleton. Defaults to `32` as the `minWidth`. Sets the container's `minWidth` to this value if defined, falling back to 32.
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
  disableExitAnimation?: boolean
  transition?: MotiTransitionProp
}

const DEFAULT_SIZE = 32

const baseColors = {
  dark: { primary: 'rgb(17, 17, 17)', secondary: 'rgb(51, 51, 51)' },
  light: {
    primary: 'rgb(250, 250, 250)',
    secondary: 'rgb(205, 205, 205)',
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

export default function Skeleton(props: Props) {
  const skeletonGroupContext = useContext(SkeletonGroupContext)
  const {
    radius = 8,
    children,
    show = skeletonGroupContext ?? !children,
    width,
    height = children ? undefined : DEFAULT_SIZE,
    boxHeight,
    colorMode = 'dark',
    colors = colorMode === 'dark' ? defaultDarkColors : defaultLightColors,
    backgroundColor = colors[0] ??
      colors[1] ??
      baseColors[colorMode]?.secondary,
    backgroundSize = 6,
    disableExitAnimation,
    transition,
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
          <MotiView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius,
              width: width ?? (children ? '100%' : DEFAULT_SIZE),
              height: height ?? '100%',
              overflow: 'hidden',
            }}
            animate={{
              backgroundColor,
              opacity: 1,
            }}
            transition={{
              type: 'timing',
            }}
            exit={
              !disableExitAnimation && {
                opacity: 0,
              }
            }
            onLayout={({ nativeEvent }) => {
              if (measuredWidth === nativeEvent.layout.width) return

              setMeasuredWidth(nativeEvent.layout.width)
            }}
            pointerEvents="none"
          >
            <AnimatedGradient
              // force a key change to make the loop animation re-mount
              key={`${JSON.stringify(colors)}-${measuredWidth}-${JSON.stringify(
                transition || null
              )}`}
              colors={colors}
              backgroundSize={backgroundSize}
              measuredWidth={measuredWidth}
              transition={transition}
            />
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  )
}

const AnimatedGradient = React.memo(
  function AnimatedGradient({
    measuredWidth,
    colors,
    backgroundSize,
    transition = {},
  }: {
    measuredWidth: number
    colors: string[]
    backgroundSize: number
    transition?: MotiTransitionProp
  }) {
    return (
      <MotiView
        style={StyleSheet.absoluteFillObject}
        from={{ opacity: 0 }}
        transition={{
          type: 'timing',
          duration: 200,
        }}
        animate={
          measuredWidth
            ? {
                opacity: 1,
              }
            : undefined
        }
      >
        <MotiView
          style={[
            StyleSheet.absoluteFillObject,
            {
              width: measuredWidth * backgroundSize,
            },
          ]}
          from={{
            translateX: 0,
          }}
          animate={
            measuredWidth
              ? {
                  translateX: -measuredWidth * (backgroundSize - 1),
                }
              : undefined
          }
          transition={{
            loop: true,
            delay: 200,
            type: 'timing',
            duration: 3000,
            ...(transition as any),
          }}
        >
          <LinearGradient
            colors={colors}
            start={[0.1, 1]}
            end={[1, 1]}
            style={StyleSheet.absoluteFillObject}
          />
        </MotiView>
      </MotiView>
    )
  },
  function propsAreEqual(prev, next) {
    if (prev.measuredWidth !== next.measuredWidth) return false

    if (prev.backgroundSize !== next.backgroundSize) return false

    const didColorsChange = prev.colors.some((color, index) => {
      return color !== next.colors[index]
    })

    if (didColorsChange) return false

    // transition changes will not be respected, but it'll be in the key
    return true
  }
)

const SkeletonGroupContext = createContext<boolean | undefined>(undefined)

function SkeletonGroup({
  children,
  show,
}: {
  children: React.ReactNode
  /**
   * If `true`, all `Skeleton` children components will be shown.
   *
   * If `false`, the `Skeleton` children will be hidden.
   */
  show: boolean
}) {
  return (
    <SkeletonGroupContext.Provider value={show}>
      {children}
    </SkeletonGroupContext.Provider>
  )
}

Skeleton.Group = SkeletonGroup
