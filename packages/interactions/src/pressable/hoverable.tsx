// credit to https://gist.github.com/ianmartorell/32bb7df95e5eff0a5ee2b2f55095e6a6
// this file was repurosed from there
// via this issue https://gist.github.com/necolas/1c494e44e23eb7f8c5864a2fac66299a
// because RNW's pressable doesn't bubble events to parent pressables: https://github.com/necolas/react-native-web/issues/1875

/* eslint-disable no-inner-declarations */
import { canUseDOM } from 'fbjs/lib/ExecutionEnvironment'

let isEnabled = false

if (canUseDOM) {
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

  function enableHover() {
    if (isEnabled || Date.now() - lastTouchTimestamp < HOVER_THRESHOLD_MS) {
      return
    }
    isEnabled = true
  }

  function disableHover() {
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

import React, { useCallback, ReactChild, useRef } from 'react'
import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated'
import { Platform } from 'react-native'

export interface HoverableProps {
  onHoverIn?: () => void
  onHoverOut?: () => void
  onPressIn?: () => void
  onPressOut?: () => void
  children: NonNullable<ReactChild>
}

export default function Hoverable({
  onHoverIn,
  onHoverOut,
  children,
  onPressIn,
  onPressOut,
}: HoverableProps) {
  const showHover = useSharedValue(true)
  const isHovered = useSharedValue(false)

  const hoverIn = useRef<undefined | (() => void)>(() => onHoverIn?.())
  const hoverOut = useRef<undefined | (() => void)>(() => onHoverOut?.())
  const pressIn = useRef<undefined | (() => void)>(() => onPressIn?.())
  const pressOut = useRef<undefined | (() => void)>(() => onPressOut?.())

  hoverIn.current = onHoverIn
  hoverOut.current = onHoverOut
  pressIn.current = onPressIn
  pressOut.current = onPressOut

  useAnimatedReaction(
    () => {
      // hovering out via click won't trigger this
      // return Platform.OS === 'web' && showHover.value && isHovered.value
      return Platform.OS === 'web' && isHovered.value
    },
    (hovered, previouslyHovered) => {
      if (hovered !== previouslyHovered) {
        if (hovered) {
          // no need for runOnJS, it's always web
          hoverIn.current?.()
        } else if (hoverOut.current) {
          hoverOut.current()
        }
      }
    },
    []
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

  const handleGrant = useCallback(() => {
    showHover.value = false
    pressIn.current?.()
  }, [showHover])

  const handleRelease = useCallback(() => {
    showHover.value = true
    pressOut.current?.()
  }, [showHover])

  let webProps = {}
  if (Platform.OS === 'web') {
    webProps = {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      // prevent hover showing while responder
      onResponderGrant: handleGrant,
      onResponderRelease: handleRelease,
    }
  }

  return React.cloneElement(React.Children.only(children) as any, {
    ...webProps,
    // if child is Touchable
    onPressIn: handleGrant,
    onPressOut: handleRelease,
  })
}
