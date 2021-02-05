import 'raf/polyfill'

// @ts-ignore really annoying reanimated bug
global.setImmediate = requestAnimationFrame
export { default } from '../App'
