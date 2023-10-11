const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src'),
    '@api': path.resolve(__dirname, 'src/api'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@models': path.resolve(__dirname, 'src/models'),
    '@pages': path.resolve(__dirname, 'src/pages'),
    '@reducers': path.resolve(__dirname, 'src/reducers'),
    '@service': path.resolve(__dirname, 'src/service'),
    '@utils': path.resolve(__dirname, 'src/utils'),
    '@router': path.resolve(__dirname, 'src/router'),
  })
);
