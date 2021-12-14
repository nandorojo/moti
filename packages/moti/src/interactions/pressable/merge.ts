import type { MotiPressableInteractionState, MotiPressableProp } from './types'

export function mergeAnimateProp(
  interaction: MotiPressableInteractionState,
  prop?: MotiPressableProp,
  extra?: MotiPressableProp
) {
  'worklet'

  let final = {}
  for (const animate of [prop, extra]) {
    if (animate) {
      if (typeof animate === 'function') {
        final = Object.assign(final, animate(interaction))
      } else {
        final = Object.assign(final, animate)
      }
    }
  }

  return final
}
