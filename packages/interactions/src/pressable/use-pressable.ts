import {
  INTERACTION_CONTAINER_ID,
  MotiPressableInteractionIds,
  useMotiPressableContext,
} from './context'
import type { MotiPressableInteractionProp } from './types'
import { useDerivedValue } from 'react-native-reanimated'
import type { MotiProps } from 'packages/core/lib/typescript/src'
import { useMemo } from 'react'

type Id = MotiPressableInteractionIds['id']

function usePressable(
  id: Id,
  factory: MotiPressableInteractionProp
): MotiProps['state']
function usePressable(factory: MotiPressableInteractionProp): MotiProps['state']
function usePressable(
  factoryOrId: MotiPressableInteractionProp | Id,
  maybeFactory?: MotiPressableInteractionProp
): MotiProps['state'] {
  const context = useMotiPressableContext()

  const missingIdError = `

If you're using a container ID, it should look like this:
usePressable("${factoryOrId}", ({ pressed }) => {
  'worklet'

  return {
    opacity: pressed ? 1 : 0
  }
})

Otherwise, you could ignore the id and style relative to the closest parent pressable.

usePressable(({ pressed }) => {
    'worklet'

    return {
      opacity: pressed ? 1 : 0
    }
  })
  `

  let factory: MotiPressableInteractionProp
  let id: Id = INTERACTION_CONTAINER_ID

  if (typeof factoryOrId === 'function') {
    factory = factoryOrId
  } else if (typeof factoryOrId === 'string') {
    id = factoryOrId
    if (typeof maybeFactory === 'function') {
      factory = maybeFactory
    } else {
      console.error(
        `[usePressable] Received id ${factoryOrId} as first argument, but the second argument is not a valid function.` +
          missingIdError
      )
    }
  }

  if (!context) {
    console.error(
      '[usePressable] Missing context. Are you sure this component is the child of a <MotiPressable /> component?'
    )
  } else if (!context.containers[id]) {
    let error = `[usePressable] Received id "${id}", but there isn't a <MotiPressable id="${id}" /> component wrapping it. This will result in nothing happening.`

    const containerKeys = Object.keys(context.containers)
    if (containerKeys.length) {
      if (containerKeys.length === 1) {
        if (containerKeys[0] === INTERACTION_CONTAINER_ID) {
          error += ` There is a <MotiPressable /> component as the parent of this hook, one but it doesn't have id="${id}" set as a prop. You should either add that prop to the parent <MotiPressable id="${id}" />, or remove the first argument of usePressable().`
        }
      } else {
        const possibleIds = containerKeys.filter(
          (key) => key !== INTERACTION_CONTAINER_ID
        )
        if (possibleIds.length) {
          error += ` Did you mean to use one of: ${possibleIds.join(', ')}`
        }
      }
    }

    error = error + missingIdError
    console.error(error)
  }

  const __state = useDerivedValue(() => {
    const interaction = context.containers[id]

    if (!interaction) {
      return {}
    }

    return factory(interaction.value)
  })

  return useMemo(
    () => ({
      __state,
    }),
    [__state]
  )
}

export { usePressable }
