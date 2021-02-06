---
id: imports
title: Imports
---

Currently, modi exports typical React Native components.

You can import like so:

```ts
import { View, Text, ScrollView, SafeAreaView, Image } from 'moti'
```

Since this might collide with the names of your React Native components, I would import them like this:

```tsx
import { View as MotiView } from 'moti'
```

Which looks like this:

```tsx
<MotiView />
```
