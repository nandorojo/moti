// Forked from https://github.com/gorhom/react-native-bottom-sheet/blob/master/src/hooks/useReactiveSharedValue.ts
import { useEffect, useRef } from 'react'
import Animated, { cancelAnimation, makeMutable } from 'react-native-reanimated'

export const useReactiveSharedValue = <T>(
  value: T
): T extends Animated.SharedValue<any> ? T : Animated.SharedValue<T> => {
  const initialValueRef = useRef<T>(null)
  const valueRef = useRef<Animated.SharedValue<T>>(null)

  if (typeof value === 'object' && 'value' in value) {
    /**
     * if provided value is a shared value,
     * then we do not initialize another one.
     */
  } else if (valueRef.current === null) {
    // @ts-expect-error it's ok
    initialValueRef.current = value
    /**
     * if value is an object, then we need to
     * pass a clone.
     */
    if (typeof value === 'object') {
      // @ts-expect-error it's ok
      valueRef.current = makeMutable({ ...value })
    } else {
      // @ts-expect-error it's ok
      valueRef.current = makeMutable(value)
    }
  } else if (initialValueRef.current !== value) {
    valueRef.current.value = value as T
  }

  useEffect(() => {
    return () => {
      if (valueRef.current) {
        cancelAnimation(valueRef.current)
      }
    }
  }, [])

  // @ts-expect-error it's ok
  return valueRef.current ?? value
}
