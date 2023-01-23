// the Next.js SWC plugin is broken
// thus, some reanimated functions don't work as intented on web
// but re-rendering on changes seems to fix them
// so let's try doing that on Web when firing changes
// normal animate prop that depends on React state seems to work just fine
// reproduction: https://github.com/nandorojo/reanimated-next13-issue
// reanimated issue: https://github.com/software-mansion/react-native-reanimated/issues/3971
// Next.js issue: https://github.com/vercel/next.js/issues/43886

import { Platform } from 'react-native'

let shouldEnableSwcHack = false

export const enableSwcHack = () => {
  shouldEnableSwcHack = Platform.OS === 'web'
}

export const getIsSwcHackEnabled = () => {
  return shouldEnableSwcHack
}

export const getIsSwcHackEnabledWorklet = () => {
  'worklet'
  return shouldEnableSwcHack
}
