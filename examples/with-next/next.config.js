/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-var-requires */
// @generated: @expo/next-adapter@2.1.0
// Learn more: https://github.com/expo/expo/blob/master/docs/pages/versions/unversioned/guides/using-nextjs.md#withexpo
const { withExpo } = require('@expo/next-adapter')
const withPlugins = require('next-compose-plugins')
const path = require('path')
const fs = require('fs')

const packages = path.resolve(__dirname, '../..', 'packages')

const getPackageName = (name) => {
  if (name === 'moti') return 'moti'
  else return `@moti/${name}`
}

const packageFolderNames = fs
  .readdirSync(packages)
  .filter((name) => !name.startsWith('.'))

const withTM = require('next-transpile-modules')(
  packageFolderNames.map((name) => getPackageName(name))
)

module.exports = withPlugins([
  withTM({
    webpack: (config) => {
      packageFolderNames.forEach((name) => {
        config.resolve.alias[getPackageName(name)] = path.resolve(
          packages,
          name,
          require(`../../packages/${name}/package.json`).source
        )
      })

      return config
    },
  }),
  [
    withExpo,
    {
      projectRoot: __dirname,
    },
  ],
])
