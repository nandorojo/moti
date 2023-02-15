// credit to https://gist.github.com/ianmartorell/32bb7df95e5eff0a5ee2b2f55095e6a6
// this file was repurosed from there
// via this issue https://gist.github.com/necolas/1c494e44e23eb7f8c5864a2fac66299a
// because RNW's pressable doesn't bubble events to parent pressables: https://github.com/necolas/react-native-web/issues/1875
// click listeners copied from https://gist.github.com/roryabraham/65cd1d2d5e8a48da78fec6a6e3105398

/* eslint-disable no-inner-declarations */
import { Platform } from 'react-native'

let isEnabled = false

if (Platform.OS === 'web' && typeof window !== 'undefined') {
  /**
   * Web browsers emulate mouse events (and hover states) after touch events.
   * This code infers when the currently-in-use modality supports hover
   * (including for multi-modality devices) and considers "hover" to be enabled
   * if a mouse movement occurs more than 1 second after the last touch event.
   * This threshold is long enough to account for longer delays between the
   * browser firing touch and mouse events on low-powered devices.
   */
  const HOVER_THRESHOLD_MS = 1000
  let lastTouchTimestamp = 0

  const enableHover = () => {
    if (isEnabled || Date.now() - lastTouchTimestamp < HOVER_THRESHOLD_MS) {
      return
    }
    isEnabled = true
  }

  const disableHover = () => {
    lastTouchTimestamp = Date.now()
    if (isEnabled) {
      isEnabled = false
    }
  }

  document.addEventListener('touchstart', disableHover, true)
  document.addEventListener('touchmove', disableHover, true)
  document.addEventListener('mousemove', enableHover, true)
}

function isHoverEnabled(): boolean {
  return isEnabled
}

import React, { useCallback, ReactChild, useRef, useEffect } from 'react'
import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated'
import { HoveredContext } from './hoverable-context'
import { mergeRefs } from './merge-refs'

export interface HoverableProps {
  onHoverIn?: () => void
  onHoverOut?: () => void
  children: NonNullable<ReactChild>
  childRef?: React.Ref<any>
}

export function Hoverable({
  onHoverIn,
  onHoverOut,
  children,
  childRef,
}: HoverableProps) {
  const isHovered = useSharedValue(false)

  const hoverIn = useRef<undefined | (() => void)>(() => onHoverIn?.())
  const hoverOut = useRef<undefined | (() => void)>(() => onHoverOut?.())

  const localRef = useRef<HTMLDivElement>(null)

  hoverIn.current = onHoverIn
  hoverOut.current = onHoverOut

  useEffect(
    function disableHoverOnClickOutside() {
      // https://gist.github.com/necolas/1c494e44e23eb7f8c5864a2fac66299a#gistcomment-3629646
      const listener = (event: MouseEvent) => {
        if (
          localRef.current &&
          event.target instanceof HTMLElement &&
          !localRef.current.contains(event.target)
        ) {
          isHovered.value = false
        }
      }
      document.addEventListener('mousedown', listener)

      return () => {
        document.removeEventListener('mousedown', listener)
      }
    },
    [isHovered]
  )

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useAnimatedReaction(
    () => {
      // hovering out via click won't trigger this
      return isHovered.value
    },
    (hovered, previouslyHovered) => {
      if (hovered !== previouslyHovered) {
        if (hovered) {
          hoverIn.current?.()
        } else {
          hoverOut.current?.()
        }
      }
    },
    [isHovered, hoverIn, hoverOut]
  )

  const handleMouseEnter = useCallback(() => {
    if (isHoverEnabled() && !isHovered.value) {
      isHovered.value = true
    }
  }, [isHovered])

  const handleMouseLeave = useCallback(() => {
    if (isHovered.value) {
      isHovered.value = false
    }
  }, [isHovered])

  const child = React.Children.only(children) as React.ReactElement

  return (
    <HoveredContext.Provider value={isHovered}>
      {React.cloneElement(child, {
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        ref: mergeRefs([localRef, childRef || null]),
      })}
    </HoveredContext.Provider>
  )
}
