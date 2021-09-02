---
id: transforms
title: Transforms
---

Moti has a the same API for transforms as a normal React Native component.

It also comes with some added convenience.

Like always, you can do this:

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

Writing a transform array can be bulky. If you only have _one_ transform, you can pass it to Moti directly:

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

If you're using multiple transforms together, such as `scale` and `translateY`, you _must_ use an array.

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

Sequences for `transform` work like normal. Simply pass an array in place of your value

```tsx
<MotiView
  animate={{
    scale: [0, 1.1, { value: 1, delay: 200 }], // scale to 0, 1.1, then 200
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
