---
id: web
title: Web Support
sidebar_label: Web Support
slug: /
---

Moti works on all platforms, including web. Just make sure you've installed `react-native-web` and done anything you need to get that working.

## Known issues

### Spring animations

In my experience, reanimated 2's spring animations are glitchy on web. I recommend using `timing` animations for now.

You can configure your animation settings using the `transition` prop of any Moti component.

```tsx
import React from 'react'
import { View } from 'moti'

export default function Timing() {
  return (
    <View
      from={{
        scale: 0.8,
        opacity: 0,
      }}
      animate={{
        scale: 1,
        opacity: 1,
      }}
      transition={{
        // timing instead of the default spring
        type: 'timing',
      }}
    />
  )
}
```
