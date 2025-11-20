const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Customize the config before returning it.
  config.resolve.alias = {
    ...config.resolve.alias,
    // Alias react-native-vector-icons to @expo/vector-icons
    'react-native-vector-icons': '@expo/vector-icons',
    // Specific alias to silence the warning in react-native-paper
    '@react-native-vector-icons/material-design-icons': '@expo/vector-icons/MaterialCommunityIcons',
  };

  return config;
};
