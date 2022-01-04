import { useRef } from 'react'

export function useConstant<T>(factory: () => T): T {
  const ref = useRef<T>(null)

  if (ref.current === null) {
    // @ts-expect-error whatever
    ref.current = factory()
  }

  return ref.current
}
