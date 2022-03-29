import { motify } from '@motify/core'
import {
  View as RView,
  Text as RText,
  Image as RImage,
  ScrollView as RScrollView,
  SafeAreaView as RSafeAreaView,
} from 'react-native'

const View = motify(RView)()
const Text = motify(RText)()
const Image = motify(RImage)()
const ScrollView = motify(RScrollView)()
const SafeAreaView = motify(RSafeAreaView)()

export * from './progress'

export {
  View as MotiView,
  Text as MotiText,
  Image as MotiImage,
  ScrollView as MotiScrollView,
  SafeAreaView as MotiSafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  SafeAreaView,
}
