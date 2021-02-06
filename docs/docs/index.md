---
id: welcome
title: Welcome to Moti
sidebar_label: Getting Started
slug: /
---

Moti is the universal animation package for React Native.

```tsx
<View from={{ opacity: 0 }} animate={{ opacity: 1 }} />
```

## Highlights

- Universal: works on all platforms
- 60 FPS animations run on the native thread
- Mount/unmount animations, like Framer Motion
- Powered by Reanimated 2
- Web support, out-of-the-box
- Expo support
- Intuitive API
- Variant & keyframe animations
- Strong TypeScript support
- Highly-configurable animations
- Sequence animations
- Loop & repeat animations

## Motivation

### Write once, animate anywhere.

First and foremost, I made moti because I need animations and transitions that work well on both websites & native apps.

In my opinion, React Native has the best mental model for building products. But when it comes to designing a multi-platform product at scale, you end up using `Platform.select` all over the place. I consider this an anti-pattern.

If you find yourself writing `Platform.OS === 'web'` when building UI inside of your app, something is wrong. Platform inconsistencies should be handled by third-party libraries that provide a centralized API. That's what makes (the ideal behind) React Native's mental model so great: write once, run anywhere.

From navigation to design, every open-source project I've worked on has tried to address such inconsistencies. For example, [Dripsy](https://github.com/nandorojo/dripsy) encourages you to design products based on **screen size**, not platform.

---

After months of trying different solutions Web and native, I decided I should make my own. Then Reanimated released v2 with a hooks API, and suddenly it all made sense. What we need is a performant animation library that lets us use component props to define different animation states. Hooks shouldn't be necessary. Styles should automatically transition the way CSS transitions do. Adding a 60 FPS animation should be as easy as adding a background color.

Reanimated 2 provides an elegant, low-level hooks API for driving performant animations. Framer Motion and React Spring always caught my eye on Web.

The goal was to combine the best parts of the aforementioned.

The funny part of all of this is, React web already has great solutions for animations. And yet, I'm spending my time building for React Native, which then also happens to work on web. It feels a bit odd and circular. But after working with both normal React as well as React Native, I think React Native is the true winner, even though it currently lags in many features.

### A final thought

The fact that React Native works on all platforms is great. But it's more of a consequence of its greatness than the greatness itself. What makes React Native so interesting as a technology is that it's so intuitive. Its simplicity lets you focus on the only thing that really matters: building great products, quickly. It's thanks to this intuitive mental model that it makes sense to use it on all platforms.

With React Native, we have an opportunity to abstract our ideas into what we want a user to experience, and not get bogged down by the concept of "what platform someone is using."

Today, it might be an iPhone. Tomorrow, it might be a virtual browser running on a cloud server.

If we get this right, it won't matter.

<!--
React Native provides the best mental model for building products. I've spent 2 years thinking about the best way to design within its apps, and I've come to the conclusion that we should design for screen size, not platform. This is what motivated me to create [Dripsy](https://github.com/nandorojo/dripsy). -->

## Background

If you want to learn more about the motivations behind the creation of `moti`, you can read this [GitHub issue](https://github.com/nandorojo/dripsy/issues/46) that I created on Dripsy.

## Author

Moti was created by Fernando Rojo. You can follow me on [Twitter](https://twitter.com/fernandotherojo).

## Thanks

It's hard to name all the people I should credit for moti. There are the obvious ones, like Software Mansion and the Expo team, who do the hard work that makes a library like this easy to build. Everyone who contributes to Reanimated has been really helpful.

Then there are the people behind great projects Framer Motion and React Spring, who gave me both guidance and inspiration on the best APIs to use.

## Contributing to React Native

If you're wondering how you can contribute to the React Native community, I encourage you to create packages that solve platform inconsistences. Help us give people a delightful user experience, regardless of what "device" they're using.

Here are some problems in React Native (Web) has that are exciting.

- **Popovers**

  - Tooltips, popovers, etc. are crucial to building a good app, namely on Web.
  - For popover menus, the typical expected experience is likely a bottom sheet on mobile screens, and an inline menu (or maybe a modal dialogue) on larger screens.
  - The best cross-platform solution would be a portal at the root of your app (see [react-native-portal](https://github.com/gorhom/react-native-portal)). It should measure items and overlay them accordingly.
  - If you're interested in solving this problem, it would be a huge contribution.
  - This would also allow us to make simple Toast/Notification components, etc.
  - React Native is ideal for building this. Instead of interacting with the DOM, you can just use a JS-based API.
  - Reanimated 2's `measure` function could be an interesting use case (but I'm not sure how stable it is.)

- **Navigation**

  - There have been great strides from React Navigation on web, but this remains an open question in many ways. React Navigation alone should be a good solution if you don't need server side rendering.
  - I've spent a lot of time thinking about cross-platform navigation and finding quirky solutions. I use Next.js, so I combine that with [`expo-next-react-navigation`](https://github.com/nandorojo/expo-next-react-navigation).
  - I'll likely write a full post about my experience with cross-platform navigation down the line.
    - My main solution is to create Next.js pages, put a modal stack navigator in each page, use React Navigation for opening modals, and `next/router` for page changes.
    - On native, I have a single `native-stack`, and I change the `initialRouteName` depending on which `tab` I'm in.
    - All `screen`s are shared across platforms.
  - All in all, I feel positively about the direction navigation is going. There are really smart people working on it. The last piece to solve is the right mental patterns to use.
