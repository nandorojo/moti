---
id: transforms
title: Transforms
---

Moti has the same API for transforms as a normal React Native component.

It also comes with some added convenience.

Like always, you can use a `transform` array:

```tsx
<MotiView
  from={{
    transform: [{ scale: 0 }],
  }}
  animate={{
    transform: [{ scale: 1 }],
  }}
/>
```

Writing a transform array can be bulky. You can also pass your transforms directly:

```tsx
<MotiView
  from={{
    scale: 0,
  }}
  animate={{
    scale: 1,
  }}
/>
```

## Using multiple transforms

If you're using multiple transforms, be sure to retain their order inside of each prop.

```tsx
// ✅ scale first, then translateX
<MotiView
  from={{
    scale: 0,
    translateX: -10,
  }}
  animate={{
    scale: 1,
    translateX: 0,
  }}
/>
```

> This only works with Reanimated `2.3.0`+. For older versions, scroll down.

This will break your animation, since they have different orders:

```tsx
// 🚨 from & animate don't have the same orders for transforms!
// this will break
<MotiView
  from={{
    translateX: -10
    scale: 0,
  }}
  animate={{
    scale: 1,
    translateX: 0
  }}
/>
```

If you prefer to use an array for multiple transforms, you can do that too. Be sure to retain the order of your transforms across props.

```tsx
<MotiView
  from={{
    transform: [{ scale: 0 }, { translateX: -10 }],
  }}
  animate={{
    transform: [{ scale: 1 }, { translateX: 0 }],
  }}
/>
```

## Using multiple transforms (on old versions of Reanimated)

> The following only applies if you're using Reanimated `2.2` or older. As of `2.3.0`, you can use multiple transforms without an array if you want.

If you're using multiple transforms together, such as `scale` and `translateY`, and you're using Reanimated `2.2` or older, you _must_ use an array.

This example is okay, since `scale` is the only transform:

```tsx
// ✅ if you're only using one transform
<MotiView
  from={{
    scale: 0,
  }}
  animate={{
    scale: 1,
  }}
/>
```

But this won't work:

```tsx
// 🚨 if you're only using multiple transforms, use an array
<MotiView
  from={{
    scale: 0,
    translateY: -10,
  }}
  animate={{
    scale: 1,
    translateY: 0,
  }}
/>
```

Instead, pass `transform` arrays.

```tsx
// ✅ for multiple transforms, use an array
<MotiView
  from={{
    transform: [
      {
        scale: 0,
      },
      {
        translateY: -10,
      },
    ],
  }}
  animate={{
    transform: [{ scale: 1 }, { translateY: 0 }],
  }}
/>
```

Make sure the order in the `from` and `animate` prop is the same. In this case, we put `scale` before `translateY`.

## Sequences

Sequences for `transform` works like normal. Simply pass an array in place of your value

```tsx
<MotiView
  animate={{
    scale: [0, 1.1, { value: 1, delay: 200 }], // scale to 0, 1.1, then 1 (with delay 200 ms)
  }}
/>
```

That's equivalent to doing this:

```tsx
<MotiView
  animate={{
    transform: [{ scale: [0, 1.1, { value: 1, delay: 200 }] }],
  }}
/>
```
