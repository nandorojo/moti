import LinearGradient from 'react-native-linear-gradient'

import SkeletonNative from './skeleton-new'
import { MotiSkeletonProps } from './types'

export function Skeleton(props: Omit<MotiSkeletonProps, 'Gradient'>) {
  return <SkeletonNative {...props} Gradient={LinearGradient as any} />
}

Skeleton.Group = SkeletonNative.Group
