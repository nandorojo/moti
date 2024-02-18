import { useAnimationState, useDynamicAnimation } from 'moti'
import React from 'react'

export function App() {
  const state = useAnimationState({
    from: {
      transition: {
        type: 'timing',
      },
    },
  })
  const state2 = useDynamicAnimation(() => ({
    scale: 0.5,
    transition: {
      type: 'timing',
    },
  }))

  const toggleTransition = () => {
    state.transitionTo('from')
  }

  const animateTo = () => {
    state2.animateTo({
      opacity: 1,
      transition: {
        type: 'timing',
      },
    })
  }

  return <></>
}
