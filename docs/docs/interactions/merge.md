---
id: merge
title: Custom Pressables
---

The `mergeAnimateProp` worklet makes it easy to build custom components on top of `MotiPressable`.

```tsx
const PressableScale = ({ animate, ...props }) => {
  return (
    <MotiPressable
      {...props}
      animate={(interaction) => {
        'worklet'

        return mergeAnimateProp(interaction, animate, {
          scale: interaction.pressed ? 0.96 : 1,
        })
      }}
    />
  )
}
```

## `mergeAnimateProp`

Say you want to build a `PressableScale` component, which changes to `scale: 0.96` when it's pressed.

You might start by making it like this:

```tsx
const PressableScale = (props) => {
  return (
    <MotiPressable
      {...props}
      animate={(interaction) => {
        'worklet'

        return {
          scale: interaction.pressed ? 0.96 : 1,
        }
      }}
    />
  )
}
```

However, this entirely overrides the `animate` prop you pass to `PressableScale`:

```tsx
<PressableScale animate={...} /> // this animate prop does nothing!
```

That's where `mergeAnimateProp` comes in. Pass it the interaction state, `animate` prop, and any overrides you want.

## TypeScript

```tsx
import React, { ComponentProps } from 'react'
import { MotiPressable, mergeAnimateProp } from 'moti/interactions'

type Props = ComponentProps<typeof MotiPressable>

const PressableScale = ({ animate, ...props }: Props) => {
  return (
    <MotiPressable
      {...props}
      animate={useMemo(
        () => (interaction) => {
          // useMemo has better TS support than useCallback
          'worklet'

          const { hovered, pressed } = interaction

          let scale = 1

          if (pressed) {
            scale = 0.95
          } else if (hovered) {
            scale = 0.97
          }

          return mergeAnimateProp(interaction, animate, {
            scale,
          })
        },
        [animate]
      )}
    />
  )
}
```

And in your component:

```tsx
<PressableScale
  animate={useMemo(
    () => (interaction) => {
      'worklet'

      return {
        opacity: interaction.pressed ? 0.5 : 1,
      }
    },
    []
  )}
/>
```

## Usage with Dripsy

```tsx
import React, { ComponentProps } from 'react'
import { MotiPressable, mergeAnimateProp } from 'moti/interactions'
import { styled } from 'dripsy'

const DripsyMotiPressable = styled(MotiPressable)()

type Props = ComponentProps<typeof DripsyMotiPressable> & {
  scaleTo?: number
}

const PressableScale = ({ animate, scaleTo = 0.96, ...props }: Props) => {
  return (
    <DripsyMotiPressable
      {...props}
      animate={useMemo(
        () => (interaction) => {
          'worklet'

          return mergeAnimateProp(interaction, animate, {
            scale: interaction.pressed ? scaleTo : 1,
          })
        },
        [animate]
      )}
    />
  )
}
```

Then, you can use it like so:

```tsx
<PressableScale sx={{ height: 100, bg: 'primary' }} />
```

## In children components

You can also use `mergeAnimateProp` in children components, with hooks like `useMotiPressable`

```tsx
import { MotiView } from 'moti'
import {
  MotiPressableProp,
  useMotiPressable,
  mergeAnimateProp,
} from 'moti/interactions'

type Props = {
  animate?: MotiPressableProp
}

export const ListItem = ({ animate }: Props) => {
  const state = useMotiPressable(
    (interaction) => {
      'worklet'

      return mergeAnimateProp(interaction, animate, {
        // your overrides go here
        opacity: interaction.pressed ? 1 : 0,
      })
    },
    [animate]
  )

  return <MotiView state={state} />
}

export default function List() {
  return (
    <MotiPressable>
      {items.map((id, index) => (
        <ListItem
          key={id}
          animate={({ hovered }) => {
            return {
              translateX: hovered ? index * 2 : 0,
            }
          }}
        />
      ))}
    </MotiPressable>
  )
}
```

## API

```ts
mergeAnimateProp(interaction, animateProp?, overrides?)
```

### Arguments

- `interaction` **required**: the current interaction state, given to you by the `animateProp`.

`overrides` will always supercede any values in `animate`.
