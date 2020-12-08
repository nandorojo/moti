import redripify from '../redripify'
import {
  View as RView,
  Text as RText,
  Image as RImage,
  ScrollView as RScrollView,
  SafeAreaView as RSafeAreaView,
} from 'react-native'

export const View = redripify(RView)()
export const Text = redripify(RText)()
export const Image = redripify(RImage)()
export const ScrollView = redripify(RScrollView)()
export const SafeAreaView = redripify(RSafeAreaView)()
