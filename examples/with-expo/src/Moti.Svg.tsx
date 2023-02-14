import React, { ComponentProps } from 'react'

import { useDynamicAnimation } from 'moti'
import { Rect } from 'react-native-svg'
import { motifySvg } from '../../../packages/moti/src/svg/motify-svg'

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
