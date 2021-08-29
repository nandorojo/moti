import {
  INTERACTION_CONTAINER_ID,
  MotiPressableInteractionIds,
  useMotiPressableContext,
} from './context'

type Id = MotiPressableInteractionIds['id']

type Returns<Factory> = {
  id: Id
  factory: Factory
  deps?: readonly any[]
}

type HookName = 'useMotiPressableAnimatedProps' | 'useMotiPressable'

// export function useFactory<Factory extends (...props: any[]) => any>(
//   hookName: HookName,
//   id: MotiPressableInteractionIds['id'],
//   factory: Factory,
//   deps?: readonly any[]
// ): Returns<Factory>
// export function useFactory<Factory extends (...props: any[]) => any>(
//   hookName: HookName,
//   factory: Factory,
//   deps?: readonly any[]
// ): Returns<Factory>
export function useFactory<Factory extends (...props: any[]) => any>(
  hookName: HookName,
  factoryOrId: Factory | MotiPressableInteractionIds['id'],
  maybeFactoryOrDeps?: Factory | readonly any[],
  maybeDeps?: readonly any[]
): Returns<Factory> {
  const context = useMotiPressableContext()
  const missingIdError = `

If you're using a container ID, it should look like this:
${hookName}("${factoryOrId}", ({ pressed }) => {
  'worklet'

  return {
    opacity: pressed ? 1 : 0
  }
})

Otherwise, you could ignore the id and style relative to the closest parent pressable.

${hookName}(({ pressed }) => {
    'worklet'

    return {
      opacity: pressed ? 1 : 0
    }
  })
  `

  let factory: Factory
  let id: Id = INTERACTION_CONTAINER_ID
  let deps: readonly any[] | undefined

  if (typeof factoryOrId === 'function') {
    factory = factoryOrId
    deps = maybeFactoryOrDeps as readonly any[] | undefined
  } else if (typeof maybeFactoryOrDeps === 'function') {
    id = factoryOrId
    factory = maybeFactoryOrDeps
    deps = maybeDeps
  } else {
    throw new Error(
      `[${hookName}] Received id ${factoryOrId} as first argument, but the second argument is not a valid function.` +
        missingIdError
    )
  }

  if (!context) {
    console.error(
      `[${hookName}] Missing context. Are you sure this component is the child of a <MotiPressable /> component?`
    )
  } else if (!context.containers[id]) {
    let error = `[${hookName}] Received id "${id}", but there isn't a <MotiPressable id="${id}" /> component wrapping it. This will result in nothing happening.`

    const containerKeys = Object.keys(context.containers)
    if (containerKeys.length) {
      if (
        containerKeys.length === 1 &&
        containerKeys[0] === INTERACTION_CONTAINER_ID
      ) {
        error += ` There is a <MotiPressable /> component as the parent of this hook, but it doesn't have id="${id}" set as a prop. You should either add that prop to the parent <MotiPressable id="${id}" />, or remove the first argument of ${hookName}().`
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

  return {
    factory,
    id,
    deps,
  }
}
