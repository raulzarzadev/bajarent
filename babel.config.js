module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['module:react-native-dotenv'],
      [
        'module-resolver',
        {
          alias: {
            '@react-native-vector-icons/material-design-icons': './src/shims/material-community-icons',
            '@expo/vector-icons/MaterialCommunityIcons': './src/shims/material-community-icons',
          },
        },
      ],
    ],
  }
}
