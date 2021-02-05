# Moti + Next.js

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
