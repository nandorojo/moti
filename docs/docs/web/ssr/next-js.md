---
id: next
title: Moti + Next.js
sidebar_label: Next.js Usage
---

There are 3 quick steps to getting Moti setup in a Next.js app.

## Step 1

Add `moti` to transpile modules.

```sh
yarn add next-transpile-modules
```

Your `next.config.js` file should look something like this:

```js
/* eslint-disable @typescript-eslint/no-var-requires */
const { withExpo } = require('@expo/next-adapter')
const withFonts = require('next-fonts')
const withImages = require('next-images')
const withPlugins = require('next-compose-plugins')

const withTM = require('next-transpile-modules')([
  'moti',
  // you can add other modules that need traspiling here
])

module.exports = withPlugins(
  [withTM, withFonts, withImages, [withExpo, { projectRoot: __dirname }]],
  {
    // ...
  }
)
```

## Step 2

Add the `raf` polyfill.

`yarn add raf`

Then add this in `pages/_app.js`

```jsx
import 'raf/polyfill' // add this at the top

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

We're going to use `requestAnimationFrame` with Reanimated web, so that polyfill makes it usable with server-side rendering frameworks.

## Step 3

:::tip

If you're using Reanimated `2.0.0-rc.3` or higher, you can skip this step, you're done.

:::

Alright, here goes a little hack to get Reanimated 2 working in Next.js. It's a simple copy-paste, so don't worry.

1. Install [`patch-package`](https://www.npmjs.com/package/patch-package) and follow its instructions
2. Create a folder called `patches` in your app root

Add this file: `patches/react-native-reanimated+2.0.0-rc.0.patch`

_^ replace `2.0.0-rc.0` with whatever version of Reanimated you're using._

Paste this in the file you created:

```diff
diff --git a/node_modules/react-native-reanimated/src/core/AnimatedNode.js b/node_modules/react-native-reanimated/src/core/AnimatedNode.js
index ac08f28..0aad94a 100644
--- a/node_modules/react-native-reanimated/src/core/AnimatedNode.js
+++ b/node_modules/react-native-reanimated/src/core/AnimatedNode.js
@@ -76,6 +76,9 @@ function runPropUpdates() {
   loopID += 1;
 }

+const scheduleUpdates =
+  Platform.OS === 'web' ? requestAnimationFrame : setImmediate;
+
 export default class AnimatedNode {
   __nodeID;
   __lastLoopID = { '': -1 };
@@ -141,7 +144,7 @@ export default class AnimatedNode {
   __markUpdated() {
     UPDATED_NODES.push(this);
     if (!propUpdatesEnqueued) {
-      propUpdatesEnqueued = setImmediate(runPropUpdates);
+      propUpdatesEnqueued = scheduleUpdates(runPropUpdates);
     }
   }
```

Then run `yarn install`. That should be enough 😅

### Some background on this hack

We need to change Reanimated's use of `setImmediate` on web to `requestAnimationFrame`. Long-story short, Reanimated uses a function called `setImmediate`, and Next.js doesn't support this. There are some hacks, and if you google "Expo + Next.js setimmediate", you'll find many posts of me complaining about it.

I've found the best solution is to replace `setImmediate` with `requestAnimationFrame` altogether, and that's what the patch above does.

### This is temporary

The patch will fix the problems for apps using Reanimated version `2.0.0-rc.0` (the version supported by Expo SDK 40). For later versions of Reanimated, this should already be fixed. You can track the issue here: https://github.com/software-mansion/react-native-reanimated/pull/1521

If you don't want to use patch-package, you can read the alternative solution below. It's buggier in my experience, though, since I [haven't](https://github.com/expo/expo/issues/7996) had good experiences with `setImmediate` polyfills with Next.js.

### Ummm

If this step made no sense to you, don't worry. Maybe you haven't even heard of `patch-package` before and you're like, what am I doing? I thought this was just an animation library? Trust me, I know; it's confusing and not necessary to understand to use Moti. Just copy and paste the steps and move on with your day.

As I mentioned, you'll be able to get rid of this hack once you upgrade Reanimated to `2.0.0-rc.3` or higher (or upgrade to Expo SDK 41 when it's out.)

---

### Alternative solution (without patch package)

If you don't want to use `patch-package`, as I recommend, your alternative is to try to polyfill `setImmediate`. This is a hack for versions of Reanimated 2 that still use `setImmediate`.

`yarn add setimmediate`

Your `pages/_app.js` should have these imports at the very top:

```jsx
// pages/_app.js
import 'raf/polyfill'
// order matters here
global.setImmediate = requestAnimationFrame
import 'setimmediate'

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

This is a constant source of bugs with Reanimated and Next.js. **You may need to import these polyfills at the top of other files that use reanimated/moti if it persists.** Please run `yarn next build` and run locally before deploying to make sure it works on your app.

I typically deploy to Vercel on a branch to make sure it works. It's random, but sometimes your page will error and get "unexpected error occurred", and the console logs will have an error that reads `setImmediate is not defined`. If you see this, you aren't alone.

You might also want to install the `setimmediate` package, and put it at the top with the other polyfills.

A newer version of Reanimated (not yet supported by Expo) changes `setImmediate` to `requestAnimationFrame`. This should fix the problem. Once you upgrade to that version,you should only need to add the the `raf/polyfill` in `pages/_app.js`, and ideally the bugs will disappear.

For the record, you might need to add those imports into any file that uses Moti. It's really unpredictable, which is why I recommend the patch-package fix instead.

<!--

# Possible errors

## Null/undefined to object

When using Moti with Next.js, you might see this error:

```sh
TypeError: Cannot convert undefined or null to objec
```

Relevant issue [here](https://github.com/nandorojo/moti/issues/10).

The solution is to make sure your `babel.config.js` exports a function, following the expo docs. It should look like this:

```js
// ✅ works
module.exports = function (api) {
  api.cache(false)
  return {
    presets: ['@expo/next-adapter/babel'],
    plugins: ['react-native-reanimated/plugin'],
  }
}

// 😡 breaks
module.exports = {
  presets: ['@expo/next-adapter/babel'],
  plugins: ['react-native-reanimated/plugin'],
}
```
-->
