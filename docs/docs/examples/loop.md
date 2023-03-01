---
id: loop
title: Loop Animation
hide_table_of_contents: true
---

Create a loop animation of a box that goes up and down infinitely.

:::tip
Loop animations cannot be changed on the fly. If you want to restart a loop, you need to update a component's `key` prop.

See the explanation at the bottom.
:::

<iframe src="https://stackblitz.com/edit/nextjs-tn7loi?file=pages/index.tsx" className="stackblitz" />

### Warning

It's worth noting that using the `loop` cannot be changed. For example, you can't set `loop` to be `true` at a random time. It must be `true` when the component mounts, and stay true.

Similarly, the styles passed to `from` and `animate` must exist when the component mounts, and cannot change over time. If they do, we **cannot** guarantee a working loop animation.

### Why?

We're using Reanimated's `withRepeat` function under the hood, which repeats back to the **previous value**. That means that if you change the value on the fly, that is where it will repeat back to.

If you want a loop that's constant, make sure you set `loop: true` when the component mounts, and make sure that your `from` and `animate` prop **do not** change throughout the component's lifecycle.

### Sequences

Sequence animations cannot be paired with `loop: true` or with `repeat`.
