try {
  const { LinearGradient } = require('expo-linear-gradient')

  module.exports = { LinearGradient }
} catch {
  try {
    const LinearGradient = require('react-native-linear-gradient')
    module.exports = { LinearGradient }
  } catch (err) {
    if (__DEV__) {
      console.warn(
        `"expo-linear-gradient" or "react-native-linear-gradient" should be installed`
      )
    }

    throw err
  }
}
