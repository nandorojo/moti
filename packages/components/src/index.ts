import { motify } from '@motify/core'
import {
  View as RView,
  Text as RText,
  Image as RImage,
  ScrollView as RScrollView,
  SafeAreaView as RSafeAreaView,
} from 'react-native'

export const View = motify(RView)()
export const Text = motify(RText)()
export const Image = motify(RImage)()
export const ScrollView = motify(RScrollView)()
export const SafeAreaView = motify(RSafeAreaView)()

export * from './progress'

export {
  View as MotiView,
  Text as MotiText,
  Image as MotiImage,
  ScrollView as MotiScrollView,
  SafeAreaView as MotiSafeAreaView,
}
