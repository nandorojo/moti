// Learn more https://docs.expo.io/guides/customizing-metro
/**
 * @type {import('expo/metro-config')}
 */
const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(__dirname, '../..')

const config = getDefaultConfig(__dirname)

config.watchFolders = [workspaceRoot]
config.resolver.nodeModulesPath = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

const defaultSourceExts = require('metro-config/src/defaults/defaults')
  .sourceExts

// fix framer-motion 5 on native
// https://github.com/facebook/metro/issues/535#issuecomment-970443661
config.resolver.sourceExts = process.env.RN_SRC_EXT
  ? [
      ...process.env.RN_SRC_EXT.split(',').concat(defaultSourceExts),
      'mjs',
      'cjs',
    ] // <-- mjs added here
  : [...defaultSourceExts, 'mjs', 'cjs']

config.transformer = {
  ...config.transformer,
  minifierPath: 'metro-minify-esbuild',
  minifierConfig: {},
}

module.exports = config
