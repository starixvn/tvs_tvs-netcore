const path = require('path');
const webpack = require('webpack');
module.exports = {
  resolve: {
    alias: {
      'moment-timezone': path.resolve(
        __dirname,
        'node_modules/moment-timezone/builds/moment-timezone-with-data-1970-2030.js'
      ),
    },
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    })
  ]
};
