/* eslint-disable @typescript-eslint/no-var-requires */
const createExpoWebpackConfigAsync = require('@expo/webpack-config')
const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const packageName = 'moti'

const node_modules = path.resolve(__dirname, '..', 'node_modules')
const packages = path.resolve(__dirname, '..', 'packages')

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv)

  config.context = path.resolve(__dirname, '..')

  config.module.rules.push({
    test: /\.(js|ts|tsx)$/,
    include: /(packages|example)\/.+/,
    exclude: /node_modules/,
    use: 'babel-loader',
  })

  // TODO: This doesn't seem to work but maybe something similar
  // config.plugins.push(
  //   new webpack.DefinePlugin({
  //     'process.env.NODE_ENV': JSON.stringify(
  //       process.env.NODE_ENV || 'development'
  //     ),
  //     __DEV__: process.env.NODE_ENV === 'production' || true,
  //   })
  // )

  Object.assign(config.resolve.alias, {
    react: path.resolve(node_modules, 'react'),
    'react-native': path.resolve(node_modules, 'react-native-web'),
    'react-native-web': path.resolve(node_modules, 'react-native-web'),
    '@expo/vector-icons': path.resolve(node_modules, '@expo/vector-icons'),
  })

  fs.readdirSync(packages)
    .filter((name) => !name.startsWith('.'))
    .forEach((name) => {
      console.log(name, packages)
      config.resolve.alias[
        name === packageName ? packageName : `@${packageName}/${name}`
      ] = path.resolve(
        packages,
        name,
        require(`../packages/${name}/package.json`).source
      )
    })

  return config
}
