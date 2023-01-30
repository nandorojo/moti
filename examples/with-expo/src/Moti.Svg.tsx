import React from 'react'

import { Rect } from 'react-native-svg'
import { motify } from 'moti'

const MotiRect = motify(Rect)({ isSvg: true })

export default function Svg() {
  return <MotiRect animate={{}} />
}
