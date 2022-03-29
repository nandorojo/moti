import { motify } from '@motify/core'
import {
  View as RView,
  Text as RText,
  Image as RImage,
  ScrollView as RScrollView,
  SafeAreaView as RSafeAreaView,
  Platform,
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

console.error(`@motify/core is deprecated. It has moved to 'moti'. Please import from 'moti' instead. In the next version, this will throw an error.

${
  Platform.OS == 'web'
    ? `If you're using Next.js, you should remove all @motify/ libraries from your next-transpile-modules list inside of next.config.js. If you aren't using Next.js, you should still remove @motify/ libraries from your Webpack config's tranpile list.`
    : ''
}

Finally, find and replace all your imports.

For more info: https://github.com/nandorojo/moti/pull/136
`)
