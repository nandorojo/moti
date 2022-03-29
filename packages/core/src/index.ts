import { Platform } from 'react-native'

export { default as motify } from './motify'
export { AnimatePresence } from 'framer-motion'

export * from './types'
// export * from './use-animator/types'
export { default as useAnimationState } from './use-animator'
export { default as useDynamicAnimation } from './use-dynamic-animation'
export * from './use-map-animate-to-style'
export * from './constants'

console.error(`@motify/core is deprecated. It has moved to 'moti'. Please import from 'moti' instead. In the next version, this will throw an error.

${
  Platform.OS == 'web'
    ? `If you're using Next.js, you should remove all @motify/ libraries from your next-transpile-modules list inside of next.config.js. If you aren't using Next.js, you should still remove @motify/ libraries from your Webpack config's tranpile list.`
    : ''
}

Finally, find and replace all your imports.

For more info: https://github.com/nandorojo/moti/pull/136
`)
