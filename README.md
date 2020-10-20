# 🍻 redrip

Dead-simple React Native components that animate when you want them to. No animated values to worry about – just style like you usually do.

```jsx
<View animate={{ width }} />
```

Powered by Reanimated 2.

<img src="https://media.giphy.com/media/4fCsKm2jbrMia2K2bh/giphy.gif" />

You can run the example app by running `yarn install && yarn start`.

> ⚠️ This is nothing more than an idea at the moment. See [this issue](https://github.com/nandorojo/dripsy/issues/46) on Dripsy to follow.

Here is my original post on that issue:

# What

There is an opportunity to make something like `react-native-animatable` that is powered by Reanimated 2.x. I think it would follow an API similar to CSS transitions. I'm looking to [`framer/motion`](https://www.framer.com/api/motion/) for inspiration on that, since it's super clean and easy to use.

# How

My top priority would be to achieve transitions at the component level, without any hooks, and with the least amount of code. It should be as simple as possible – no config. This seems like a great DX:

```jsx
const color = loading ? 'blue' : 'green'

<Text transitionProperty={'color'} sx={{ color }}/>
```

Under the hood, it would only use reanimated on native. Components would intelligently transition properties you tell it to. I don't have experience with Reanimated 2 yet, but it seems like they provide hooks that would make this remarkably doable. We could even default components to have `transitionProperty: all`, such that all you have to write is this:

```jsx
const color = loading ? 'blue' : 'green'

<Text sx={{ color }}/>
```

...and you get smooth transitions. Not sure if that's desired, but just spit balling.

We could use CSS transitions and keyframes on web, since RNW supports that. I'm not married to a specific method of solving this problem, though, so maybe Reanimated will work on web too.

In addition to property transitions, animations would be great:

```jsx
<View from={{ opacity: 1 }} to={{ opacity: 0 }} />
```

# Today

With react native web, CSS animations are really straightforward:

```jsx
const animationKeyframes = { from: { opacity: 0 }, to: { opacity: 1 } }
<View
  sx={{ animationKeyframes }}
/>
```

Same goes with transitions:

```jsx
const color = loading ? 'blue' : 'green'

<Text sx={{ color, transitionProperty: 'color' }}/>
```

**The problem is that this code is not universal.** It only works on web. In my opinion, using `Platform.select` or `Platform.OS === 'web'` is an anti-pattern when it comes to styles. That logic should all be handled by a low-level design system. Dripsy has made strides for responsive styles in this regard. Smooth transitions with a similar DX would be a big addition.

# Final point: good defaults

In the spirit of zero configuration, this library should have great defaults. It should know the right amount of time for the ideal transition in milliseconds. I would look to well-designed websites to see what the best kind of easing function is, and this would be the default.

There is a plethora of "unopinionated" animation projects for React Native. There are few that are dead-simple, highly-performant, and have professional presets from the get go. I don't want to create an animation library. Only a small component library that animates what you want, smoothly, without any setup.
