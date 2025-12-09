const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Customize the config before returning it.
  config.resolve.alias = {
    ...config.resolve.alias,
  };

  // Activa `ANALYZE=true` para generar un reporte estático del bundle web.
  if (process.env.ANALYZE) {
    config.plugins = config.plugins || [];
    config.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: 'bundle-report.html',
        defaultSizes: 'gzip',
      }),
    );
  }

  return config;
};
