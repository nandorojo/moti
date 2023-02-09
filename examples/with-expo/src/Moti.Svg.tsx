import React, { ComponentProps } from 'react'

import { Rect } from 'react-native-svg'
import { MotiView, useDynamicAnimation } from 'moti'
import { motifySvg } from '../../../packages/moti/src/core/motify-svg'
import { useDerivedValue } from 'react-native-reanimated'

const MotiRect = motifySvg(Rect)()

type Animate = Omit<
  React.PropsWithoutRef<ComponentProps<typeof Rect>>,
  'children'
>

const animate: Animate = {}

export default function Svg() {
  const animation = useDynamicAnimation<ComponentProps<typeof Rect>>(() => ({}))
  return (
    <MotiRect
      state={animation}
      animate={{
        fill: '',
      }}
    />
  )
}
