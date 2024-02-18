import React from 'react'
import { MotiPressable } from 'moti/interactions'
import { useSharedValue } from 'react-native-reanimated'
import { MotiView } from 'moti'

global.shouldDebugMoti = false

export default function Factory() {
  const on = useSharedValue(true)
  return (
    <MotiPressable
      containerStyle={{ flex: 1, backgroundColor: 'blue' }}
      style={{ height: '100%', justifyContent: 'center', alignItems: 'center' }}
      animate={(interaction) => {
        'worklet'

        // console.log('[animate] pressable', interaction)

        return {
          // opacity: on.value ? 1 : 0,
        }
      }}
    >
      {(interaction) => (
        <MotiView
          animate={() => {
            'worklet'
            const { pressed } = interaction.value

            console.log('[moti-pressable]', interaction.value)

            return {
              scale: pressed ? 0.7 : 1,
            }
          }}
          style={{
            height: 300,
            width: 300,
            borderRadius: 16,
            backgroundColor: 'white',
          }}
        />
      )}
    </MotiPressable>
  )
}
