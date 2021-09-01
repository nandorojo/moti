import { useMemo } from 'react'

export function useValue<T>(getter: () => T, deps: readonly any[]) {
  return useMemo(
    () => ({
      value: getter(),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  )
}
