import * as React from 'react'
import { AnimatePresence, MotiView } from 'moti'
import { StyleSheet } from 'react-native'
import { useMemo } from 'react'

const styles = StyleSheet.create({
  hidden: {
    display: 'none',
  },
})

export function MotiStackView({
  onExitComplete,
  initial,
  children,
  routeKey,
  exitBeforeEnter,
}: {
  onExitComplete: (() => void) | undefined
  initial: boolean | undefined
  children: React.ReactNode
  routeKey: string
  exitBeforeEnter: boolean | undefined
}) {
  return (
    <AnimatePresence
      onExitComplete={onExitComplete}
      {...(exitBeforeEnter && {
        exitBeforeEnter: true,
        mode: 'wait',
      })}
      initial={initial}
    >
      <React.Fragment key={routeKey}>
        {children}
        {useMemo(
          () => (
            // Hack to ensure `exitBeforeEnter` always fires
            <MotiView
              animate={{ opacity: 0.01 }}
              exit={{ opacity: 0 }}
              exitTransition={{ type: 'timing', duration: 1 }}
              style={styles.hidden}
            />
          ),
          []
        )}
      </React.Fragment>
    </AnimatePresence>
  )
}
