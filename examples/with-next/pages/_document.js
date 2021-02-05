// Based on https://github.com/zeit/next.js/tree/canary/examples/with-react-native-web
// and https://github.com/expo/expo-cli/blob/master/packages/webpack-config/web-default/index.html
import NextDocument, { Head, Main, NextScript } from 'next/document'
import * as React from 'react'
// import { SSRStyleReset } from 'dripsy'

import { AppRegistry } from 'react-native'

export const style = `
/**
 * Building on the RNWeb reset:
 * https://github.com/necolas/react-native-web/blob/master/packages/react-native-web/src/exports/StyleSheet/initialRules.js
 */
html, body, #__next {
  width: 100%;
  /* To smooth any scrolling behavior */
  -webkit-overflow-scrolling: touch;
  margin: 0px;
  padding: 0px;
  /* Allows content to fill the viewport and go beyond the bottom */
  min-height: 100%;
}
#__next {
  flex-shrink: 0;
  flex-basis: auto;
  flex-direction: column;
  flex-grow: 1;
  display: flex;
  flex: 1;
}
html {
  scroll-behavior: smooth;
  /* Prevent text size change on orientation change https://gist.github.com/tfausak/2222823#file-ios-8-web-app-html-L138 */
  -webkit-text-size-adjust: 100%;
  height: 100%;
}
body {
  display: flex;
  /* Allows you to scroll below the viewport; default value is visible */
  overflow-y: auto;
  overscroll-behavior-y: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -ms-overflow-style: scrollbar;
}
`

export async function getInitialProps({ renderPage }) {
  AppRegistry.registerComponent('Main', () => Main)
  const { getStyleElement } = AppRegistry.getApplication('Main')
  const page = renderPage()
  const styles = [
    <style
      key="base-style-reset"
      dangerouslySetInnerHTML={{ __html: style }}
    />,
    getStyleElement(),
  ]
  return { ...page, styles: React.Children.toArray(styles) }
}

export class Document extends NextDocument {
  static getInitialProps = getInitialProps
  render() {
    return (
      <html>
        <Head>
          {/* <SSRStyleReset /> */}
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}

export default Document
