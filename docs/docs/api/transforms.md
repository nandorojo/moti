---
id: transforms
title: Transforms
---

Moti has a slightly different API for transforms than a normal React Native component.

Rather than using a `transform` array, we pass the values directly:

```tsx
// ✅ pass scale, translateY directly
<View
  animate={{
    scale: 1,
    translateY: 5,
  }}
/>
```

```tsx
// 🚨 not this
<View
  animate={{
    transform: [{ scale: 1 }, { translateY: 5 }],
  }}
/>
```

By flattening the array, Moti can use an array syntax to power sequence animations. Also, I think it's a cleaner API like this anyway.
