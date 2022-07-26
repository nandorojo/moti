---
id: next
title: Moti + Next.js
sidebar_label: Next.js Usage
---

There are 2 quick steps to getting Moti setup in a Next.js app.

## Step 1

Add `moti` to transpile modules.

```sh
yarn add next-transpile-modules
```

Your `next.config.js` file should look something like this:

```js
const { withExpo } = require('@expo/next-adapter')
const withFonts = require('next-fonts')
const withImages = require('next-images')
const withPlugins = require('next-compose-plugins')

const withTM = require('next-transpile-modules')(['moti'])

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
