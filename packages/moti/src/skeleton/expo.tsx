import { LinearGradient } from 'expo-linear-gradient'

import SkeletonNative from './skeleton-new'
import { MotiSkeletonProps } from './types'

export default function SkeletonExpo(
  props: Omit<MotiSkeletonProps, 'Gradient'>
) {
  return <SkeletonNative {...props} Gradient={LinearGradient as any} />
}

SkeletonExpo.Group = SkeletonNative.Group
