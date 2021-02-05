import React from 'react'

// pages/_app.js
import 'raf/polyfill'
// order matters here
global.setImmediate = requestAnimationFrame

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}
